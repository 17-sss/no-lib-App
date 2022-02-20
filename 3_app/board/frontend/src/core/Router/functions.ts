import { DetailPage, EditPage, MainPage, NotFoundPage } from "@src/pages";
import { TargetType, ComponentItemType } from "../Component";
import { Publisher } from "../PubSub";
import CustomError from "../CustomError";
import { RouterInfo } from ".";

interface PathProps {
  publisherList?: Publisher[];
  calledComponentName?: string;
}

interface RenderPathProps extends PathProps {
  href?: string;
  componentInfo?: ComponentItemType;
}

/** ✨ renderPath: 주어진 href와 componentInfo의 정보를 활용하여 렌더링
 *  - 아무런 값이 없다면 기본 값은 notFound 페이지로 이동하며 렌더링
 *    - href가 없다면 기본값은 '/notFound'
 *    - componentInfo가 없다면 Component의 기본값은 NotFoundPage 컴포넌트
 */
export function renderPath({ componentInfo, href, calledComponentName, publisherList }: RenderPathProps = {}): void {
  try {
    if (!href) href = new URL(window.location.href).origin + "/notFound";
    window.history.pushState({ href }, "", href);

    const $root = document.querySelector("#root");
    const info: ComponentItemType = componentInfo ?? {
      $target: $root,
      Component: NotFoundPage,
    };
    if (!info.$target) info.$target = $root;

    let { $target, Component: PageComponent, props } = info;
    if (typeof $target === "string") $target = document.querySelector($target);
    if (!$target) throw new CustomError({ msgType: "NOT_FOUND_TARGET", name: calledComponentName ?? "unknown" });
    $target.innerHTML = "";

    if (publisherList) publisherList.forEach((pub) => pub.clear());
    new PageComponent($target, props);
  } catch (e) {
    console.error(e);
  }
}

interface RenderRouterPathProps extends PathProps {
  href: string;
  routerInfo: RouterInfo;
}

/** ✨ renderRouterPath: 현재 path를 기반으로 routerInfo에서 페이지 컴포넌트 정보를 불러와서 렌더링 */
export function renderRouterPath({
  routerInfo,
  href,
  calledComponentName,
  publisherList,
}: RenderRouterPathProps): void {
  try {
    if (!routerInfo) throw new CustomError({ msgType: "NOT_FOUND_ROUTER_INFO", name: calledComponentName });
    const { pathname } = new URL(href);
    const info = routerInfo[pathname] ?? routerInfo["/notFound"];

    const { Component: PageComponent, props } = info;
    let $target = info.$target;

    if (typeof $target === "string") $target = document.querySelector($target);
    if (!$target) return;
    $target.innerHTML = "";

    if (publisherList) publisherList.forEach((pub) => pub.clear()); // Publisher 초기화
    new PageComponent($target, props);
  } catch (e) {
    console.error(e);
  }
}

/** ✨ createRouterInfo: 이 애플리케이션에서 쓸 페이지 정보 생성 */
export function createRouterInfo($target: TargetType = document.querySelector("#root")): RouterInfo {
  const routerInfo: RouterInfo = {
    "/": { $target, Component: MainPage },
    "/detail": { $target, Component: DetailPage },
    "/edit": { $target, Component: EditPage },
    "/write": { $target, Component: EditPage },
    "/notFound": { $target, Component: NotFoundPage },
  };
  return routerInfo;
}

interface QueryStringDetail {
  key?: string;
  value?: string;
}

/** ✨ createQueryStrings: 쿼리스트링 분석하여 객체로 반환  */
export const createQueryStrings = (queryString: string): QueryStringDetail[] | null => {
  try {
    const regEx = /(?<key>[\w]+)=(?<value>[\w]+)/g;
    const arrMatchs = Array.from(queryString.matchAll(regEx)) ?? [];
    if (!arrMatchs || !arrMatchs.length) return null;
    return arrMatchs.map((v) => v.groups) as QueryStringDetail[];
  } catch (e) {
    return null;
  }
};
