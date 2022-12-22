const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const pokemon = require("pokemontcgsdk");
const db = admin.firestore();
const apiKey = "f62ff961-6c90-4151-991f-25985d01113d";

pokemon.configure({apiKey});

exports.scheduledFunction = functions
  .runWith({timeoutSeconds: 540, memory: "1GB"})
  .pubsub.schedule("0 */8 * * *")
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

    // Fetch cards in small batches
    const fetchCards = () => {
      let page = 1;
      let cards = [];
      return pokemon.card.all({page: page, pageSize: 250}).then((response) => {
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

        // Create collection with an object before setting data, otherwise the collection cannot be accessed (somethign somethign firebase won't allow an empty collection, a document has to be set inbetween)
        const promises = [];
        let iteration = await getCardsDBSize();
        db.collection("cardsDB").doc(iteration).set({date, iteration});

        if (cards.length > 0) {
          cards.forEach(
            (card) => {
              if (card) {
                const data = {
                  ...card,
                  fetchedAt: date,
                };
                promises.push(
                  db
                    .collection("cardsDB")
                    .doc(iteration)
                    .collection("cards")
                    .doc(card.id)
                    .set(data)
                );
              }
            },
            () => {
              //callback function if forEach doesn't execute
              functions.logger.log("No cards to save!");
            }
          );
        }
        return Promise.all(promises);
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
