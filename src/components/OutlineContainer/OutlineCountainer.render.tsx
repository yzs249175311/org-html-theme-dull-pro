import {
  combineRender,
  renderDefault,
  withMatcher,
} from "@/utils/dom-operation.util";
import { motion, MotionProps } from "framer-motion";
import React, { useEffect, useRef } from "react";
import { setHref, setHrefDebounce } from "@/store/navigator/navigator.reducer";
import { useAppDispatch } from "@/store/store";
import hljs from "highlight.js";

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

//code src
const renderSrc = withMatcher(
  (dom) =>
    dom.tag === "pre" && !!(dom.attributes?.className?.split(" ")[0] === "src"),
  function (dom, render) {
    //语言类型
    let lang = dom.attributes?.className?.split(" ")[1]?.split("-")[1];
    let selfRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      hljs.highlightElement(selfRef.current!);
    }, []);

    return (
      <>
        <div
          data-language={`${lang}`}
          className={`relative code language-${lang} whitespace-pre p-4 overflow-x-auto rounded-lg my-4 after:content-[attr(data-language)] after:absolute after:right-4 after:top-4 after:text-xs`}
          ref={selfRef}
          key={dom.uid}
        >
          <pre {...(dom.attributes as any)}>
            <code>{dom.children.map((child) => render(child))}</code>
          </pre>
        </div>
      </>
    );
  },
);

export const render = combineRender([renderHeading, renderSrc], renderDefault);
