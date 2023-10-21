import styles from "./TextTableOfContents.module.scss";
import { useState, useMemo, useRef, Fragment } from "react";
import { useAppDispatch } from "@/store/store";
import { useSelector } from "react-redux";
import { selectHref } from "@/store/navigator/navigator.selector";
import { motion } from "framer-motion";
import {
  VirtualNode,
  withMatcher,
  combineRender,
  renderDefault,
} from "@/utils/dom-operation.util";
import {
  List,
  ListItemButton,
  ListItemText,
  ListItem,
  Collapse,
  ListItemIcon,
  Chip,
  Badge,
} from "@mui/material";
import { todoColorConstants } from "@/utils/constants.util";
import { setHref, setHrefDebounce } from "@/store/navigator/navigator.reducer";
import ExpandLessRounded from "@mui/icons-material/ExpandLessRounded";

//li
export const renderLi = withMatcher("li", function (vDom, render) {
  let [open, setOpen] = useState(true);
  let currentHref = useSelector(selectHref);
  let dispatch = useAppDispatch();
  let selfRef = useRef<HTMLElement>(null);

  //是否有子列表
  let hasExpand = useMemo(
    () => vDom.children.findIndex((item) => item.tag === "ul"),
    [vDom],
  );

  //子列表的数量
  let childElementCount = useMemo(() => {
    return vDom.children
      .find((item) => item.tag === "ul")
      ?.children?.filter((item) => item.tag === "li").length;
  }, [vDom]);

  //链接
  let href = useMemo(
    () => vDom.children.find((item) => item.tag === "a")?.attributes.href!,
    [vDom],
  );

  //是否被选中
  let selected = useMemo(() => {
    return href === currentHref;
  }, [href, currentHref]);

  //点击事件
  let clickLinkHandler: React.MouseEventHandler<HTMLLinkElement> = function (
    e,
  ) {
    setHrefDebounce(href, dispatch, true);
  };

  //渲染子列表
  let renderExpand = () => {
    return hasExpand === -1 ? (
      ""
    ) : open ? (
      <motion.span className="absolute right-0 flex justify-center items-center">
        <ExpandLessRounded
          onClick={() => {
            setOpen(!open);
          }}
        />
      </motion.span>
    ) : (
      <motion.span className="absolute right-0  flex justify-center items-center">
        <Chip
          label={childElementCount}
          color="primary"
          variant="outlined"
          onClick={() => {
            setOpen(!open);
          }}
        ></Chip>
      </motion.span>
    );
  };

  return (
    <Fragment key={vDom.uid}>
      <ListItemButton
        className={`${styles["nav-list"]} bg-red-500`}
        ref={selfRef}
        selected={selected}
        {...(vDom.attributes as any)}
        href={href}
        onClick={clickLinkHandler}
      >
        {vDom.children
          .filter((item) => item.tag !== "ul")
          .map((item) => {
            return render(item);
          })}
        {selected ? (
          <motion.div
            className="w-full absolute h-[3px] bottom-0 left-0 pointer-events-none"
            style={{
              backgroundColor: "var(--brand-color)",
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
          ></motion.div>
        ) : (
          ""
        )}
        {renderExpand()}
      </ListItemButton>
      {vDom.children
        .filter((item) => item.tag === "ul")
        .map((item) => {
          return (
            <Collapse key={item.uid} className="ml-4" in={open} component="div">
              {render(item)}
            </Collapse>
          );
        })}
    </Fragment>
  );
});

//ul
export const renderUl = withMatcher("ul", function (vDom, render) {
  return (
    <List
      dense
      key={vDom.uid}
      {...(vDom.attributes as any)}
      style={{ padding: 0 }}
    >
      {vDom.children.map((child) => render(child))}
    </List>
  );
});

//a
function isTodo(dom: VirtualNode) {
  let res = dom.attributes.className?.split(" ");
  return (
    res && res[0] && res[1] && res[0].toLowerCase() === res[1].toLowerCase()
  );
}

export const renderA = withMatcher("a", function (vDom, render) {
  let todoValue = useMemo(() => {
    let todoDom = vDom.children.find(isTodo);

    if (todoDom) {
      return (
        todoDom.children[0]?.nodeType === 3 && todoDom.children[0].nodeValue
      );
    }
    return null;
  }, [vDom]);

  return (
    <Badge
      key={vDom.uid}
      className="w-full"
      badgeContent={
        todoValue ? (
          <Chip
            label={todoValue}
            color={Reflect.get(todoColorConstants, todoValue) || "primary"}
            variant="outlined"
            size="small"
            sx={{ fontSize: "12px" }}
          ></Chip>
        ) : (
          ""
        )
      }
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
    >
      <span
        {...(vDom.attributes as any)}
        className="w-full truncate text-current flex"
      >
        {vDom.children
          .filter((child) => !isTodo(child))
          .map((child) => render(child))}
      </span>
    </Badge>
  );
});

const renderTag = withMatcher(
  (dom) =>
    dom.tag === "span" &&
    !!dom.attributes?.className?.split(" ").includes("tag"),
  function (dom, _) {
    return (
      <span
        key={dom.uid}
        {...(dom.attributes as any)}
        style={{ marginLeft: "auto" }}
      >
        {dom.children
          .filter((dom) => dom.nodeType === 1)
          .map((dom) => {
            return (
              <Chip
                label={
                  dom.children.filter((dom) => dom.nodeType === 3)[0]?.nodeValue
                }
                color="info"
                variant="outlined"
                size="small"
              ></Chip>
            );
          })}
      </span>
    );
  },
);

export const render = combineRender(
  [renderLi, renderUl, renderA, renderTag],
  renderDefault,
);
