import Axios from "axios";
import { User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import create from "zustand";
import { db } from "./Firebase";

export interface iState {
  userInfo: any;
  conversionRate: number;
  conversionSym: string;
  darkmode: boolean;
  setDarkMode: () => void;
  setUserInfo: (logged: any) => void;
  setConversionRate: (rate: number, sym?: string) => void;
}

const useProfileStore = create<iState>((set, get) => ({
  userInfo: null,
  conversionRate: 1,
  conversionSym: "usd",
  darkmode: false,

  setUserInfo: async (user: User) => {
    if (user) {
      const result = (await getDoc(doc(db, "users", user.uid))).data();
      set(() => ({
        userInfo: result,
        darkmode: result && result.user.darkmode,
      }));
      get().setConversionRate(result && result.user.conversionRate, result && result.user.currency);
    }
  },

  setDarkMode: async () => {
    set(() => ({
      darkmode: !get().darkmode,
    }));
    await setDoc(
      doc(db, "users", get().userInfo.user.uid),
      { user: { darkmode: get().darkmode } },
      {
        merge: true,
      }
    );
  },

  setConversionRate: async (rate, sym) => {
    set(() => ({
      conversionRate: rate? rate:1,
      conversionSym: sym ? sym : "usd",
    }));
    await setDoc(
      doc(db, "users", get().userInfo.user.uid),
      { user: { currency: sym ? sym : "usd" , conversionRate:rate? rate:1} },
      {
        merge: true,
      }
    );
  },
}));

export default useProfileStore;
