import { useRef, useEffect } from "react";

export default function HandleClickOutsideComponentRef(
    setShowOther: React.MutableRefObject<boolean>
  ) {
    const ref = useRef<HTMLDivElement>(null);
  
    const handleClickOutside = (event: Event) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setShowOther.current = false;
      }
    };
  
    useEffect(() => {
      document.addEventListener("click", handleClickOutside, true);
      return () => {
        document.removeEventListener("click", handleClickOutside, true);
      };
    });
  
    return { ref };
  }