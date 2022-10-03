import { useUserAuth } from "./userAuth";
import Axios from "axios";
import Dropdown from "react-dropdown";
import { useEffect, useState } from "react";
import useProfileStore, { iState } from "./useProfileStore";
import Darkmode from "./Darkmode";
import CollectionDelete from "./CollectionDelete";
import ContactUs from "./ContactUs";

export default function Profile() {
  const { user, googleSignIn, logout } = useUserAuth();

  const [info, setInfo] = useState<any>([]);
  const [to, setTo] = useState<string>("usd");
  const [options, setOptions] = useState<any>([]);

  const setRate = useProfileStore((state: iState) => state.setConversionRate);

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
      className="btn btn-outline btn-sm bg-gray-200 text-gray-600 dark:bg-transparent"
        // className="px-2 rounded border-black border-2 bg-white m-2 dark:text-black"
        onClick={() => {
          logout();
        }}
      >
        Logout
      </button>
    );
  }

  return (
    <section className="flex flex-col gap-2 p-5 mb-[4rem] bg-white text-black dark:bg-slate-900 dark:text-white duration-300">
      <div className=" flex flex-col justify-center items-center m-5 mb-0 relative ">
        {/* {user && <div>uid:{user.uid}</div>} */}
        {user && <img src={user.photoURL} className="w-10 h-10 rounded-full" />}
        {user && <div>{user.displayName}</div>}
        {!user && <Login />}
        {user && <Logout />}
      </div>

      <div className="max-h-1/4 overflow-scroll">
        <label className="label">
          <span className="label-text">Pick the currency</span>
          <span className="label-text-alt">USD/GBP/EUR/AUD</span>
        </label>
        <Dropdown
          className="dark:bg-white bg-gray-400 text-black px-2"
          options={options}
          onChange={(e) => {
            setTo(e.value);
            setRate(info[e.value], e.value);
          }}
          value={to}
          placeholder="set currency"
        />
      </div>
      <CollectionDelete />
      <Darkmode />
      <ContactUs />
    </section>
  );
}
