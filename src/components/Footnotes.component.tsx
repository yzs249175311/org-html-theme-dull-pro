import { HTMLAttributes, useEffect, useRef } from "react";
import { footnotes } from "@/parse";
import { MotionProps,motion } from "framer-motion";


const Footnotes: React.FC<MotionProps & HTMLAttributes<HTMLDivElement>> = (
  props,
) => {
  return <motion.div {...props} ></motion.div>;
};

export default Footnotes;
