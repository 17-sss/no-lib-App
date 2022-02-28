import { Component, Router, PathChangeOption, TargetType, RouterInfo } from "@src/core";
import { editPublisher, initEditState, initMainState, mainPublisher } from "./core/PubSub";
import { DetailPage, EditPage, MainPage, NotFoundPage } from "./pages";

class App extends Component {
  constructor($root: TargetType) {
    super($root);
  }
  protected init(): void {
    this.setAppRouter();
  }

  private setAppRouter(): void {
    const { $target } = this;
    if (!$target || typeof $target === "string") return;

    const publisherList = [mainPublisher, editPublisher];
    const routerInfo: RouterInfo = {
      "/": { $target, Component: MainPage },
      "/detail": { $target, Component: DetailPage },
      "/edit": { $target, Component: EditPage },
      "/write": { $target, Component: EditPage },
      "/notFound": { $target, Component: NotFoundPage },
    };

    const pathChangeOption: PathChangeOption = {
      func: () => {
        mainPublisher.setState({ ...mainPublisher.state, editId: initMainState.editId }, { notExec: true });
        editPublisher.setState({ ...initEditState }, { notExec: true });
      },
      pathList: ["/edit"],
      isIncludePath: false,
    };
    new Router($target, { publisherList, routerInfo, pathChangeOption });
  }
}
export default App;
