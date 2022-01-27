import { RenderPathProps } from ".";
import CustomError from "../CustomError";

/** ✨ renderPath: 현재 path를 기반으로 routerInfo에서 페이지 컴포넌트 정보를 불러와서 렌더링 */
export function renderPath({ href, routerInfo, componentName, publisherList }: RenderPathProps): void {
  try {
    if (!routerInfo) throw new CustomError("NOT_FOUND_ROUTER_INFO", componentName);
    const { pathname } = new URL(href);
    const info = routerInfo[pathname];

    if (!info) return; // NOTFOUND로 가게하기.
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
