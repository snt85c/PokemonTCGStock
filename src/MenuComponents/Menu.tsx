import { useNavigate } from "react-router";
import MenuHome from "./MenuHome";
import MenuSearch from "./MenuSearch";
import MenuCollection from "./MenuCollection";
import MenuProfile from "./MenuProfile";

export default function Menu() {
  const navigate = useNavigate();
  return (
    <div className="fixed flex justify-evenly items-center bottom-0 h-1/6 bg-slate-800 w-full text-white">
      <MenuHome />
      <MenuSearch />
      <MenuCollection />
      <MenuProfile />
    </div>
  );
}
