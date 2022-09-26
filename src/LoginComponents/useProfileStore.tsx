import { User } from "firebase/auth";
import create from "zustand";


export interface iState {
  user: User | null;
  conversionRate:number;
  conversionSym:string;
  setUser: (logged: any) => void;
  setConversionRate:(rate:number) => void;
  setConversionSymbol:(sym:string) => void;
}

const useProfileStore = create<iState>((set) => ({
  user: null,
  conversionRate:1,
  conversionSym:"usd",
  setUser: (logged) => set(() => ({ user: logged })),
  setConversionRate:(rate) => set(()=>({conversionRate: rate})),
  setConversionSymbol:(sym) => set(()=>({conversionSym: sym})),
  
}));

export default useProfileStore
