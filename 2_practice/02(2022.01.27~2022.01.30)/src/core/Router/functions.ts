import { TargetType, ComponentItemType } from "../Component";
import { Publisher } from "../Store";
import CustomError from "../CustomError";
import { RouterInfo } from ".";
import { MainPage, NotFoundPage } from "@src/pages";

interface PathProps {
  publisherList?: Publisher[];
}

type RenderComponentItemType = Partial<Pick<ComponentItemType, "$target">> & Omit<ComponentItemType, "$target">;
interface RenderPathProps extends PathProps {
  href?: string;
  componentInfo?: RenderComponentItemType;
}

/** ✨ renderPath: 주어진 href와 componentInfo의 정보를 활용하여 렌더링
 *  - 아무런 값이 없다면 기본 값은 notFound 페이지로 이동하며 렌더링
 *    - href가 없다면 기본값은 '/notFound'
 *    - componentInfo가 없다면 Component의 기본값은 NotFoundPage 컴포넌트
 */
export function renderPath({ href, publisherList, componentInfo }: RenderPathProps = {}): void {
  if (!href) href = new URL(window.location.href).origin + "/notFound";
  window.history.pushState({ href }, "", href);

  const $root = document.querySelector("#root");
  const info: RenderComponentItemType = componentInfo ?? {
    $target: $root,
    Component: NotFoundPage, // 사용 시, NotFoundPage 컴포넌트 설정하기
  };
  if (!info.$target) info.$target = $root;

  let { $target, Component: PageComponent, props } = info;
  if (typeof $target === "string") $target = document.querySelector($target);
  if (!$target) return;
  $target.innerHTML = "";

  if (publisherList) publisherList.forEach((pub) => pub.clear());
  new PageComponent($target, props);
}

interface RenderRouterPathProps extends PathProps {
  href: string;
  routerInfo: RouterInfo;
  calledComponentName?: string;
}

/** ✨ renderRouterPath: 현재 path를 기반으로 routerInfo에서 페이지 컴포넌트 정보를 불러와서 렌더링 */
export function renderRouterPath({
  href,
  routerInfo,
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
