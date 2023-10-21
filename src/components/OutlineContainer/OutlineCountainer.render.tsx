import {
  combineRender,
  renderDefault,
  withMatcher,
} from "@/utils/dom-operation.util";
import { motion, MotionProps } from "framer-motion";
import React, { Fragment, useEffect, useRef } from "react";
import { setHref, setHrefDebounce } from "@/store/navigator/navigator.reducer";
import { useAppDispatch } from "@/store/store";
import { Tooltip, Zoom } from "@mui/material";
import hljs from "highlight.js";

const classObj = {
  code: "whitespace-pre p-4 overflow-x-auto rounded-lg my-4 relative",
};

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
    dom.tag === "pre" &&
    !!dom.attributes?.className?.split(" ").includes("src"),
  function (dom, render) {
    //获取语言类型
    let lang = dom.attributes?.className?.split(" ")[1]?.split("-")[1];
    let langType = hljs.getLanguage(lang!)?.name || "plaintext";
    let selfRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      hljs.highlightElement(selfRef.current!);
    }, []);

    return (
      <div className="relative" key={dom.uid}>
        <div className="langType absolute right-0 top-0 bg-cus-face-4 rounded-bl-md uppercase z-10 px-2">
          {lang}
        </div>
        <div className={`language-${langType} ${classObj.code}`} ref={selfRef}>
          <pre {...(dom.attributes as any)}>
            <code>{dom.children.map((child) => render(child))}</code>
          </pre>
        </div>
      </div>
    );
  },
);

//example block
const renderExample = withMatcher(
  (dom) =>
    dom.tag === "pre" &&
    !!dom.attributes?.className?.split(" ").includes("example"),
  function (dom, render) {
    let selfRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      hljs.highlightElement(selfRef.current!);
    }, []);
    return (
      <div className="relative" key={dom.uid}>
        <div className="langType absolute right-0 top-0 bg-cus-face-3 rounded-bl-md uppercase z-10 px-2">
          example
        </div>
        <div ref={selfRef} className={`language-plaintext ${classObj.code} `}>
          <pre {...(dom.attributes as any)} style={{ overflowX: "scroll" }}>
            {dom.children.map((child) => render(child))}
          </pre>
        </div>
      </div>
    );
  },
);

const renderA = withMatcher("a", function (dom, render) {
  let href = dom.attributes.href;
  return (
    <Tooltip
      title={href}
      key={dom.uid}
      placement="top"
      arrow
      disableInteractive
      TransitionComponent={Zoom}
    >
      <a {...(dom.attributes as any)}>
        {dom.children.map((child) => render(child))}
      </a>
    </Tooltip>
  );
});

export const render = combineRender(
  [renderHeading, renderSrc, renderExample, renderA],
  renderDefault,
);
