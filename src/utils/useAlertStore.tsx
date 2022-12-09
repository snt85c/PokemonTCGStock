import create from "zustand";

export interface iAlert {
  alert: string;
  type:string;
  setAlertType: (type:string) => void;
  setAlert: (text: string, type:string) => void;
  clearAlert: () => void;
}

const useAlertStore = create<iAlert>((set, get) => ({
    
  alert: "",
  type:"info",


  setAlertType:async(type:string)=>{
    set(() => ({
      type
    }));
  },

  setAlert: async (text: string, type:string) => {
    get().setAlertType(type)
    set(() => ({
      alert: text,
    }));
    setTimeout(() => {
      get().clearAlert();
    }, 1500);
  },

  clearAlert: async () => {
    set(() => ({
      alert: "",
    }));
  },
}));

export default useAlertStore;
