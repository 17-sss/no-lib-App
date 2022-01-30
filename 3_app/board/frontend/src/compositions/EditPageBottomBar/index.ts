import { PostData, ResponseDataType } from "@common/types";
import { Button } from "@src/components";
import { Component, createRouterInfo, CustomError, RouterLink, RouterLinkProps } from "@src/core";
import { editPublisher, mainPublisher, initEditState } from "@src/core/Store";
import { execFetch } from "@src/utils/functions";
import { requiredPostDataKeys } from "@src/utils/types";

import "./style.scss";

class EditPageBottomBar extends Component {
  protected setTemplate(): string {
    const { componentId } = this;
    return `<div class="edit__page--bottombar" data-component-id=${componentId}></div>`;
  }

  protected setChildren(): void {
    const routerInfo = createRouterInfo();
    const commonLinkProps = { isButton: true, routerInfo, publisherList: [mainPublisher, editPublisher] };
    new Button(".edit__page--bottombar", { name: "goback", text: "뒤로" });
    const routerLinkProps: RouterLinkProps<number> = {
      ...commonLinkProps,
      href: `/detail`,
      name: "submitlink",
      text: "전송",
      callbackOption: {
        func: async (): Promise<number> => await this.regsiterEditData(),
        runPosition: "beforePushState",
        options: { isID: true },
      },
    };
    new RouterLink(".edit__page--bottombar", routerLinkProps);
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

      if (!res || !res.data)
        throw new CustomError({ name: `EditPage, ${type.toUpperCase()}`, msgType: "RESPONSE_IS_NULL" });

      const { message, statusCode, data: id } = res;
      const isResOK = statusCode >= 200 && statusCode < 400;
      if (!isResOK) throw new Error(message);

      editPublisher.setState({ ...editPublisher.state, editData: initEditState.editData, isEdited: true });
      return id <= 0 ? id : -1;
    } catch (e) {
      const { message } = e as unknown as Error;
      console.error(e);
      alert(message);
      return -1;
    }
  }
  // ------

  // [3] 전역 상태 변경 시 사용
  // ------
}
export default EditPageBottomBar;
