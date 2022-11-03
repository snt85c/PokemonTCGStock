import MenuHome from "./MenuHome";
import MenuSearch from "./MenuSearch";
import MenuCollection from "./MenuCollection";
import MenuProfile from "./MenuProfile";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addDoc, collection, doc } from "firebase/firestore";
import { db } from "../ProfileComponents/Firebase";

export default function Menu(props:{ setTranslate: React.Dispatch<React.SetStateAction<number>>}) {
  // const navigate = useNavigate();
  const [active, setActive] = useState<
    "home" | "search" | "collection" | "profile" | ""
  >("");
  return (
    <div
      className="
      fixed
      flex
      justify-evenly
      items-center
      bottom-0
      h-[10%]
      w-full
      text-white
      z-50 
      pb-2 
      duration-300 
      btm-nav"
    >
      <a
      href="#home"
        onClick={() => {
          setActive("home");
          // navigate("/");
          // addDoc(collection(db, "cardsDB"), {
          //   name: "test " + new Date().getMinutes().toLocaleString(), date: new Date()
          // });
        }}
        className={`${active === "home" ? "active" : ""} `}
      >
        <MenuHome {...{ setActive }} />
      </a>
      <a
      href="#search"
        onClick={() => {
          setActive("search");
          // navigate("/search");
        }}
        className={`${active === "search" ? "active" : ""} `}
      >
        <MenuSearch {...{ setActive }} />
      </a>
      <a
      href="#collection"
        onClick={() => {
          setActive("collection");
          // navigate("/collection");
        }}
        className={`${active === "collection" ? "active" : ""} `}
      >
        <MenuCollection {...{ setActive }} />
      </a>
      <a
      href="#profile"
        onClick={() => {
          setActive("profile");
          // navigate("/profile");
        }}
        className={`${active === "profile" ? "active" : ""} `}
      >
        <MenuProfile {...{ setActive }} />
      </a>
    </div>
  );
}

/**
const { addDoc, collection } = require("firebase/firestore");
const db = require("./Firebase");
const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.scheduledFunction = functions.pubsub
  .schedule("every 5 minutes")
  .onRun((context) => {
    const send = [];
    try {
      const url = `https://api.pokemontcg.io/v2/cards?q=name:"q"`;
      fetch(url, {
        method: "GET",
        headers: {
          "X-Auth-Token": "3b7be5e5-54b3-4668-9831-c6f5616d9168",
        },
      })
        .then((resp) => resp.json())
        .then((data) => {
          const result = data.data.map((card) => {
            return card;
          });
          send.push(result);
        });
    } catch (e) {
      console.log(e);
    }
    addDoc(collection(db, "cardsDB"), send);
    console.log("This will be run every 5 minutes!");
    return null;
  });



 */
