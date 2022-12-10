const functions = require("firebase-functions");
const admin = require("firebase-admin");
const pokemon = require("pokemontcgsdk");
admin.initializeApp();
const db = admin.firestore();
const apiKey = "f62ff961-6c90-4151-991f-25985d01113d";
pokemon.configure({apiKey});

exports.scheduledFunction = functions.pubsub
  .schedule("0 */3 * * *")
  //"0 * * * *" //every hour
  // "0 */12 * * *" //every 12 h
  // "0 */3 * * *" //every 3h
  // "*/5 * * * *" //every 5min
  .onRun((context) => {
    /* eslint-disable max-len */
    (async () => {
      try {
        const date = new Date();
        pokemon.card.all().then((cards) => {
          functions.logger.log(cards.length, " cards fetched");
          cards.forEach(async (card) => {
            await db
              .collection("cardsDB")
              .doc(date.toString())
              .collection("cards")
              .doc(card.id)
              .set({card});
          });
        });
        return 1;
      } catch (e) {
        functions.logger.log(e);
      }
    })();
  });

/*
exports.scheduledFunction = functions.pubsub
  .schedule("* * * * *")
  .onRun((context) => {
    (async () => {
      try {
        const date = new Date();
        for (let i = 0; i < 10; i++) {
          db.collection("cardsDBTest")
            .doc(date.toString())
            .collection("cards")
            .doc(i.toString())
            .set({date: date.toString()}); //new
        }
        return 1;
      } catch (e) {
        functions.logger.log(e);
      }
    })();
  })
  */
