import { Component, Router, PathChangeOption, createRouterInfo, TargetType } from "@src/core";
import { editPublisher, initEditState, initMainState, mainPublisher } from "./core/Store";

class App extends Component {
  constructor($root: TargetType) {
    super($root);
  }
  protected init(): void {
    this.setAppRouter();
  }

  private setAppRouter(): void {
    if (!this.$target || typeof this.$target === "string") return;
    const publisherList = [mainPublisher, editPublisher];
    const routerInfo = createRouterInfo();
    const pathChangeOption: PathChangeOption = {
      func: () => {
        mainPublisher.setState({ ...mainPublisher.state, editId: initMainState.editId }, { notExec: true });
        editPublisher.setState({ ...initEditState }, { notExec: true });
      },
      pathList: ["/edit"],
      isIncludePath: false,
    };
    new Router(this.$target, { publisherList, routerInfo, pathChangeOption });
  }
}
export default App;
