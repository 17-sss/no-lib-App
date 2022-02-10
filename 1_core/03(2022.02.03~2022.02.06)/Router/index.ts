/**
 * [Router]
 * - App 컴포넌트에서 페이지 설정, 이전 & 다음페이지 기능
 * - 참고사항
 *    - a 태그를 통한 페이지 이동(pushState)은 src/core/RouterLink 컴포넌트 참고
 */
import CustomError from "../CustomError";
import { ComponentItemType } from "../Component";
import { renderRouterPath } from "./functions";
import { Publisher } from "../Store";

export * from "./functions";

export type RouterInfo = {
  [key: string]: ComponentItemType;
};

export interface PathChangeOption {
  func: () => Promise<void> | void;
  pathList: string[];
  isIncludePath: boolean;
}

export interface RouterProps {
  readonly routerInfo: RouterInfo;
  readonly publisherList: Publisher[];
  readonly pathChangeOption?: PathChangeOption;
}
// ========

class Router {
  constructor(readonly $target: Element | null, readonly props: RouterProps) {
    try {
      if ($target === null) throw new CustomError({ msgType: "NOT_FOUND_TARGET", name: this.constructor.name });
      this.init();
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * 👾 init
   * - setPopStateEvent: 이전 페이지 & 다음 페이지 이벤트 설정
   */
  private init(): void {
    this.setPopStateEvent();
    this.setCleanUp();
    const href = window.location.href;
    const { publisherList, routerInfo } = this.props;
    const calledComponentName = this.constructor.name;
    renderRouterPath({ href, calledComponentName, routerInfo, publisherList });
  }

  /** 보고있는 페이지의 이동이 이뤄질 경우, pathChangeOption.func() 실행 */
  private setCleanUp(): void {
    const { pathChangeOption } = this.props;
    if (!pathChangeOption || !this.$target) return;
    const { func, pathList, isIncludePath } = pathChangeOption;

    const observer = new MutationObserver(async (_) => {
      const pathname = new URL(document.location.href).pathname;
      const flag = isIncludePath ? pathList.includes(pathname) : !pathList.includes(pathname);
      if (flag) await func();
    });
    const config = { childList: true, subtree: true };
    observer.observe(this.$target, config);
  }
  private setPopStateEvent(): void {
    window.addEventListener("popstate", () => this.popStateEventHandler());
  }
  private popStateEventHandler(e?: PopStateEvent): void {
    const href = window.location.href;
    const { publisherList, routerInfo } = this.props;
    const calledComponentName = this.constructor.name;
    renderRouterPath({ href, calledComponentName, routerInfo, publisherList });
  }
}

export default Router;
