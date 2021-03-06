import { Component, CustomError, Props, renderPath } from "@src/core";
import { postDataKorKeys } from "@src/utils/types";
import { MainPage } from "@src/pages";
import { Modal } from "@src/compositions";
import { PostData, ResponseDataType } from "@common/types";
import { execFetch } from "@src/utils/functions";
import "./style.scss";

interface DetailPageContentState {
  currData?: PostData | null;
  errMessage?: string;
}
interface DetailPageContentProps extends Props {
  dataId?: string;
}

interface PostDataHTMLType {
  textInfoStrings: string;
  contents: string;
}

class DetailPageContent extends Component<DetailPageContentState, DetailPageContentProps> {
  protected init(): void {
    const { dataId } = this.props;
    this.setState({ ...this.state, currData: null });
    if (dataId) this.setPostData(+dataId);
  }
  protected setTemplate(): string {
    const { componentId } = this;
    const { textInfoStrings, contents } = this.createPostDataStrings(this.state?.currData);

    return `
    <div class="detail__page--content" data-component-id=${componentId}>
      <ul class="textinfo">${textInfoStrings}</ul>
      <div class="contents">${contents}</div>
    </div>`;
  }

  protected setChildren(): void {
    if (this.state && this.state.errMessage) {
      const { errMessage: noticeText } = this.state;
      new Modal(".detail__page--content", {
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

  protected setEvents(): void {}

  // --------------------------------------------------

  // [1] 일반
  private createPostDataStrings(postData?: PostData | null): PostDataHTMLType {
    const textInfoItems: string[] = [];
    if (!postData) return { textInfoStrings: "", contents: "내용 없음" };

    const keys = Object.keys(postData) as (keyof PostData)[];
    for (let i = 0; i < keys.length; i++) {
      if (keys[i] === "contents") continue;
      const name = postDataKorKeys[keys[i]];
      let value = postData[keys[i]];
      if (keys[i] === "createdDate") value = (value as Date).toLocaleString();
      textInfoItems.push(`<li><span class="name">${name}</span><span>${value ?? ""}</span></li>`);
    }

    return { textInfoStrings: textInfoItems.join(""), contents: postData["contents"] ?? "내용 없음" };
  }

  // 초기 렌더링 시 데이터 불러온 후, state.currData에 적용
  private async setPostData(id: number): Promise<void> {
    try {
      const options = { method: "GET", id };
      const res: ResponseDataType<PostData> | null = await execFetch({ type: "getPost", options });
      if (!res || !res.data) throw new CustomError({ name: "DetailPage, GET CONTENT", msgType: "RESPONSE_IS_NULL" });

      const { message, statusCode, data: currData } = res;
      const isResOK = statusCode >= 200 && statusCode < 400;
      if (!isResOK) throw new CustomError({ name: "DetailPage, GET CONTENT", customMessage: message });

      if (currData.createdDate) currData.createdDate = new Date(currData.createdDate);

      this.setState({ ...this.state, currData });
    } catch (e) {
      const { message: errMessage } = e as unknown as Error;
      console.error(e);
      this.setState({ ...this.state, errMessage }, { isSetEvents: false });
    }
  }
  // ------

  // [2] Events
  // ------

  // [3] 전역 상태 변경 시 사용
  // ------
}
export default DetailPageContent;
