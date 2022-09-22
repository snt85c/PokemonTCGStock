import { useEffect } from "react";
import useStore from "./UsersStore";
import { useUserAuth } from "./userAuth";
import { doc, DocumentData, getDoc, setDoc } from "firebase/firestore";
import { db } from "./Firebase";
import { User } from "firebase/auth";
import useCollectionStore from "../CollectionComponent/useCollectionStore";
import { iCollection, iCard } from "../Interfaces";
export default function Navbar() {
  const { user, googleSignIn, logout } = useUserAuth();

  const setUserOnStore = useStore((state) => state.setUser);

  useEffect(() => {
    setUserOnStore(user);
    async function set() {
      if (user) {
        console.log("logged as: ", user.displayName)
        try {
          await setDoc(
            doc(db, "users", user.uid),
            {
              user: {
                displayName:
                  user.displayName &&
                  user.displayName.split(" ")[0],
                photoURL: user.photoURL,
                uid: user.uid,
              },
            },
            { merge: true }
          );
        } catch (err) {
          console.log(err);
        }
      }
    }
    set();
    // console.log(useStore.getState());
  }, [user]);

  function Login() {
    return (
      <button
        onClick={() => {
          googleSignIn();
        }}
      >
        Login
      </button>
    );
  }

  function Logout() {
    return (
      <button
        onClick={() => {
          logout();
        }}
      >
        Logout
      </button>
    );
  }

  return (
    <div className=" flex flex-col justify-center items-center m-5">
      {user && <div>uid:{user.uid}</div>}
      {user && <div>name:{user.displayName}</div>}
      {!user && <Login />}
      {user && <Logout />}
    </div>
  );
}
