import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function RouteEffects() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const target = document.getElementById(location.hash.slice(1));

      if (target) {
        requestAnimationFrame(() => {
          target.scrollIntoView({
            behavior: "auto",
            block: "start"
          });
        });
      }

      return;
    }

    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location.hash, location.pathname]);

  return null;
}
