import { Component, Props, TargetType } from "@src/core";
import "./style.scss";

type DefaultButtonProps = Pick<HTMLButtonElement, "name"> & Partial<Pick<HTMLButtonElement, "type">>;
interface ButtonProps extends Props, DefaultButtonProps {
  text: string;
  color?: "normal" | "blue" | "red";
  size?: "small" | "medium" | "large";
}

class Button extends Component<{}, ButtonProps> {
  constructor(protected readonly $target: TargetType, protected props: ButtonProps) {
    super($target, props);
  }
  protected setTemplate(): string {
    const { componentId, props } = this;
    const { color, size } = props;
    const strColor = color ? `color--${color}` : `color--normal`;
    const strSize = size ? `size--${size}` : `size--small`;
    const strClassName = `${strColor} ${strSize}`;

    return `<button class="app-button ${strClassName}"
      ${this.createStringAttribute("text", "color", "size")} data-component-id=${componentId}>
      ${props.text}</button>`;
  }
}

export default Button;
