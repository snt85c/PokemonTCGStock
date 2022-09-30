import Axios from "axios";
import { User } from "firebase/auth";
import {
  doc,
  DocumentData,
  DocumentSnapshot,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { userInfo } from "os";
import create from "zustand";
import { db } from "./Firebase";

export interface iState {
  // user: User | null;
  userInfo: any;
  conversionRate: number;
  conversionSym: string;
  setUserInfo: (logged: any) => void;
  setConversionRate: (rate: string) => void;
}

const useProfileStore = create<iState>((set, get) => ({
  // user: null,
  userInfo: null,
  conversionRate: 1,
  conversionSym: "",

  setUserInfo: async (user: User) => {
    const result = (await getDoc(doc(db, "users", user.uid))).data();
    if (result && result.user.currencies) {
      result.user.currency =  "usd";
    }
    set(() => ({
      userInfo: result,
      conversionSym: result && result.user.currency,
    }));
    get().setConversionRate(result && result.user.currency);
  },

  setConversionRate: async (rate) => {
    console.log(rate, "rate")
    let newConversionRate = 1;
    Axios.get(
      `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd.json`
    ).then((res) => {
      newConversionRate = res.data[rate];
    });

    set(() => ({ conversionRate: newConversionRate, conversionSym: rate }));
    console.log(get().userInfo)
    await setDoc(doc(db, "users", get().userInfo.user.uid), {user:{currency:get().conversionSym}}, {
      merge: true,
    });
  },
}));

export default useProfileStore;
