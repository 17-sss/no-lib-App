import { ResponseDataType } from "@common/types";
import { Button } from "@src/components";
import { Component, createRouterInfo, CustomError, Props, renderPath, RouterLink } from "@src/core";
import { editPublisher, mainPublisher } from "@src/core/Store";
import { MainPage } from "@src/pages";
import { Modal } from "@src/compositions";
import { execFetch } from "@src/utils/functions";
import "./style.scss";
import { ModalProps } from "../Modal";

interface DetailPageBottomBarState {
  errMessage?: string;
  deleteStatus?: boolean;
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
    this.setDetailBottomModal();
  }

  protected setEvents(): void {
    this.registerDetailBottomBarClick();
  }

  // --------------------------------------------------

  // [1] 일반
  private setDetailBottomModal(): void {
    if (!this.state || (!this.state.errMessage && !this.state.deleteStatus)) return;
    const modalProps = this.createDeleteModalProps();

    // 오류가 있을 경우
    const { errMessage } = this.state;
    if (errMessage) {
      modalProps.noticeText = errMessage;
      modalProps.clickHandler.handleConfirmClick = () => {
        this.setState({ ...this.state, errMessage: undefined }, { isSetEvents: false });
        renderPath({ href: "/", componentInfo: { Component: MainPage } });
      };
    }

    new Modal(".detail__page--bottombar", {
      ...modalProps,
      showButtons: errMessage ? "CONFIRM" : "ALL",
      buttonTexts: errMessage ? { confirm: "목록으로" } : undefined,
    });
  }

  // Modal에 props로 전달되는 요소들 - 삭제 전용
  private createDeleteModalProps(): ModalProps {
    const noticeText = "정말 삭제하시겠습니까?";
    const setInitDeleteStatus = () => this.setState({ ...this.state, deleteStatus: undefined }, { isSetEvents: false });
    const handleConfirmClick: () => void = () => {
      setInitDeleteStatus();
      this.requestDeleteData();
    };
    const handleCancelClick: () => void = setInitDeleteStatus;
    return {
      noticeText,
      clickHandler: { handleCancelClick, handleConfirmClick },
    };
  }

  // ------

  // [2] Events
  private registerDetailBottomBarClick(): void {
    this.getEventTarget()?.addEventListener("click", (e) => this.handleDetailBottomBarClick(e));
  }

  private handleDetailBottomBarClick(e: MouseEvent | Event): void {
    const $target = e.target as HTMLElement;
    const isButton = $target.classList.contains("app-button") && $target instanceof HTMLButtonElement;
    if (!isButton) return;
    if ($target.name === "delete") this.setState({ ...this.state, deleteStatus: true }, { isSetEvents: false });
  }

  // 서버로 전송 (게시글 삭제) -- Modal 컴포넌트에서 처리
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
