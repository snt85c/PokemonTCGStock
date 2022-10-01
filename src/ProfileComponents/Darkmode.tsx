import { useState } from "react";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import useProfileStore, { iState } from "./useProfileStore";
export default function Darkmode() {
  // const [isDarkMode, setDarkMode] = useState(false);

  const isDarkMode = useProfileStore((state: iState) => state.darkmode);
  const setDarkMode = useProfileStore((state: iState) => state.setDarkMode);

  const toggleDarkMode = (checked: boolean) => {
    setDarkMode();
  };
  return (
    <div className="flex items-center justify-between gap-5">
      {isDarkMode ? "day mode?" : "night mode?"}
      <DarkModeSwitch
        className="m-1"
        checked={isDarkMode}
        onChange={toggleDarkMode}
        size={25}
      />
    </div>
  );
}
