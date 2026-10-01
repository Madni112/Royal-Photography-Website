"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [cursorText, setCursorText] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest("a, button, [data-cursor-interactive], input, select, textarea");
      const cursorCustom = target.closest("[data-cursor-text]");

      if (cursorCustom) {
        setIsHovered(true);
        setCursorText(cursorCustom.getAttribute("data-cursor-text") || "");
      } else if (interactive) {
        setIsHovered(true);
        setCursorText("");
      } else {
        setIsHovered(false);
        setCursorText("");
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden hidden md:block">
      {/* Play Button Cursor in Monochrome White/Silver (Without any background box) */}
      <motion.div
        className="fixed top-0 left-0 flex items-center gap-2 select-none"
        animate={{
          x: mousePos.x - 2,
          y: mousePos.y - 2,
          scale: isClicked ? 0.82 : isHovered ? 1.25 : 1,
        }}
        transition={{
          type: "spring",
          damping: 24,
          stiffness: 450,
          mass: 0.25,
        }}
      >
        {/* Play Icon (Pure SVG Triangle with White Ethereal Glow, No Background) */}
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-200"
          style={{
            filter: isHovered
              ? "drop-shadow(0 0 10px #FFFFFF) drop-shadow(0 0 20px rgba(255, 255, 255, 0.9))"
              : "drop-shadow(0 0 8px rgba(255, 255, 255, 0.6))",
          }}
        >
          {/* Main Play Triangle Fill */}
          <path
            d="M5 3.5V20.5L19.5 12L5 3.5Z"
            fill={isHovered ? "#FFFFFF" : "#EEEEEE"}
            stroke="#111111"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>

        {/* Optional Context Label in Monochrome */}
        {cursorText && (
          <motion.span
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            className="px-2 py-0.5 text-[9px] font-mono font-bold tracking-widest text-black uppercase bg-white border border-white rounded shadow-[0_0_15px_rgba(255,255,255,0.6)]"
          >
            {cursorText}
          </motion.span>
        )}
      </motion.div>
    </div>
  );
}
