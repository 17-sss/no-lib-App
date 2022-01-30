import { ResponseDataType } from "@common/types";
import { Button } from "@src/components";
import { Component, createRouterInfo, CustomError, Props, renderPath, RouterLink } from "@src/core";
import { editPublisher, mainPublisher } from "@src/core/Store";
import { MainPage } from "@src/pages";
import { Modal } from "@src/compositions";
import { execFetch } from "@src/utils/functions";
import "./style.scss";

interface DetailPageBottomBarState {
  errMessage?: string;
}

interface DetailPageBottomBarProps extends Props {
  dataId?: string;
}

class DetailPageBottomBar extends Component<DetailPageBottomBarState, DetailPageBottomBarProps> {
  protected setTemplate(): string {
    const { componentId } = this;
    return `<div class="detail__page--bottombar" data-component-id=${componentId}></div>`;
  }

  protected setChildren(): void {
    const { props } = this;
    const routerInfo = createRouterInfo();
    const commonLinkProps = { isButton: true, routerInfo, publisherList: [mainPublisher, editPublisher] };
    const editId = props.dataId ? +props.dataId : -1;

    new RouterLink(".detail__page--bottombar", {
      ...commonLinkProps,
      href: `/edit`,
      text: "수정",
      callbackOption: {
        func: () => mainPublisher.setState({ ...mainPublisher.state, editId }),
        runPosition: "afterRenderPath",
      },
    });
    new Button(".detail__page--bottombar", { name: "delete", text: "삭제" });
    new RouterLink(".detail__page--bottombar", { ...commonLinkProps, href: `/`, text: "목록" });

    if (this.state && this.state.errMessage) {
      const { errMessage: noticeText } = this.state;
      new Modal(".detail__page--bottombar", {
        noticeText,
        buttonTexts: {
          confirm: "목록으로",
        },
        clickHandler: {
          handleConfirmClick: () => {
            this.setState({ ...this.state, errMessage: undefined }, { isSetEvents: false });
            renderPath({ href: "/", componentInfo: { Component: MainPage } });
          },
        },
      });
    }
  }

  protected setEvents(): void {
    this.registerDetailBottomBarClick();
  }

  // --------------------------------------------------

  // [1] 일반
  // ------

  // [2] Events
  private registerDetailBottomBarClick(): void {
    this.getEventTarget()?.addEventListener("click", (e) => this.handleDetailBottomBarClick(e));
  }

  private handleDetailBottomBarClick(e: MouseEvent | Event): void {
    const $target = e.target as HTMLElement;
    const isButton = $target.classList.contains("app-button") && $target instanceof HTMLButtonElement;
    if (!isButton) return;
    if ($target.name === "delete") {
      const isDelete = confirm("정말 삭제하시겠습니까?");
      if (!isDelete) return;
      this.requestDeleteData();
    }
  }
  // 서버로 전송 (게시글 삭제)
  private async requestDeleteData(): Promise<void> {
    try {
      const { dataId: id } = this.props;
      const options = {
        method: "DELETE",
        body: JSON.stringify({ id }),
        headers: { "Content-Type": "application/json" },
      };
      const res: ResponseDataType | null = await execFetch({ type: "delete", options });
      if (!res) throw new CustomError({ msgType: "RESPONSE_IS_NULL", name: "DetailPage, DELETE" });

      const { message, statusCode } = res;
      const isResOK = statusCode >= 200 && statusCode < 400;
      if (!isResOK) throw new CustomError({ customMessage: message, name: "DetailPage, DELETE" });

      editPublisher.setState({ ...editPublisher.state, isEdited: true });

      renderPath({ href: "/", componentInfo: { Component: MainPage } });
    } catch (e) {
      const { message: errMessage } = e as unknown as Error;
      console.error(e);
      this.setState({ ...this.state, errMessage }, { isSetEvents: false });
    }
  }

  // ------

  // [3] 전역 상태 변경 시 사용
  // ------
}
export default DetailPageBottomBar;
