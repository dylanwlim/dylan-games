"use client";

import { motion, useMotionValue, useSpring, type SpringOptions } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

const SPRING_CONFIG = { stiffness: 26.7, damping: 4.1, mass: 0.2 };

export type MagneticProps = {
  children: ReactNode;
  intensity?: number;
  range?: number;
  actionArea?: "self" | "parent" | "global";
  springOptions?: SpringOptions;
};

export function Magnetic({
  children,
  intensity = 0.6,
  range = 100,
  actionArea = "self",
  springOptions = SPRING_CONFIG,
}: MagneticProps) {
  const [isHovered, setIsHovered] = useState(actionArea === "global");
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, springOptions);
  const springY = useSpring(y, springOptions);

  useEffect(() => {
    const calculateDistance = (event: MouseEvent) => {
      if (!ref.current) {
        return;
      }

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distanceX = event.clientX - centerX;
      const distanceY = event.clientY - centerY;
      const absoluteDistance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

      if (isHovered && absoluteDistance <= range) {
        const scale = 1 - absoluteDistance / range;
        x.set(distanceX * intensity * scale);
        y.set(distanceY * intensity * scale);
        return;
      }

      x.set(0);
      y.set(0);
    };

    document.addEventListener("mousemove", calculateDistance);
    return () => document.removeEventListener("mousemove", calculateDistance);
  }, [isHovered, intensity, range, x, y]);

  useEffect(() => {
    if (actionArea === "parent" && ref.current?.parentElement) {
      const parent = ref.current.parentElement;
      const handleParentEnter = () => setIsHovered(true);
      const handleParentLeave = () => setIsHovered(false);

      parent.addEventListener("mouseenter", handleParentEnter);
      parent.addEventListener("mouseleave", handleParentLeave);

      return () => {
        parent.removeEventListener("mouseenter", handleParentEnter);
        parent.removeEventListener("mouseleave", handleParentLeave);
      };
    }

    return undefined;
  }, [actionArea]);

  const handleMouseEnter = () => {
    if (actionArea === "self") {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (actionArea === "self") {
      setIsHovered(false);
      x.set(0);
      y.set(0);
    }
  };

  return (
    <motion.div
      ref={ref}
      onMouseEnter={actionArea === "self" ? handleMouseEnter : undefined}
      onMouseLeave={actionArea === "self" ? handleMouseLeave : undefined}
      style={{ x: springX, y: springY }}
    >
      {children}
    </motion.div>
  );
}
