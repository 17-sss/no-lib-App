import { Component } from "@src/core";
import "./style.scss";

class MainPage extends Component {
  protected setTemplate(): string {
    const { componentId } = this;
    const strTemp = "기간(2022.01.17 ~ 2022.01.24)동안 수행한 과제의 베이스가 되는 로직 모음";
    return `<div class="app-main__page" data-component-id=${componentId}>${strTemp}</div>`;
  }
  protected setChildren(): void {}
}
export default MainPage;
