import { Variants, Variant, Transition } from "framer-motion";

export function createVariantsFromPostion(
  postion: "x" | "y",
  value: string | number,
  transition?: Transition,
) {
  let initial = {} satisfies Variant;
  if (postion === "y") {
    initial = {
      x: 0,
      y: value,
    };
  } else if (postion === "x") {
    initial = {
      x: value,
      y: 0,
    };
  }

  return {
    show: {
      x: 0,
      y: 0,
      transition,
    },
    initial,
  } satisfies Variants;
}
