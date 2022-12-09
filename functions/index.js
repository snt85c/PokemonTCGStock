const functions = require("firebase-functions");
const admin = require("firebase-admin");
const pokemon = require("pokemontcgsdk");
admin.initializeApp();
const db = admin.firestore();
const apiKey = "f62ff961-6c90-4151-991f-25985d01113d";
pokemon.configure({apiKey});

exports.scheduledFunction = functions.pubsub
  .schedule("0 */12 * * *")
  .onRun((context) => {
    /* eslint-disable max-len */
    const date = new Date();
    (async () => {
      const date = new Date();
      pokemon.card.all().then((cards) => {
        cards.forEach(async (card) => {
          // await setDoc(doc(db, "cardsDB", date.toString(),"cards", card.id), {card},{merge:false});
          await db
            .collection("cardsDB")
            .doc(date.toString())
            .collection("cards")
            .doc(card.id)
            .set({card});
        });
      });
      functions.logger.log("END");
      return allCards;
    })();
  });
