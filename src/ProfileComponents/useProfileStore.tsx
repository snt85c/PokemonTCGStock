import { User } from "firebase/auth";
import { getDoc } from "firebase/firestore";
import create from "zustand";
import { db } from "../ProfileComponents/Firebase";
import {
  doc,
  arrayUnion,
  updateDoc,
  arrayRemove,
  deleteDoc,
  getDocs,
  setDoc,
  addDoc,
  collection,
} from "firebase/firestore";

export interface iState {
  user: User | null;
  userInfo: any;
  conversionRate: number;
  conversionSym: string;
  setUser: (logged: any) => void;
  setUserInfo: (user: string) => void;
  setConversionRate: (rate: number) => void;
  setConversionSymbol: (sym: string) => void;
}

const useProfileStore = create<iState>((set, get) => ({
  user: null,
  userInfo: null,
  conversionRate: 1,
  conversionSym: "usd",
  setUser: (logged) => set(() => ({ user: logged })),
  setUserInfo: async (user) => {
    if (user) {
      const ref = doc(db, "users", user);
      let result = (await getDoc(ref)).data();
      set(() => ({ userInfo: result }));
    }
  },
  setConversionRate: (rate) => set(() => ({ conversionRate: rate })),
  setConversionSymbol: (sym) => set(() => ({ conversionSym: sym })),
}));

export default useProfileStore;
