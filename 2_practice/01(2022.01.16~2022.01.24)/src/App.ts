import { Component, Router, RouterInfo, TargetType } from "@src/core";
import { MainPage } from "@src/pages";

class App extends Component {
  constructor($root: TargetType) {
    super($root);
  }
  protected init(): void {
    const { $target } = this;
    if (!this.$target || typeof this.$target === "string") return;
    const routerInfo: RouterInfo = {
      "/": { $target, Component: MainPage },
    };
    new Router(this.$target, routerInfo);
  }
}
export default App;
