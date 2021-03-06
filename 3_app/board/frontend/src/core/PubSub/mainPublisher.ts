import { Publisher } from ".";
import { PostData } from "@common/types";
import { getParseLocalItem, pipe, setConvertLocalItem } from "@src/utils/functions";

// [1] mainPublisher μ μ
export interface MainFilterOptions {
  author: string;
  searchWord: string;
  isDesc?: boolean;
  numPost: number;
  pageNum: number;
}

export interface MainPublisherState {
  postData: PostData[]; // π (μ£Όμ) λ¬΄μ‘°κ±΄ μλ²μμ μμ  / μ­μ  / μ‘°νν  λλ§ κ°±μ νκΈ°!!
  editId: number;
  isInit: boolean;
  isRefresh: boolean;

  filterOptions: MainFilterOptions; // π (μ°Έκ³ ) μλλ§ λ³κ²½λμ΄λ λ¨!
  numPostList: number[];
}

type InitMainPublisherState = Readonly<Omit<MainPublisherState, "postData">> & Pick<MainPublisherState, "postData">;
export const initMainState: InitMainPublisherState = {
  postData: [],
  editId: -1,
  isInit: false,
  isRefresh: false,

  filterOptions: {
    author: "",
    searchWord: "",
    isDesc: undefined,
    numPost: 5,
    pageNum: 1,
  },
  numPostList: [5, 10, 20, 30, 50, 100],
};

export const LOCAL_MAIN_KEY = "board_main";

function getLocalMainPublisherState(): MainPublisherState | null {
  const state = getParseLocalItem<MainPublisherState>(LOCAL_MAIN_KEY);
  if (!state) return null;
  const arrPostData = state.postData;
  arrPostData.forEach((data, i) => {
    const { createdDate } = data;
    if (!createdDate) return;
    if (typeof createdDate === "string") state.postData[i].createdDate = new Date(createdDate);
  });
  return state;
}

const setStateCallback = () => setConvertLocalItem(LOCAL_MAIN_KEY, mainPublisher.state);
export const mainPublisher: Publisher<MainPublisherState> = new Publisher(
  getLocalMainPublisherState() ?? { ...initMainState },
  setStateCallback
);

// ---------------------

// [2] κ²μλ¬Ό νν°λ§ ν¨μ λͺ¨μ
// - κ²μκΈ λͺ©λ‘ μμ±, (νμ΄μ§ λ²νΈ, μ λ ¬, μμ±μ, κ²μ λ±)μ΄ λ³κ²½λμμ λ μ¬μ©λ  ν¨μλ€

interface CreatePostDataProps {
  filterOptions: MainFilterOptions;
  postData: PostData[];
  isFullData?: boolean;
}

/** β¨ createPostData: λͺ¨λ  νν° μ‘°κ±΄λ€μ νμ©νμ¬ κ²μκΈ λͺ©λ‘ μμ± */
export function createPostData({ filterOptions, postData, isFullData }: CreatePostDataProps): PostData[] {
  const { author, isDesc, numPost, pageNum, searchWord } = filterOptions;
  const result = pipe<PostData[]>(
    createAuthorFilterItems(author),
    createSearchFilterItems(searchWord),
    createDateSortItems(isDesc),
    createNumPostItems(numPost, pageNum, isFullData)
  )(postData);
  return result;
}

// ===========

type CreatePostsRetrunType = (arrPostData: PostData[]) => PostData[];

/** μ νλ μμ±μ κΈ°μ€μΌλ‘ νν°λ§νμ¬ κ²μκΈ λͺ©λ‘ μμ± -- (1) */
function createAuthorFilterItems(author: string): CreatePostsRetrunType {
  return (arrPostData: PostData[]) => {
    if (!author) return arrPostData;
    const filterData = arrPostData.filter((v) => v.author === author);
    return filterData;
  };
}
/** κ²μμ°½μ μλ ₯λ κ²μμ΄ κΈ°μ€μΌλ‘ νν°λ§νμ¬ κ²μκΈ λͺ©λ‘ μμ± -- (2) */
function createSearchFilterItems(searchWord: string): CreatePostsRetrunType {
  return (arrPostData: PostData[]) => {
    if (!searchWord) return arrPostData;
    const replacedSearchword = searchWord.replace(/\s+/g, "");
    const filterData = arrPostData.filter(({ subject }) => {
      if (subject === null) return;
      return subject.replace(/\s+/g, "").indexOf(replacedSearchword) > -1;
    });
    return filterData;
  };
}
/** μμ±μΌ ν΄λ¦­ μ, λ΄λ¦Όμ°¨ & μ€λ¦μ°¨μμΌλ‘ μ λ ¬ν κ²μκΈ λͺ©λ‘ μμ± -- (3) */
function createDateSortItems(isDesc?: boolean): CreatePostsRetrunType {
  return (arrPostData: PostData[]) => {
    if (typeof isDesc === "undefined") return arrPostData;
    const sortData = [...arrPostData].sort((a, b) => {
      if (a.createdDate === null || b.createdDate === null) return 0;
      // λ΄λ¦Όμ°¨
      if (isDesc) return b.createdDate.valueOf() - a.createdDate.valueOf();
      else return a.createdDate.valueOf() - b.createdDate.valueOf(); // μ€λ¦μ°¨
    });
    return sortData;
  };
}

/** λ³΄μ¬μ§ κ²μκΈ μλ§νΌ κ²μκΈ λͺ©λ‘ μμ± -- (4) */
function createNumPostItems(numPost: number, pageNum: number, isFullData?: boolean): CreatePostsRetrunType {
  return (arrPostData: PostData[]) => {
    if (isFullData) return arrPostData;
    const max = Math.ceil(arrPostData.length / numPost);
    if (pageNum > max) pageNum = max;
    const startIdx = (pageNum - 1) * numPost;
    const endIdx = pageNum * numPost;
    return arrPostData.slice(startIdx, endIdx);
  };
}
