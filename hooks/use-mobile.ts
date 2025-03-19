import { useState, useEffect } from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  // Start with undefined to avoid hydration mismatch
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    // Function to check if window width is less than breakpoint
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Run once on mount
    checkMobile();

    // Set up event listener for window resize
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    // Use the appropriate event listener based on browser support
    if (mql.addEventListener) {
      mql.addEventListener("change", checkMobile);
    } else {
      // Fallback for older browsers
      window.addEventListener("resize", checkMobile);
    }

    // Clean up event listener
    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener("change", checkMobile);
      } else {
        window.removeEventListener("resize", checkMobile);
      }
    };
  }, []);

  return isMobile;
}
