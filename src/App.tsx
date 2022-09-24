import {
  UserAuthContextProvider,
  useUserAuth,
} from "./LoginComponents/userAuth";
import Navbar from "./LoginComponents/Profile";
import Search from "./SearchbarComponents/Search";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Menu from "./MenuComponents/Menu";
import Home from "./HomeComponents/Home";
import Collection from "./CollectionComponent/Collection";
import { setDoc, doc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { db } from "./LoginComponents/Firebase";
import useCollectionStore from "./CollectionComponent/useCollectionStore";
import { iCollectionStore } from "./Interfaces";
import Loading from "./Loading";

function App() {
  const { user } = useUserAuth();

  const setUserDeckFromFirebase = useCollectionStore(
    (state: iCollectionStore) => state.setUserDeckFromFirebase
  );

  const isLoading = useRef(true);

  useEffect(() => {
    isLoading.current = true
    async function set() {
      if (user) {
        console.log("logged as: ", user.displayName);
        try {
          await setDoc(
            doc(db, "users", user.uid),
            {
              user: {
                displayName: user.displayName && user.displayName.split(" ")[0],
                photoURL: user.photoURL,
                uid: user.uid,
              },
            },
            { merge: true }
          );
          setUserDeckFromFirebase(user);
        } catch (err) {
          console.log(err);
        }
      }
    }
    set().then(() => {
      isLoading.current = false
    });
  }, [user]);

  return (
    <>
      <Loading isLoading={isLoading} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/user" element={<Navbar />} />
          <Route path="/collection" element={<Collection />} />
        </Routes>
      <Menu />
      </BrowserRouter>
    </>
  );
}

export default App;
