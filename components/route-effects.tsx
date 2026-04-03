import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useReducedMotion } from "framer-motion";

export function RouteEffects() {
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (location.hash) {
      const target = document.getElementById(location.hash.slice(1));

      if (target) {
        requestAnimationFrame(() => {
          target.scrollIntoView({
            behavior: prefersReducedMotion ? "auto" : "smooth",
            block: "start"
          });
        });
      }

      return;
    }

    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location.hash, location.pathname, prefersReducedMotion]);

  return null;
}
