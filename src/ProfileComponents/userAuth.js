import { createContext, useContext, useEffect, useState } from "react";
import { act } from "@testing-library/react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";
import { auth } from "./Firebase";
import { getDoc } from "firebase/firestore";

//we create a context and we call it userAuthContext
const userAuthContext = createContext();

//we create a context component that we will use to wrap our routes in App.js
export function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState("");

  function signInAnon() {
    return signInAnonymously(auth);
  }

  //sign up function
  function signUp(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  //log in fucntion
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  //logout function
  function logout() {
    return signOut(auth);
  }

  //sign in with google
  function googleSignIn() {
    const googleAuthProvider = new GoogleAuthProvider();
    return signInWithPopup(auth, googleAuthProvider);
  }

  function GitHubSignIn() {
    const githubAuthProvider = new GithubAuthProvider();
    return signInWithPopup(auth, githubAuthProvider);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    //we pass the value that we want to use for context
    <userAuthContext.Provider
      value={{
        user,
        signUp,
        login,
        logout,
        googleSignIn,
        signInAnon,
        GitHubSignIn,
      }}
    >
      {children}
    </userAuthContext.Provider>
  );
}

//we export the function that we will use to get the context when needed
export function useUserAuth() {
  return useContext(userAuthContext);
}
