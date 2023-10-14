import React from "react";
import RenderWrapper from "@/components/RenderWrapper.component";
import { VirtualNode } from "@/utils/dom-operation.util";
import { render } from "./TextTableOfContents.render";

const TextTableOfContents: React.FC<
  React.PropsWithChildren<{ vDom: VirtualNode }>
> = ({ vDom }) => {
  return <RenderWrapper key={vDom.uid} render={render} vDom={vDom}></RenderWrapper>;
};

export default TextTableOfContents;
