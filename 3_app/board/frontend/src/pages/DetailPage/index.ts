import { DetailPageBottomBar, DetailPageContent } from "@src/compositions";
import { Component, createQueryStrings, renderPath } from "@src/core";
import "./style.scss";

interface DetailPageState {
  dataId?: string;
}

class DetailPage extends Component<DetailPageState> {
  protected init(): void {
    const { search } = new URL(window.location.href);
    const dataId = createQueryStrings(search)?.find((v) => v.key === "id")?.value;

    if (!dataId) renderPath();
    else this.setState({ ...this.state, dataId }, { noRender: true });
  }
  protected setTemplate(): string {
    const { componentId } = this;
    return `<div class="detail__page default-page-size" data-component-id=${componentId}></div>`;
  }

  protected setChildren(): void {
    const dataId = this.state?.dataId;
    new DetailPageContent(".detail__page", { dataId });
    new DetailPageBottomBar(".detail__page", { dataId });
  }
}
export default DetailPage;
