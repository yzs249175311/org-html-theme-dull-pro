import React, { HTMLAttributes } from "react";
import {
  VirtualNode,
} from "@/utils/dom-operation.util";
import RenderWrapper from "@/components/RenderWrapper.component";
import { render } from "@/components/OutlineContainer/OutlineCountainer.render";

type PropType = {
  vDom: VirtualNode;
  rest?: HTMLAttributes<any>;
};

const OutlineCountainer: React.FC<PropType> = ({ vDom, ...rest }) => {
  return <RenderWrapper vDom={vDom} render={render} {...rest}></RenderWrapper>;
};
export default OutlineCountainer;
