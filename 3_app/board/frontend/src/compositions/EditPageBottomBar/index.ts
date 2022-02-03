import { PostData, ResponseDataType } from "@common/types";
import { Button } from "@src/components";
import { Component, CustomError, renderPath, RouterLink, RouterLinkProps } from "@src/core";
import { editPublisher, mainPublisher, initEditState } from "@src/core/Store";
import { DetailPage, MainPage } from "@src/pages";
import { Modal } from "@src/compositions";
import { execFetch } from "@src/utils/functions";
import { requiredPostDataKeys } from "@src/utils/types";
import "./style.scss";

interface EditPageBottomBarState {
  errMessage?: string;
}

class EditPageBottomBar extends Component<EditPageBottomBarState> {
  protected setTemplate(): string {
    const { componentId } = this;
    return `<div class="edit__page--bottombar" data-component-id=${componentId}></div>`;
  }

  protected setChildren(): void {
    const commonLinkProps = { isButton: true, componentInfo: { Component: DetailPage }, publisherList: [mainPublisher, editPublisher] };
    new Button(".edit__page--bottombar", { name: "goback", text: "뒤로" });
    const routerLinkProps: RouterLinkProps<number> = {
      ...commonLinkProps,
      href: `/detail`,
      name: "submitlink",
      text: "전송",
      callbackOption: {
        func: async (): Promise<number> => await this.regsiterEditData(),
        runPosition: "beforeRenderPath",
        options: { isID: true },
      },
    };
    new RouterLink(".edit__page--bottombar", routerLinkProps);

    if (this.state && this.state.errMessage) {
      const { errMessage: noticeText } = this.state;
      new Modal(".edit__page--bottombar", {
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
    this.registerEditBottomBarClick();
  }

  // --------------------------------------------------

  // [1] 일반
  // ------

  // [2] Events
  private registerEditBottomBarClick(): void {
    this.getEventTarget()?.addEventListener("click", (e) => this.handleEditBottomBarClick(e));
  }

  private handleEditBottomBarClick(e: MouseEvent | Event): void {
    const $target = e.target as HTMLElement;
    const isButton = $target.classList.contains("app-button") && $target instanceof HTMLButtonElement;
    if (!isButton) return;
    if ($target.name === "goback") window.history.back();
  }

  // [2-1] Events (callback)
  /** RouterLink(submitlink)의 콜백, 현재 데이터를 전송 (작성 / 수정)  */
  private async regsiterEditData(): Promise<number> {
    const { editData } = editPublisher.state;
    const notEmptyCnt = Object.keys(editData).reduce((result, key) => {
      if (editData[key as keyof PostData]) result++;
      return result;
    }, 0);
    const isOK = notEmptyCnt >= requiredPostDataKeys.length;
    if (!isOK) return -1;
    const isEdit = notEmptyCnt > requiredPostDataKeys.length;
    const currId = await this.requestCreateData(editData, isEdit);
    return currId;
  }

  // 서버로 전송 (작성 or 수정)
  private async requestCreateData(editData: PostData, isEdit?: boolean): Promise<number> {
    try {
      const type = isEdit ? "edit" : "write";
      const method = isEdit ? "PUT" : "POST";
      const options = { method, body: JSON.stringify(editData), headers: { "Content-Type": "application/json" } };
      const res: ResponseDataType<number> | null = await execFetch({ type, options });

      if (!res || !res.data) {
        const strType = type === "edit" ? "수정" : "작성";
        const customMessage = `서버에 오류가 있습니다. 글을 ${strType}할 수 없습니다.`;
        throw new CustomError({ name: `EditPage, ${type.toUpperCase()}`, customMessage });
      }

      const { message, statusCode, data: id } = res;
      const isResOK = statusCode >= 200 && statusCode < 400;
      if (!isResOK) throw new CustomError({ name: `EditPage, ${type.toUpperCase()}`, customMessage: message });

      editPublisher.setState({ ...editPublisher.state, editData: initEditState.editData, isEdited: true });
      return id > 0 ? id : -1;
    } catch (e) {
      const { message: errMessage } = e as unknown as Error;
      console.error(e);
      this.setState({ ...this.state, errMessage }, { isSetEvents: false });

      return -1;
    }
  }
  // ------

  // [3] 전역 상태 변경 시 사용
  // ------
}
export default EditPageBottomBar;
