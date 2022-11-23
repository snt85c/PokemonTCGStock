const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const fetch = require("node-fetch");
const db = admin.firestore();
const APIKEY = "f62ff961-6c90-4151-991f-25985d01113d";

exports.scheduledFunction = functions.pubsub
  .schedule("0 */3 * * *")
  .onRun((context) => {
    const date = new Date();
    (async () => {
      let allCards = [];

      let currentPage = 1;
      while (true) {
        const url = `https://api.pokemontcg.io/v2/cards?page=${currentPage}`;
        try {
          const response = await fetch(url, {
            mode: "cors",
            headers: {
              "X-Api-Key": APIKEY,
              "Content-Type": "application/json",
              Connections: "keep-alive",
            },
          });

          const data = await response.json();

          allCards.push.apply(allCards, data.data);

          if (allCards.length >= data.totalCount) {
            break;
          }
        } catch (err) {
          console.log(err);
        }

        currentPage += 1;
      }
      return allCards;
    })();
    db.collection("cardsDB").doc(date.toString()).set({date, allCards});
  });

// const functions = require("firebase-functions");
// const admin = require("firebase-admin");
// admin.initializeApp();
// const fetch = require("node-fetch");
// const https = require("https");

// const db = admin.firestore();
// exports.scheduledFunction = functions.pubsub
//     .schedule("0 */8 * * *")

// // "* * * * *" every minute
// // "*/5 * * * *" every 5 minutes
// // "0 */8 * * *" every 8 hours
// // "0 0 * * *" once a day (midnight)

// /* eslint-disable max-len */

//     .onRun((context) => {
//       const agent = new https.Agent({
//         keepAlive: false, // true
//       });
//       const date = new Date();
//       db.collection("users")
//           .get()
//           .then((snapshot) => {
//             snapshot.forEach((user) => {
//               const uid = user.data().user.uid;
//               // console.log(user.data().user.uid); // get all the users
//               db.collection("users")
//                   .doc(uid)
//                   .collection("decks")
//                   .get()
//                   .then((snapshot) => {
//                     snapshot.forEach((decks) => {
//                       // const result = [];
//                       let cards = "";
//                       const result = [];
//                       const deck = decks.data().id;
//                       // console.log(decks.data().id); // get all the decks
//                       db.collection("users")
//                           .doc(uid)
//                           .collection("decks")
//                           .doc(deck)
//                           .collection("cards")
//                           .get()
//                           .then((snapshot) => {
//                             if (snapshot.size !== 0) {
//                               snapshot.forEach((card) => {
//                                 const cardID = card.data().id;
//                                 // console.log(card.data().id);
//                                 // get all the cards
//                                 cards += "id:" + cardID + " or ";
//                                 result.push({
//                                   id: cardID,
//                                   quantity: card.data().userDeckInfo.quantity,
//                                   date,
//                                 });
//                               });
//                             }
//                           })
//                           .then(() => {
//                             try {
//                               if (cards.length > 0) {
//                                 cards = cards.slice(0, -4);
//                                 const url =
//                           "https://api.pokemontcg.io/v2/cards?q=" + cards;
//                                 fetch(url, {
//                                   method: "GET",
//                                   headers: {
//                                     "Connection": "keepalive", // keepalive
//                                     "X-Auth-Token":
//                               "3b7be5e5-54b3-4668-9831-c6f5616d9168",
//                                   },
//                                   agent,
//                                 })
//                                     .then((resp) => resp.json())
//                                     .then((data) => {
//                                       data.data.map((card) => {
//                                         result.forEach((item) => {
//                                           if (item.id === card.id) {
//                                             item.prices = card.tcgplayer.prices;
//                                           }
//                                         });
//                                         db.collection("users")
//                                             .doc(uid)
//                                             .collection("decks")
//                                             .doc(deck)
//                                             .collection("cards")
//                                             .doc(card.id)
//                                             .set(
//                                                 {tcgplayer: card.tcgplayer},
//                                                 {merge: true}
//                                             );
//                                       });
//                                       db.collection("users")
//                                           .doc(uid)
//                                           .collection("decks")
//                                           .doc(deck)
//                                           .collection("cardDB")
//                                           .doc(date.toString())
//                                           .set({result});
//                                     });
//                               }
//                             } catch (e) {
//                               console.log(e);
//                             }
//                           });
//                     });
//                   });
//             });
//             return null;
//           })
//           .catch((error) => {
//             console.log(error);
//           });
//     });
