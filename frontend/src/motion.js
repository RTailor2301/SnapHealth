const prefersReduced =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const safeSpring = prefersReduced
  ? { duration: 0.01 }
  : { type: "spring", stiffness: 300, damping: 20, mass: 0.8 };

export const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: prefersReduced ? 0 : 0.05 } },
};

export const itemVariants = {
  hidden: { opacity: 0, y: prefersReduced ? 0 : 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: prefersReduced ? { duration: 0.01 } : { duration: 0.4, ease: "easeOut" },
  },
};

export const pageVariants = {
  hidden: { opacity: 0, y: prefersReduced ? 0 : 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: prefersReduced ? { duration: 0.01 } : { duration: 0.3, ease: "easeOut" },
  },
};
