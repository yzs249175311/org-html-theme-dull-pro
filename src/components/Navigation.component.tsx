import { motion, Variants } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { toc, title } from "@/parse";
import { createVariantsFromPostion } from "@/utils/animtes.util";
import { parseDom } from "@/utils/dom-operation.util";
import TextTableOfContents from "@/components//TextTableOfContents/TextTableOfContents.component";
import { selectHref } from "@/store/navigator/navigator.selector";
import { useSelector } from "react-redux";
import styles from "./Navigation.module.scss";
import gsap from "@/gsapConfig";
import { debounce } from "lodash";

const textTableOfContents = toc.querySelector("#text-table-of-contents")!;

//虚拟节点
const vTextTableOfContents = parseDom(textTableOfContents);
textTableOfContents.remove();

const tocVariants = createVariantsFromPostion("x", "-100%", {
  staggerChildren: 0.2,
  delay: 1,
  ease: "easeOut",
  when: "beforeChildren",
});

const itemVariants = createVariantsFromPostion("y", "-100%");

const scrollToSelected = debounce(() => {
  document?.querySelector(".Mui-selected")?.scrollIntoView({ block: "center" });
}, 1000);

const Navigation: React.FC = () => {
  const [state, _] = useState<keyof typeof tocVariants>("show");
  const [vDom, setVDom] = useState(vTextTableOfContents);
  const href = useSelector(selectHref);
  const selfRef = useRef<HTMLDivElement>(null);

  //目录中的元素滚动到容器中间
  useEffect(() => {
    scrollToSelected();
  }, [href]);

  return (
    <motion.div
      ref={selfRef}
      initial={tocVariants.initial}
      animate={state}
      variants={tocVariants}
      className={`w-full shrink-0 h-screen overflow-x-hidden overflow-y-auto ${styles.scrollBar} scroll-smooth`}
    >
      <motion.h2
        className="truncate overflow-hidden p-4 text-3xl text-center sticky top-0 w-full bg-cus-face-1 z-20"
        initial={itemVariants.initial}
        variants={itemVariants}
      >
        {title.textContent}
      </motion.h2>
      <div>
        <TextTableOfContents vDom={vDom}></TextTableOfContents>
      </div>
    </motion.div>
  );
};

export default Navigation;
