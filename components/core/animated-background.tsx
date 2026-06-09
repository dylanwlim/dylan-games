"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion, type Transition } from "motion/react";
import {
  Children,
  cloneElement,
  isValidElement,
  useId,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";

type AnimatedBackgroundChildProps = HTMLAttributes<HTMLElement> & {
  "data-id": string;
  "data-checked"?: string;
};

export type AnimatedBackgroundProps = {
  children: ReactNode;
  defaultValue?: string;
  onValueChange?: (newActiveId: string | null) => void;
  className?: string;
  transition?: Transition;
  enableHover?: boolean;
};

export function AnimatedBackground({
  children,
  defaultValue,
  onValueChange,
  className,
  transition,
  enableHover = false,
}: AnimatedBackgroundProps) {
  const [internalActiveId, setInternalActiveId] = useState<string | null>(defaultValue ?? null);
  const uniqueId = useId();
  const activeId = defaultValue ?? internalActiveId;

  const handleSetActiveId = (id: string | null) => {
    setInternalActiveId(id);
    onValueChange?.(id);
  };

  return Children.map(children, (child, index) => {
    if (!isValidElement<AnimatedBackgroundChildProps>(child)) {
      return child;
    }

    const id = child.props["data-id"];
    const interactionProps = enableHover
      ? {
          onMouseEnter: () => handleSetActiveId(id),
          onMouseLeave: () => handleSetActiveId(null),
        }
      : {
          onClick: () => handleSetActiveId(id),
        };

    return cloneElement(
      child,
      {
        key: index,
        className: cn("relative inline-flex", child.props.className),
        "data-checked": activeId === id ? "true" : "false",
        ...interactionProps,
      },
      <>
        <AnimatePresence initial={false}>
          {activeId === id ? (
            <motion.span
              layoutId={`background-${uniqueId}`}
              className={cn("absolute inset-0", className)}
              transition={transition}
              initial={{ opacity: defaultValue ? 1 : 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          ) : null}
        </AnimatePresence>
        <span className="relative z-10 contents">{child.props.children}</span>
      </>,
    );
  });
}
