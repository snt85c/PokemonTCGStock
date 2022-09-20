import { useEffect } from "react";
import useStore from "../UsersStore";
import { useUserAuth } from "./userAuth";
import {
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "./Firebase";
import { User } from "firebase/auth";
export default function Navbar() {
  const { user, googleSignIn, logout } = useUserAuth();

  const setUserOnStore = useStore((state) => state.setUser);
  const loggedUser: User | null = useStore((state) => state.user);

  useEffect(() => {
    setUserOnStore(user);
    async function set() {
      if (loggedUser) {
        try {
          await setDoc(
            doc(db, "users", loggedUser.uid),
            {
              user: {
                displayName:
                  loggedUser.displayName &&
                  loggedUser.displayName.split(" ")[0],
                photoURL: loggedUser.photoURL,
                uid: loggedUser.uid,
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
      {loggedUser && <div>uid:{loggedUser.uid}</div>}
      {loggedUser && <div>name:{loggedUser.displayName}</div>}
      {!loggedUser && <Login />}
      {loggedUser && <Logout />}
    </div>
  );
}
