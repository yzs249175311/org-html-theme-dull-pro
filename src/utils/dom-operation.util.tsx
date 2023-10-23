import { createRoot } from "react-dom/client";
import React, { AllHTMLAttributes } from "react";

export type VirtualNode = {
  tag: string;
  uid: number;
  attributes: React.HTMLProps<HTMLElement>;
  nodeType: number;
  nodeValue: string | null;
  children: VirtualNode[];
  parentDom: Node | HTMLElement | null;
};

const generateUid = (function () {
  let count = 0;
  return function () {
    return count++;
  };
})();

function translateTag(attr: string) {
  if (attr === "class") {
    return "className";
  }
  if (attr === "for") {
    return "htmlFor";
  }
  if (attr === "cellspacing") {
    return "cellSpacing";
  }
  if (attr === "cellpadding") {
    return "cellPadding";
  }

  return attr;
}

function shouldFilterWhiteSpace(dom: HTMLElement | Node | null) {
  if (dom && dom.parentElement) {
    let reg = /(table)|(colgroup)|(thead)|(tr)|(tbody)/i;
    return reg.test(dom.parentElement.nodeName);
  }
  return false;
}

//解析dom到虚拟dom,解析完最好手动删除dom防止重复
export function parseDom(
  dom: HTMLElement | Node,
  parentDom: HTMLElement | Node | null = null,
): VirtualNode {
  let { nodeName, nodeType, nodeValue } = dom;
  let children: VirtualNode[] = [];
  let attributes = {};

  if (nodeType === 1) {
    //把原始的dom的属性名转换到React的dom属性名
    let attrList: string[] = (dom as HTMLElement).getAttributeNames();
    //去除style标签
    attrList = attrList.filter((attr) => attr !== "style");
    attributes = attrList.reduce((prev: {}, next: string) => {
      let translatedTag = translateTag(next);
      return Object.assign(prev, {
        [translatedTag]: (dom as HTMLElement).getAttribute(next),
      });
    }, {});
  }

  if (nodeValue && nodeType === 3 && shouldFilterWhiteSpace(dom)) {
    nodeValue = nodeValue?.replace(/\s/g, "");
  }

  if (dom.hasChildNodes()) {
    dom.childNodes.forEach((item: ChildNode) => {
      children.push(parseDom(item, dom));
    });
  }
  /**
   *  tag 为nodeName,当nodeType=3时,tag='#text'
   */
  return {
    tag: nodeName.toLowerCase(),
    attributes,
    uid: generateUid(),
    nodeType,
    nodeValue,
    children,
    parentDom: parentDom,
  };
}

type RenderFunction = (
  vDom: VirtualNode,
  render: ReturnType<CombineRender>,
) => (React.ReactNode & {}) | string | null;

//包装成可以匹配tag的函数,可以用于传入combineRender函数
export function withMatcher<T extends string>(
  tagOrVaildator: T,
  func: RenderFunction,
): RenderFunction & {
  tagOrVaildator: T;
  match: (vDom: VirtualNode) => vDom is VirtualNode & { tag: T };
};

export function withMatcher<T extends (vDom: VirtualNode) => boolean>(
  vaildFunction: T,
  func: RenderFunction,
): RenderFunction & {
  tagOrVaildator: T;
  match: (vDom: VirtualNode) => ReturnType<T>;
};

export function withMatcher<
  T extends ((vDom: VirtualNode) => boolean) | string,
>(
  vaildFunction: T,
  func: RenderFunction,
): RenderFunction & {
  tagOrVaildator: T;
  match: (vDom: VirtualNode) => boolean;
};

export function withMatcher<
  T extends ((VDom: VirtualNode) => boolean) | string,
>(tagOrVaildator: T, func: RenderFunction) {
  Object.defineProperty(func, "tagOrVaildator", { value: tagOrVaildator });
  Object.defineProperty(func, "match", {
    value: function (vDom: VirtualNode) {
      if (tagOrVaildator instanceof Function) {
        return tagOrVaildator(vDom);
      }
      return vDom.tag === tagOrVaildator;
    },
  });
  return func;
}

// 将所有可匹配的函数结合起来
export type CombineRender = (
  renderFunctions: Array<ReturnType<typeof withMatcher>>,
  defaultRenderFunction: ReturnType<typeof withMatcher>,
) => ((vDom: VirtualNode) => ReturnType<RenderFunction>) & {
  defaultRender: ReturnType<typeof withMatcher>;
};

export const combineRender: CombineRender = (
  renderFunctions,
  defaultRenderFunction,
) => {
  function combinedRender(vDom: VirtualNode) {
    let res = null;
    for (let render of renderFunctions) {
      if (render.match(vDom)) {
        res = render(vDom, combinedRender);
        if (res) {
          return res;
        }
      }
    }
    return defaultRenderFunction
      ? defaultRenderFunction(vDom, combinedRender)
      : null;
  }
  combinedRender.defaultRender = defaultRenderFunction;
  return combinedRender;
};

//默认渲染的方式
export const renderDefault = withMatcher("default", function (vDom, render) {
  if (vDom.nodeType === 3) {
    return vDom.nodeValue;
  }

  return React.createElement(
    vDom.tag,
    Object.assign(vDom.attributes, { key: vDom.uid }),
    vDom.children.length !== 0
      ? vDom.children.map((child) => {
          return render(child);
        })
      : null,
  );
});

type TableJson = {
  head: VirtualNode[][] | null | undefined;
  body: VirtualNode[][] | null | undefined;
};

export const parseVNodeToJson = (vDom: VirtualNode): TableJson => {
  const vHead = vDom.children.find((dom) => dom.tag === "thead");
  const vBody = vDom.children.find((dom) => dom.tag === "tbody");
  let head: VirtualNode[][] | undefined | null = null;
  let body: VirtualNode[][] | undefined | null = null;

  if (!!vHead) {
    head = vHead.children
      .filter((dom) => dom.tag === "tr")
      .map((dom) => dom.children.filter((dom) => dom.tag === "th"));
  }

  if (!!vBody) {
    body = vBody.children
      .filter((dom) => dom.tag === "tr")
      .map((dom) => dom.children.filter((dom) => dom.tag === "td"));
  }

  return {
    head,
    body,
  };
};
