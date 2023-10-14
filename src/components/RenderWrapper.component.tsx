import React, { HTMLAttributes } from "react";
import { CombineRender, VirtualNode } from "@/utils/dom-operation.util";

type propType = {
  render: ReturnType<CombineRender>;
  vDom: VirtualNode;
};

const RenderWrapper: React.FC<propType> = ({ render, vDom }) => {
  return render(vDom);
};

export default RenderWrapper;
