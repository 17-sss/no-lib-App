import { Component } from "@src/core";
import "./style.scss";

class MainPage extends Component {
  protected setTemplate(): string {
    const { componentId } = this;
    const strTemp = "기간(2022.01.27 ~ 2022.01.30)동안 개선된 로직들";
    return `<div class="app-main__page" data-component-id=${componentId}>${strTemp}</div>`;
  }
  protected setChildren(): void {}
}
export default MainPage;
