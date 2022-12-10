const functions = require("firebase-functions");
const admin = require("firebase-admin");
const pokemon = require("pokemontcgsdk");
admin.initializeApp();
const db = admin.firestore();
const apiKey = "f62ff961-6c90-4151-991f-25985d01113d";
pokemon.configure({apiKey});

exports.scheduledFunction = functions.pubsub
  .schedule("0 * * * *")
  //"0 * * * *" //every hour
  // "0 */12 * * *" //every 12 h
  .onRun((context) => {
    /* eslint-disable max-len */
    (async () => {
      try {
        const date = new Date();
        pokemon.card.all().then((cards) => {
          functions.logger.log(cards.length);
          cards.forEach(async (card) => {
            await db
              .collection("cardsDB")
              .doc(date.toString())
              .collection("cards")
              .doc(card.id)
              .set({card});
          });
        });
        functions.logger.log("END");
        return 1;
      } catch (e) {
        functions.logger.log(e);
      }
    })();
  });
