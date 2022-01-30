import { Button, Span } from "@src/components";
import { Component, Props, TargetType } from "@src/core";
import "./style.scss";

type ButtonHandlerNames = "handleConfirmClick" | "handleCancelClick";
type ButtonNames = "confirm" | "cancel";
interface ModalProps extends Props {
  noticeText: string;
  showButtons?: "CONFIRM" | "CANCEL" | "ALL";
  buttonTexts?: {
    [name in ButtonNames]?: string;
  };
  clickHandler: {
    [name in ButtonHandlerNames]?: () => void;
  };
}

class Modal extends Component<{}, ModalProps> {
  constructor(protected readonly $target: TargetType, protected props: ModalProps) {
    super($target, props);
  }
  protected init(): void {
    if (!this.props.showButtons) this.props.showButtons = "CONFIRM";
  }

  protected setTemplate(): string {
    const { componentId } = this;
    return `
    <div class="app-error-modal" data-component-id=${componentId}>
      <div class="inner">
        <div class="buttons"></div>
      </div>
    </div>`;
  }

  protected setChildren(): void {
    const { noticeText: text, showButtons, buttonTexts } = this.props;
    new Span(".app-error-modal .inner", { text, fontSize: 16, initInsertPosition: "afterbegin" });

    const btnsSelector = `.app-error-modal .inner .buttons`;
    if (showButtons === "ALL" || showButtons === "CANCEL")
      new Button(btnsSelector, { text: buttonTexts?.cancel ?? "취소", name: "cancel", color: "red", size: "small" });
    if (showButtons === "ALL" || showButtons === "CONFIRM")
      new Button(btnsSelector, { text: buttonTexts?.confirm ?? "확인", name: "confirm", color: "blue", size: "small" });
  }

  protected setEvents(): void {
    this.registerButtonsClick();
  }

  // --------------------------------------------------

  // [1] 일반
  private registerButtonsClick(): void {
    this.getEventTarget()?.addEventListener("click", (e) => this.handleButtonsClick(e));
  }

  private handleButtonsClick(e: MouseEvent | Event): void {
    const $target = e.target as HTMLElement;
    const isButtons = $target.closest(".buttons");
    if (!isButtons) return;

    const isButton = $target.nodeName === "BUTTON";
    if (!isButton) return;

    const name = ($target as HTMLButtonElement).name;
    const {
      clickHandler: { handleConfirmClick, handleCancelClick },
    } = this.props;
    if (name === "confirm" && handleConfirmClick) handleConfirmClick();
    else if (name === "cancel" && handleCancelClick) handleCancelClick();
  }
  // ------
}

export default Modal;
