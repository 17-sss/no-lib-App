import { Board, Pagination } from "@src/components";
import { Component, CustomError } from "@src/core";
import { mainPublisher, MainFilterOptions, initMainState, createPostData, editPublisher } from "@src/core/PubSub";
import { Modal } from "@src/compositions";
import { getAllPostData } from "@src/utils/functions";

import "./style.scss";

interface MainPageBoardState {
  isUpdate?: boolean;
  errMessage?: string;
}

class MainPageBoard extends Component<MainPageBoardState> {
  protected init(): void {
    this.initGetAllPostData();
    this.setState({ ...this.state, isUpdate: false }, { noRender: true });
  }

  protected initSubscriber(): void {
    // main
    this.registerSubscriberFunction(mainPublisher, () => {
      const { currKeys } = mainPublisher.recentChangedKeys;
      if (currKeys.includes("isInit")) return this.execInitMainPageBoard();
      if (currKeys.includes("filterOptions") || currKeys.includes("postData") || currKeys.includes("isRefresh"))
        this.execUpdateMainPageBoard(currKeys.includes("isRefresh"));
    });
  }

  protected setBeforeRender(): void {
    if (!this.state) return;
    if (this.state.isUpdate) this.setState({ ...this.state, isUpdate: false }, { noRender: true });
  }

  protected setTemplate(): string {
    const { componentId } = this;
    return `<div class="main__page--board" data-component-id=${componentId}></div>`;
  }

  protected setChildren(): void {
    const { filterOptions, postData } = mainPublisher.state;
    const { pageNum, numPost } = filterOptions;

    // ๐ ์ฌ๊ธฐ์๋ง filterOptions์ ๋ฐ๋ฅธ ๋ฐ์ดํฐ ์ ์ฉ(Board ์ปดํฌ๋ํธ์๋ง ์ ์ฉ)
    const arrPostData = createPostData({ filterOptions, postData });
    new Board(".main__page--board", { arrPostData });

    // ๐ ์ฌ๊ธฐ์๋ ํํฐ๋ง๋์ด ์๋ผ๋ธ ๋ฐ์ดํฐ๊ฐ ์๋ ํํฐ๋ง ๋ ์ ์ฒด ๋ฐ์ดํฐ ๊ฐฏ์๋ฅผ ๊ธฐ์ค์ผ๋ก ํด์ผํจ!
    const pageOnlyPostData = createPostData({ filterOptions, postData, isFullData: true });
    const max = Math.ceil(pageOnlyPostData.length / numPost);
    new Pagination(".main__page--board", { pageNum, max });

    if (this.state && this.state.errMessage) {
      const { errMessage: noticeText } = this.state;
      new Modal(".main__page--board", {
        noticeText,
        showButtons: "CANCEL",
        buttonTexts: { cancel: "๋ซ๊ธฐ" },
        clickHandler: {
          handleCancelClick: () => {
            this.setState({ ...this.state, errMessage: undefined }, { isSetEvents: false });
          },
        },
      });
    }
  }

  protected setEvents(): void {
    this.registerMainBoardClick();
  }

  // --------------------------------------------------

  // [1] ์ผ๋ฐ
  /** ๐พ initGetAllPostData: ์๋ฒ์์ ๋ชจ๋  ๊ฒ์๋ฌผ ๋ฐ์ดํฐ๋ฅผ ๊ฐ์ ธ์์ mainPublisher ์๋ฐ์ดํธ
   * - ์ด๊ธฐ ๋ ๋๋ง์๋ ๋ฌด์กฐ๊ฑด ์คํํ์ง๋ง, ์์ฑ & ์์ ๋๋ mainPublisher์ ๋ฑ๋ก๋ ํจ์๋ค์ ์คํ๋๋ฉด ์๋จ.
   */
  private async initGetAllPostData() {
    try {
      const customMessage = `์๋ฒ์ ๋ฐ์ดํฐ๊ฐ ์๊ฑฐ๋ ์ค๋ฅ๊ฐ ์์ต๋๋ค. ๊ฒ์๊ธ ์์ฑ์ ์๋ํด์ฃผ์ธ์.`;
      const res = await getAllPostData(customMessage);

      if (!res || !res.data || (!res.data && res.message)) {
        throw new CustomError({ name: `MainPage, GET ALL POST`, customMessage });
      }
      initMainState.postData = res.data;

      const { isEdited } = editPublisher.state;
      mainPublisher.setState(
        { ...mainPublisher.state, postData: [...res.data] },
        { notExec: isEdited ? true : undefined }
      );
      if (isEdited) editPublisher.setState({ ...editPublisher.state, isEdited: false }, { notExec: true });
    } catch (e) {
      const { message: errMessage } = e as unknown as Error;
      console.error(e);
      this.setState({ ...this.state, errMessage }, { isSetEvents: false });
    }
  }

  // ------

  // [2] Events
  private registerMainBoardClick(): void {
    this.getEventTarget()?.addEventListener("click", (e) => this.handleMainBoardClick(e));
  }
  private handleMainBoardClick(e: MouseEvent | Event): void {
    const $target = e.target as HTMLElement;
    const isRouterLink = $target.nodeName === "A" && $target.classList.contains("app-link");
    if (isRouterLink) return;

    const $board = $target.closest(".app-board");
    const $pagination = $target.closest(".app-pagination");
    if (!$board && !$pagination) return;
    if ($board) {
      const $tr = $target.closest("tr");
      if (!$tr) return;

      const isCreatedDate = $target.nodeName === "TH" && $target.classList.contains("createdDate");
      const isAuthor = $target.nodeName === "TD" && $target.classList.contains("author") && $target.textContent;
      if (isCreatedDate) return this.execCreatedDateClick();
      if (isAuthor && $target.textContent) return this.execAuthorClick($target.textContent);
    } else {
      const isItem = $target.nodeName === "LI";
      if (isItem) return this.execPaginationItemClick($target as HTMLLIElement);
    }
  }

  /** ๊ฒ์ํ Item ํด๋ฆญ - ์์ฑ์ผ ์ ๋ ฌ */
  private execCreatedDateClick(): void {
    const { filterOptions: prevFilterOptions } = mainPublisher.state;
    const isDesc = !prevFilterOptions.isDesc; // ํญ์ ์ด์  ๊ฐ๊ณผ ๋ฐ๋๋ก

    const filterOptions = { ...prevFilterOptions, isDesc };

    mainPublisher.setState({ ...mainPublisher.state, filterOptions });
    this.setState({ ...this.state, isUpdate: true }, { isSetEvents: false });
  }

  private execAuthorClick(author: string): void {
    const { filterOptions: prevFilterOptions } = mainPublisher.state;
    const filterOptions = { ...prevFilterOptions, author };

    mainPublisher.setState({ ...mainPublisher.state, filterOptions });
    this.setState({ ...this.state, isUpdate: true }, { isSetEvents: false });
  }

  /** ํ์ด์ง๋ค์ด์ Item ํด๋ฆญ */
  private execPaginationItemClick($li: HTMLLIElement): void {
    const isPrevNext = $li.classList.contains("prev") || $li.classList.contains("next");
    const { filterOptions: prevFilterOptions, postData } = mainPublisher.state;
    let pageNum: number = -1;

    if (isPrevNext) {
      if (!this.state || $li.classList.contains("disabled")) return;
      const { pageNum: prevNum, numPost } = prevFilterOptions;
      const max = Math.ceil(postData.length / numPost);

      const isPrev = $li.classList.contains("prev");
      pageNum = isPrev ? prevNum - 5 : prevNum + 5;
      if (pageNum > max) pageNum = max;
      else if (pageNum <= 0) pageNum = 1;
    } else {
      const tmpPageNum = +`${$li.textContent}`;
      if (Number.isNaN(tmpPageNum)) return;
      pageNum = tmpPageNum;
    }
    const filterOptions: MainFilterOptions = { ...prevFilterOptions, pageNum };

    mainPublisher.setState({ ...mainPublisher.state, filterOptions }, { notExec: true });
    this.setState({ ...this.state, isUpdate: true }, { isSetEvents: false });
  }

  // ------

  // [3] ์ ์ญ ์ํ ๋ณ๊ฒฝ ์ ์ฌ์ฉ
  /** ๊ฒ์๋ฌผ ์ด๊ธฐํ (MainPageTopBar์ '์ด๊ธฐํ'๋ฒํผ์ด ํด๋ฆญ๋์์ ๋ ์๋) */
  private execInitMainPageBoard(): void {
    mainPublisher.setState({ ...mainPublisher.state, ...initMainState, isInit: false }, { notExec: true });
    this.setState({ ...this.state, isUpdate: true }, { isSetEvents: false });
  }

  /** ๊ฒ์๋ฌผ ์๋ฐ์ดํธ (์๋ก๊ณ ์นจ ๋ฒํผ ํด๋ฆญ ์ ์๋) */
  private execUpdateMainPageBoard(isRefresh?: boolean): void {
    if (isRefresh) mainPublisher.setState({ ...mainPublisher.state, isRefresh: false }, { notExec: true });
    return this.setState({ ...this.state, isUpdate: true }, { isSetEvents: false });
  }
}
export default MainPageBoard;
