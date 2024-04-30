import {
  motion,
  useMotionValue,
  useTransform,
  useMotionTemplate,
  useAnimationFrame,
} from "framer-motion";
import { useRef } from "react";

export function MovingBorder({
  children,
  duration = 2000, // Duration of the animation cycle
  borderRadius = "1.75rem", // Border radius of the container
}: {
  children: any;
  duration?: number;
  borderRadius?: string;
}) {
  // Ref for the SVG path to calculate movement
  const pathRef = useRef(null);
  const progress = useMotionValue(0);

  useAnimationFrame((time) => {
    const length = pathRef.current?.getTotalLength();
    if (length) {
      const pxPerMillisecond = length / duration;
      progress.set((time * pxPerMillisecond) % length);
    }
  });

  // Transform values for the moving element
  const x = useTransform(
    progress,
    (value) => pathRef.current?.getPointAtLength(value).x
  );
  const y = useTransform(
    progress,
    (value) => pathRef.current?.getPointAtLength(value).y
  );
  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <div
      className="h-80"
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "1px", // Padding for the moving border effect
        borderRadius: borderRadius,
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute h-full w-full"
        style={{ height: "100%", width: "100%" }}
      >
        <rect
          fill="none"
          width="100%"
          height="100%"
          rx="30%"
          ry="30%"
          ref={pathRef}
        />
      </svg>
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "inline-block",
          transform,
          background: "radial-gradient(var(--sky-500) 40%, transparent 60%)",
          opacity: 0.8,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: `calc(${borderRadius} * 0.96)`,
          background: "rgba(38, 38, 38, 0.8)", // Using Tailwind's slate-900 with opacity
          border: "1px solid #2d3748", // Using Tailwind's slate-800 for border
          color: "white",
          backdropFilter: "blur(10px)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
