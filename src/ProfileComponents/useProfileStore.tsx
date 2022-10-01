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
  setConversionRate: (rate: string, user?: User) => void;
}

const useProfileStore = create<iState>((set, get) => ({
  userInfo: null,
  conversionRate: 1,
  conversionSym: "",
  darkmode: false,

  setUserInfo: async (user: User) => {
    if (user) {
      const result = (await getDoc(doc(db, "users", user.uid))).data();
      set(() => ({
        userInfo: result,
        darkmode: result && result.user.darkmode,
      }));
      get().setConversionRate(result && result.user.currency, user);
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

  setConversionRate: async (rate, user) => {
    let newConversionRate = 1;
    Axios.get(
      `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd.json`
    ).then((res) => {
      newConversionRate = res.data[rate ? rate : "usd"];
    });
    set(() => ({
      conversionRate: newConversionRate,
      conversionSym: rate ? rate : "usd",
    }));
    await setDoc(
      doc(db, "users", get().userInfo.user.uid),
      { user: { currency: rate ? rate : "usd" } },
      {
        merge: true,
      }
    );
  },
}));

export default useProfileStore;
