import { postamble } from "@/parse";
import React, { useRef, useEffect, HTMLAttributes } from "react";
import { MotionProps, motion } from "framer-motion";
import {
  parseDom,
  combineRender,
  renderDefault,
} from "@/utils/dom-operation.util";

let vPostamble = parseDom(postamble);
postamble.remove();

const Postamble: React.FC<MotionProps & HTMLAttributes<HTMLDivElement>> = (
  prop,
) => {
  return <motion.div {...prop}></motion.div>;
};

export default Postamble;
