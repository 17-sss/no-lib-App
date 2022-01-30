import { Component, Props, TargetType } from "@src/core";
import "./style.scss";

interface SpanProps extends Props {
  text: string;
  fontSize?: number;
  isBold?: boolean;
}

class Span extends Component<{}, SpanProps> {
  constructor(protected readonly $target: TargetType, protected props: SpanProps) {
    super($target, props);
  }
  protected setTemplate(): string {
    const { componentId, props } = this;
    const { text, isBold } = props;

    let fontSize = props.fontSize;
    if (fontSize) {
      if (fontSize < 10) fontSize = 10;
      else if (fontSize > 50) fontSize = 50;
    }

    const strFontSize = fontSize ? `fontSize--${fontSize}` : "";
    const strBold = isBold ? "bold" : "";
    const strClassName = `${strFontSize} ${strBold}`;
    return `<span class="app-span ${strClassName}" data-component-id=${componentId}>${text}</span>`;
  }
}

export default Span;
