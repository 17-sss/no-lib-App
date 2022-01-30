import { Component, createRouterInfo, RouterLink } from "@src/core";
import { Span } from "@src/components";
import "./style.scss";

class NotFoundPage extends Component {
  protected setTemplate(): string {
    const { componentId } = this;
    return `<div class="not-found__page default-page-size" data-component-id=${componentId}></div>`;
  }
  protected setChildren(): void {
    new Span(".not-found__page", { text: `페이지를 찾을 수 없습니다.`, fontSize: 36, isBold: true });
    new RouterLink(".not-found__page", { text: "메인으로", isButton: true, href: "/", routerInfo: createRouterInfo() });
  }
}
export default NotFoundPage;
