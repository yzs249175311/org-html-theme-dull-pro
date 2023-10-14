import {
  combineRender,
  renderDefault,
  withMatcher,
} from "@/utils/dom-operation.util";
import { motion, MotionProps } from "framer-motion";
import React from "react";
import { setHref, setHrefDebounce } from "@/store/navigator/navigator.reducer";
import { useAppDispatch } from "@/store/store";

//h2
const renderHeading = withMatcher(
  (dom) => /(h1)|(h2)|(h3)|(h4)|(h5)|(h6)/.test(dom.tag),

  function (dom, render) {
    let dispatch = useAppDispatch();
    const attribute: MotionProps & React.HTMLAttributes<HTMLHeadElement> = {
      className: "",
      onViewportEnter(entry) {
        setHrefDebounce(
          dom.attributes?.id ? "#" + dom.attributes?.id : "",
          dispatch,
        );
      },
      onViewportLeave(entry) {},
      viewport: {
        margin: "-1% 0px -99% 0px",
      },
    };

    return React.createElement(
      motion[dom.tag as "h1" | "h2" | "h3" | "h4" | "h5" | "h6"],
      Object.assign(
        { ...(dom.attributes as any), ...attribute },
        { key: dom.uid },
      ),
      dom.children.map((child) => {
        return render(child);
      }),
    );
  },
);

export const render = combineRender([renderHeading], renderDefault);
