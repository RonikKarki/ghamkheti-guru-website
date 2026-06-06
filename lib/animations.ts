import type { Variants, Transition } from "framer-motion";

/* Typed bezier tuple — prevents TypeScript widening to number[] */
export const EASE_OUT_BEZIER: [number, number, number, number] = [0.16, 1, 0.3, 1];
const E = EASE_OUT_BEZIER;

/* ----------------------------------------------------------------
   TRANSITION CONFIGS
   ---------------------------------------------------------------- */
export const easeOut: Transition = {
  duration: 0.6,
  ease: E,
};

export const easeOutFast: Transition = {
  duration: 0.4,
  ease: E,
};

export const spring: Transition = {
  type: "spring",
  stiffness: 280,
  damping: 28,
};

export const springBouncy: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 20,
};

export const slowEase: Transition = {
  duration: 1,
  ease: E,
};

/* ----------------------------------------------------------------
   VIEWPORT ANIMATION VARIANTS
   ---------------------------------------------------------------- */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: easeOut },
};

export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: { opacity: 1, y: 0, transition: easeOut },
};

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: easeOut },
};

export const fadeRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: easeOut },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: easeOut },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: { opacity: 1, scale: 1, transition: easeOut },
};

export const scaleInSpring: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: spring },
};

export const slideInLeft: Variants = {
  hidden: { x: "-100%" },
  visible: { x: 0, transition: easeOut },
};

export const slideInRight: Variants = {
  hidden: { x: "100%" },
  visible: { x: 0, transition: easeOut },
};

export const blurIn: Variants = {
  hidden: { opacity: 0, filter: "blur(12px)", scale: 0.97 },
  visible: { opacity: 1, filter: "blur(0px)", scale: 1, transition: easeOut },
};

/* ----------------------------------------------------------------
   STAGGER CONTAINERS
   ---------------------------------------------------------------- */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerFast: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
};

export const staggerContainerSlow: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.15,
    },
  },
};

/* Stagger item — use inside staggerContainer */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: easeOut },
};

export const staggerItemLeft: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: easeOut },
};

export const staggerItemScale: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: easeOut },
};

/* ----------------------------------------------------------------
   HOVER VARIANTS  (use with whileHover)
   ---------------------------------------------------------------- */
export const hoverLift = {
  y: -6,
  transition: { duration: 0.22, ease: E },
};

export const hoverScale = {
  scale: 1.04,
  transition: { duration: 0.2 },
};

export const hoverGlow = {
  boxShadow: "0 0 50px rgba(34,197,94,0.25)",
  transition: { duration: 0.3 },
};

export const hoverLiftGlow = {
  y: -6,
  boxShadow: "0 12px 50px rgba(34,197,94,0.22)",
  transition: { duration: 0.25, ease: E },
};

/* ----------------------------------------------------------------
   TAP VARIANTS  (use with whileTap)
   ---------------------------------------------------------------- */
export const tapScale = { scale: 0.97 };
export const tapScaleSmall = { scale: 0.99 };

/* ----------------------------------------------------------------
   HERO TEXT ANIMATION  (character / word stagger)
   ---------------------------------------------------------------- */
export const heroContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

export const heroWord: Variants = {
  hidden: { opacity: 0, y: 60, rotateX: -30 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.8, ease: E },
  },
};

/* ----------------------------------------------------------------
   PAGE TRANSITION
   ---------------------------------------------------------------- */
export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: E } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.25 } },
};

/* ----------------------------------------------------------------
   VIEWPORT DEFAULTS  (use in whileInView)
   ---------------------------------------------------------------- */
export const viewportOnce = { once: true, margin: "-80px" } as const;
export const viewportEager = { once: true, margin: "-30px" } as const;
