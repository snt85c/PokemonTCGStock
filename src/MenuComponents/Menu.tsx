import MenuHome from "./MenuHome";
import MenuSearch from "./MenuSearch";
import MenuCollection from "./MenuCollection";
import MenuProfile from "./MenuProfile";
import { useState } from "react";
import { useUserAuth } from "../ProfileComponents/userAuth";

export default function Menu() {
  const [active, setActive] = useState<
    "home" | "search" | "collection" | "profile" | ""
  >("");
  const { user } = useUserAuth();

  return (
    <div
      className="
      flex sm:hidden
      fixed
      justify-evenly
      items-center
      bottom-0
      h-[10%]
      w-full
      text-white
      z-50 
      pb-2 
      duration-300 
      btm-nav"
    >
      <a
      href="#home"
        onClick={() => {
          setActive("home");
        }}
        className={`${active === "home" ? "active" : ""} `}
      >
        <MenuHome {...{ setActive }} />
      </a>
      <a
      href="#search"
        onClick={() => {
          setActive("search");
        }}
        className={`${active === "search" ? "active" : ""} `}
      >
        <MenuSearch {...{ setActive }} />
      </a>
      <a
      href="#collection"
        onClick={() => {
          setActive("collection");
        }}
        className={`${active === "collection" ? "active" : ""} `}
        style={{display:user?"flex":"none"}}
      >
        <MenuCollection {...{ setActive }} />
      </a>
      <a
      href="#profile"
        onClick={() => {
          setActive("profile");
        }}
        className={`${active === "profile" ? "active" : ""} `}
        style={{display:user?"flex":"none"}}

      >
        <MenuProfile {...{ setActive }} />
      </a>
    </div>
  );
}

