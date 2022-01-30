import { Component, Router, RouterInfo, TargetType, createRouterInfo } from "@src/core";
import { MainPage } from "@src/pages";

class App extends Component {
  constructor($root: TargetType) {
    super($root);
  }
  protected init(): void {
    if (!this.$target || typeof this.$target === "string") return;
    const routerInfo: RouterInfo = createRouterInfo();
    new Router(this.$target, routerInfo);
  }
}
export default App;
