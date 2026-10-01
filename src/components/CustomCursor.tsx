"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [cursorText, setCursorText] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      // 0ms Zero-Latency Direct GPU Positioning (No React re-render lag or spring delay)
      if (cursor) {
        cursor.style.transform = `translate3d(${e.clientX - 2}px, ${e.clientY - 2}px, 0)`;
      }
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

    const handleMouseLeave = () => {
      if (cursor) cursor.style.opacity = "0";
    };

    const handleMouseEnter = () => {
      if (cursor) cursor.style.opacity = "1";
      setIsVisible(true);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
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

  return (
    <div className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden hidden md:block">
      {/* 0ms Zero-Latency Hardware Accelerated Play Button Cursor */}
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 flex items-center gap-2 select-none pointer-events-none will-change-transform ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{
          transform: "translate3d(-100px, -100px, 0)",
          transition: "opacity 0.2s ease",
        }}
      >
        {/* Play Icon (Pure SVG Triangle with Instant Response) */}
        <div
          className="transition-transform duration-150 ease-out"
          style={{
            transform: isClicked ? "scale(0.82)" : isHovered ? "scale(1.25)" : "scale(1)",
          }}
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
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
        </div>

        {/* Context Text Label in Monochrome */}
        {cursorText && (
          <span className="px-2 py-0.5 text-[9px] font-mono font-bold tracking-widest text-black uppercase bg-white border border-white rounded shadow-[0_0_15px_rgba(255,255,255,0.6)] animate-in fade-in duration-150">
            {cursorText}
          </span>
        )}
      </div>
    </div>
  );
}
