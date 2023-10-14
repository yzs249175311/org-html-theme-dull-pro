export const content = document.querySelector("#content") as HTMLDivElement;
content.style.display = "none";

//目录
export const toc = document.querySelector(
  "#table-of-contents",
) as HTMLDivElement;

export const containers = document.querySelectorAll(
  "div[id^=outline-container][class=outline-2]",
) as NodeListOf<HTMLDivElement>;

export const postamble = document.querySelector("#postamble") as HTMLDivElement;

export const title = document.querySelector("h1.title") as HTMLHeadingElement;

export const footnotes = document.querySelector("#footnotes") as HTMLDivElement;
