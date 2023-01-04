const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const pokemon = require("pokemontcgsdk");
const db = admin.firestore();
const apiKey = "f62ff961-6c90-4151-991f-25985d01113d";

pokemon.configure({apiKey});

exports.scheduledFunction = functions
  .runWith({timeoutSeconds: 540, memory: "2GB"})
  .pubsub.schedule("0 0 * * *")
  //every 15min "*/15 * * * *"
  //every 30min "*/30 * * * *"
  // every hour "0 * * * *"
  // every 3 hours "0 */3 * * *"
  //every 8h "0 */8 * * *"
  // every 12h "0 */12 * * *"
  .onRun((context) => {
    /* eslint-disable max-len */

    //get the size of the cardDB collection, to be used as the name of the newly created document
    async function getCardsDBSize() {
      try {
        const snapshot = await db.collection("cardsDB").get();
        return snapshot.size.toString();
      } catch (error) {
        console.error(error);
      }
    }

    const fetchCards = () => {
      // Fetch cards in small batches, if i fetch all at once i might incour in exit:timeout
      let page = 1;
      let cards = [];
      return pokemon.card.all({page: page, pageSize: 550}).then((response) => {
        cards = cards.concat(response);
        if (response.nextPage) {
          page++;
          return fetchCards();
        }
        return cards;
      });
    };

    // Fetch all cards
    return fetchCards()
      .then(async (cards) => {
        console.log(cards.length, " total elements");
        // Get current date
        const date = new Date();
        const BATCH_SIZE = 50;
        let iteration = await getCardsDBSize();
        // Create collection with a dummy object before setting data, otherwise the collection cannot be accessed (Adding collection and documents to an empty document rule)
        db.collection("cardsDB").doc(iteration).set({date, iteration});
        let batch = db.batch();
        if (cards.length > 0) {
          cards.forEach(
            (card, index) => {
              if (card) {
                const data = {
                  ...card,
                  fetchedAt: date,
                };
                //once again create collection with a dummy object before setting data, otherwise the collection cannot be accessed (Adding collection and documents to an empty document rule)
                db.collection("cardsDB")
                  .doc(iteration)
                  .collection("sets")
                  .doc(card.set.id)
                  .set({set: card.set.name, date, iteration});

                const docRef = db
                  .collection("cardsDB")
                  .doc(iteration)
                  .collection("sets")
                  .doc(card.set.id)
                  .collection("cards")
                  .doc(card.id);

                //i cluster the data in batches
                batch.create(docRef, {
                  ...data,
                  id: card.id,
                });
                if (index % BATCH_SIZE === BATCH_SIZE - 1) {
                  //i commmit the batch when i reach the BATCH_SIZE to save time on the execution otherwise i reach DEADLINE_EXCEED or exit:timeout
                  batch.commit();
                  batch = db.batch();
                }
              }
            },
            () => {
              //callback function if forEach doesn't execute
              functions.logger.log("No cards to save!");
            }
          );
          await batch.commit();
        }
      })
      .then(() => {
        console.log("Successfully saved cards to Firestore!");
        return null;
      })
      .catch((error) => {
        console.error(error);
        throw error;
      });
  });

exports.sumCardPrices = functions.pubsub
  .schedule("0 0 * * *")
  .onRun(async () => {
    const date = new Date();
    const usersSnapshot = await db.collection("users").get();
    const users = usersSnapshot.docs;

    // Iterate through all users
    for (const user of users) {
      const decksSnapshot = await user.ref.collection("decks").get();
      const decks = decksSnapshot.docs;
      const snapshot = await user.ref.collection("historicalValue").get();
      let size = snapshot.size ? snapshot.size.toString() : "0";

      // Iterate through all decks for the user
      for (const deck of decks) {
        user.ref
          .collection("historicalValue")
          .doc(size)
          .set({lastUpdate: date, iteration: size});
        const cardsSnapshot = await deck.ref.collection("cards").get();
        const cards = cardsSnapshot.docs;

        let totalPrice = 0;
        // Iterate through all cards in the deck
        for (const card of cards) {
          const data = card.data();
          // Find the key for the prices (e.g. "holofoil", "normal")
          // const pricekeys = Object.keys(data.tcgplayer.prices);
          // for (const pricekey of pricekeys) {
          //   totalPrice += data.tcgplayer.prices[pricekey].market;
          // }

          totalPrice += data.tcgplayer.prices[data.userDeckInfo.type].market;
        }

        //set a doc inside historicalValue collection with a doc
        user.ref
          .collection("historicalValue")
          .doc(size)
          .set({lastUpdate: date, iteration: size});
        // set the rest of the data inside that collection
        user.ref
          .collection("historicalValue")
          .doc(size)
          .collection(deck.id)
          .doc("value")
          .set({
            totalPrice: totalPrice.toFixed(2),
            date,
            iteration: size,
          });
      }
    }
  });
