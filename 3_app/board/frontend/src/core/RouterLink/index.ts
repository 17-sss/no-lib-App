import Component, { Props, TargetType, ComponentItemType } from "../Component";
import { renderPath } from "../Router";
import { Publisher } from "../PubSub";
import "./style.scss";

type DefaultLinkProps = Pick<HTMLAnchorElement, "href" | "text"> & Partial<Pick<HTMLAnchorElement, "name">>;
export interface RouterLinkProps<T = unknown> extends Props, DefaultLinkProps {
  componentInfo: ComponentItemType;
  isButton?: boolean;
  publisherList?: Publisher[];
  callbackOption?: {
    func: () => Promise<T> | T;
    runPosition: "beforeRenderPath" | "afterRenderPath";
    options?: { isID: boolean };
  };
}

/**
 * [RouterLink]
 * - a 태그를 통한 페이지 이동 컴포넌트 (Component 상속 & Router 일부 사용)
 */
class RouterLink extends Component<{}, RouterLinkProps> {
  constructor(protected readonly $target: TargetType, protected props: RouterLinkProps) {
    super($target, props);
  }
  protected setTemplate(): string {
    if (!this.props) return "";
    const { componentId, props } = this;
    const { text, isButton } = props;

    const excludeStrs = ["routerInfo", "publisherList", "isButton", "callbackOption", "text"];
    const strAttrs = this.createStringAttribute(...excludeStrs);
    const strClassName = `${isButton ? " btn" : ""}`;

    return `<a class="app-link ${strClassName}" ${strAttrs} data-component-id=${componentId}>${text ?? ""}</a>`;
  }
  protected setEvents(): void {
    this.registerAnchorClick();
  }

  // =====

  private registerAnchorClick(): void {
    this.getEventTarget()?.addEventListener("click", (e) => this.anchorClickHandler(e));
  }

  private async anchorClickHandler(e?: MouseEvent | Event): Promise<void> {
    e?.preventDefault();
    const $target = e?.target as HTMLElement;
    const $currentTarget = e?.currentTarget as HTMLAnchorElement;
    if (!$currentTarget || $target !== $currentTarget) return;
    let href = $currentTarget.href;
    if (!href) return;

    const { callbackOption: cb } = this.props;
    if (cb?.func && cb.runPosition === "beforeRenderPath") {
      const execFunc = await cb.func();

      const isBooleanFunc = typeof execFunc === "boolean";
      if (isBooleanFunc && !execFunc) return;

      if (cb.options?.isID) {
        const isNumberFunc = typeof execFunc === "number";
        if (isNumberFunc && execFunc === -1) return;
        href += `?id=${execFunc}`;
      }
    }

    const { componentInfo, publisherList } = this.props;
    const calledComponentName = `${this.constructor.name}(${this.componentId})`;
    renderPath({ componentInfo, href, calledComponentName, publisherList });
    if (cb?.func && cb.runPosition === "afterRenderPath") cb.func();
  }
}

export default RouterLink;
