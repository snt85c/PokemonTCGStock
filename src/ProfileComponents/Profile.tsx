import { useUserAuth } from "./userAuth";
import Axios from "axios";
import Dropdown from "react-dropdown";
import { useEffect, useState } from "react";
import useProfileStore, { iState } from "./useProfileStore";

export default function Profile() {
  const { user, googleSignIn, logout } = useUserAuth();

  const [info, setInfo] = useState<any>([]);
  const [to, setTo] = useState<string>("usd");
  const [options, setOptions] = useState<any>([]);

  const setRate = useProfileStore((state: iState) => state.setConversionRate);
  const setSymbol = useProfileStore(
    (state: iState) => state.setConversionSymbol
  );

  const currencies = ["usd", "gbp", "aud", "eur"];

  useEffect(() => {
    Axios.get(
      `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd.json`
    ).then((res) => {
      setInfo(res.data["usd"]);
    });
  }, []);

  useEffect(() => {
    setOptions(
      Object.keys(info).filter((option) => currencies.includes(option))
    );
  }, [info]);

  function Login() {
    return (
      <button
        className="px-2 rounded border-black border-2 bg-white m-2"
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
        className="px-2 rounded border-black border-2 bg-white m-2"
        onClick={() => {
          logout();
        }}
      >
        Logout
      </button>
    );
  }

  return (
    <section className="h-screen p-5 bg-slate-500">
      <div className=" flex flex-col justify-center items-center m-5 relative">
        {/* {user && <div>uid:{user.uid}</div>} */}
        {user && <img src={user.photoURL} className="w-10 h-10 rounded-full" />}
        {user && <div>{user.displayName}</div>}
        {!user && <Login />}
        {user && <Logout />}
      </div>

      <div className="max-h-1/4 overflow-scroll">
        <h3>set conversion</h3>
        <Dropdown
          className="bg-white"
          options={options}
          onChange={(e) => {
            console.log(info[e.value]);
            setTo(e.value);
            setSymbol(e.value);
            setRate(info[e.value]);
          }}
          value={to}
          placeholder="set currency"
        />
      </div>
    </section>
  );
}
