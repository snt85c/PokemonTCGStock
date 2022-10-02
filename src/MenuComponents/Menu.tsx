import MenuHome from "./MenuHome";
import MenuSearch from "./MenuSearch";
import MenuCollection from "./MenuCollection";
import MenuProfile from "./MenuProfile";

export default function Menu() {
  return (
    <div className="fixed flex justify-evenly items-center bottom-0 h-[10%] bg-slate-800 dark:bg-black w-full text-white z-50 pb-2 duration-300">
      <MenuHome />
      <MenuSearch />
      <MenuCollection />
      <MenuProfile />
    </div>
  );
}
