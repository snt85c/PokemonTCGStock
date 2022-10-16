const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const fetch = require("node-fetch");
const db = admin.firestore();
exports.scheduledFunction = functions.pubsub
    .schedule("0 0 * * *")
// "* * * * *" every minute
// "*/5 * * * *" every 5 minutes
// "0 0 * * *" once a day (midnight)

    .onRun((context) => {
      const date = new Date().toString();
      db.collection("users")
          .get()
          .then((snapshot) => {
            snapshot.forEach((user) => {
              const uid = user.data().user.uid;
              // console.log(user.data().user.uid); // get all the users
              db.collection("users")
                  .doc(uid)
                  .collection("decks")
                  .get()
                  .then((snapshot) => {
                    snapshot.forEach((decks) => {
                      const result = [];
                      const deck = decks.data().id;
                      // console.log(decks.data().id); // get all the decks
                      db.collection("users")
                          .doc(uid)
                          .collection("decks")
                          .doc(deck)
                          .collection("cards")
                          .get()
                          .then((snapshot) => {
                            snapshot.forEach((card) => {
                              const cardID = card.data().id;
                              // console.log(card.data().id);
                              // get all the cards
                              try {
                                const url =
                          "https://api.pokemontcg.io/v2/cards?q=id:" + cardID;
                                fetch(url, {
                                  method: "GET",
                                  headers: {
                                    "X-Auth-Token":
                              "3b7be5e5-54b3-4668-9831-c6f5616d9168",
                                  },
                                })
                                    .then((resp) => resp.json())
                                    .then((data) => {
                                      data.data.map((card) => {
                                        // console.log(card.name);
                                        result.push({
                                          /* eslint-disable max-len */
                                          prices: card.tcgplayer,
                                          id: card.id,
                                          date: new Date(),
                                          /* eslint-enable max-len */
                                        });
                                      });
                                      db.collection("users")
                                          .doc(uid)
                                          .collection("decks")
                                          .doc(deck)
                                          .collection("cardDB")
                                          .doc(date)
                                          .set({result});
                                    });
                              } catch (e) {
                                console.log(e);
                              }
                            });
                          });
                    });
                  });
            });
            return true;
          })
          .catch((reason) => {
            console.log(reason);
          });
    });
