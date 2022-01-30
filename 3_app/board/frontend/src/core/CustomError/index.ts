/**
 * [CustomError]
 */

type ErrorMessageName = "NOT_FOUND_TARGET" | "NOT_FOUND_ROUTER_INFO" | "RESPONSE_IS_NULL";
type ErrorMessageType = {
  [name in ErrorMessageName]: string;
};
const errorMessage: ErrorMessageType = {
  NOT_FOUND_TARGET: `지정하려는 타켓을 찾을 수 없습니다.`,
  NOT_FOUND_ROUTER_INFO: `페이지 정보를 담고 있는 RouterInfo를 불러올 수 없습니다.`,
  RESPONSE_IS_NULL: `서버에서 요청에 대한 응답 값을 가져올 수 없습니다.`,
};

interface CustomErrorParams {
  msgType?: ErrorMessageName;
  name?: string;
  customMessage?: string;
}

class CustomError extends Error {
  // public readonly msgType: ErrorMessageName, public readonly name: string = ""
  constructor({ msgType, customMessage = "", name = "" }: CustomErrorParams) {
    super(
      `${name && `[${name}] `}${customMessage || (msgType && `${errorMessage[msgType]}`) || ""}`
    );
  }
}

export default CustomError;
