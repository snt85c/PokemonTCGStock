import { User } from "firebase/auth";
import create from "zustand";


export interface iState {
  user: User | null;
  setUser: (logged: any) => void;
}

const useStore = create<iState>((set) => ({
  user: null,
  setUser: (logged) => set(() => ({ user: logged })),
}));

export default useStore
