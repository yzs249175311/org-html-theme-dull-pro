import { tagNameSet } from "../parse";
export const todoColorConstants = {
  TODO: "error",
  DONE: "success",
} as const;

//mui可以使用的color
export const muiColorList = [
  "primary",
  "error",
  "info",
  "secondary",
  "success",
  "warning",
];

//标签所对应的颜色
export const tagColorMap = new Map();
Array.from(tagNameSet).forEach((tag, index) => {
  const i = index % (muiColorList.length - 1);
  tagColorMap.set(tag, muiColorList[i]);
});
