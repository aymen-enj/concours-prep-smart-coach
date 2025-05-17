import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface BackToTopProps {
  showAfter?: number; // Show button after scrolling this many pixels
  position?: "right" | "left"; // Position of the button
  customClass?: string;
}

const BackToTop = ({
  showAfter = 300,
  position = "right",
  customClass,
}: BackToTopProps) => {
  const [isVisible, setIsVisible] = useState(false);

  // Handle scroll event
  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > showAfter);
    };

    // Initial check
    toggleVisibility();
    
    // Add event listener
    window.addEventListener("scroll", toggleVisibility);
    
    // Clean up
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, [showAfter]);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={cn(
            "fixed bottom-6 z-50",
            position === "right" ? "right-24" : "left-6", // Moved from right-6 to right-24 to avoid conflict with chat button
            customClass
          )}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            onClick={scrollToTop}
            size="icon"
            className="h-12 w-12 rounded-full bg-primary shadow-lg hover:bg-primary/90 transition-all"
            aria-label="Retour en haut"
          >
            <ArrowUp className="h-5 w-5 text-white" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BackToTop;
