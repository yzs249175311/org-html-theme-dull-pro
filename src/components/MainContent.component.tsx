import React, { useEffect, useRef } from "react";
import { containers } from "@/parse";
import {
  combineRender,
  parseDom,
  VirtualNode,
  renderDefault,
} from "@/utils/dom-operation.util";
import { motion } from "framer-motion";
import { createVariantsFromPostion } from "@/utils/animtes.util";
import OutlineCountainer from "./OutlineContainer/OutlineCountainer.component";

const render = combineRender([], renderDefault);

const mainAnimate = createVariantsFromPostion("x", "100%", {
  delay: 1,
  ease: "easeOut",
});

//解析成虚拟Dom
const vContainers: VirtualNode[] = [];
containers.forEach((item) => {
  vContainers.push(parseDom(item));
  item.remove();
});

const MainContent: React.FC = () => {
  return (
    <motion.div
      initial={mainAnimate.initial}
      animate={mainAnimate.show}
      className="main-content px-12 h-screen overflow-x-hidden overflow-y-auto scroll-smooth"
    >
      {vContainers.map((vDom) => (
        <OutlineCountainer key={vDom.uid} vDom={vDom}></OutlineCountainer>
      ))}
    </motion.div>
  );
};

export default MainContent;
