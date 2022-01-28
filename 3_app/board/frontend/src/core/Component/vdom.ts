/**
 * ✨ createNodes
 * - 주어진 Element의 childNodes 반환
 */
export function createNodes(originEle: Element | Node): Node[] {
  return Array.from(originEle.childNodes);
}

/**
 * ✨ createTemplateNodes
 * - 임시 Element를 생성하여 innerHTML에 strTemplate를 대입 후 childNodes를 반환
 */
export function createTemplateNodes(strTemplate: string): Node[] {
  const tempEle = document.createElement("div");
  tempEle.innerHTML = strTemplate;
  return Array.from(tempEle.childNodes);
}

// ------

/**
 * ✨ updateNodes
 * - 이전 Node들과 새로운 Node들을 비교하여 최신으로 업데이트
 */
export function updateNodes(
  originEle: Element | Node,
  prevNodes: Node[],
  newNodes: Node[],
  isNeedFixNodes?: boolean
): void {
  const MAX_LENGTH = Math.max(prevNodes.length, newNodes.length);
  let idx = 0;

  if (isNeedFixNodes) newNodes = fixedNewNodes(prevNodes, newNodes);

  while (MAX_LENGTH > idx) {
    const prevNode = prevNodes[idx];
    const newNode = newNodes[idx];

    // 1. 기본 비교
    const isDfff = execDifferentCheck(originEle, prevNode, newNode);
    if (isDfff) {
      idx++;
      continue;
    }

    // 2. 속성 비교
    execAttributesCheck(prevNode, newNode);

    // 3. 재귀
    const prevChildren = createNodes(prevNode);
    const newChildren = createNodes(newNode);
    if (prevChildren.length || newChildren.length) updateNodes(prevNode, prevChildren, newChildren);
    idx++;
  }
}

/**
 * 👾 execDifferentCheck
 * - 이전 Node와 새로운 Node가 다를 때 모든 조건을 계산하고 업데이트
 *      - 이 함수가 마지막에 true를 반환했다면 attributes를 업데이트할 필요는 없음
 */
function execDifferentCheck(originEle: Element | Node, prevNode: Node, newNode: Node) {
  const isRemove = prevNode && !newNode;
  const isAppend = !prevNode && newNode;

  if (isRemove) originEle.removeChild(prevNode);
  else if (isAppend) originEle.appendChild(newNode);
  if (isRemove || isAppend) return true;

  const isNotSameType = prevNode.nodeName !== newNode.nodeName;
  const isTextType = [prevNode, newNode].every((node) => node instanceof Text);
  const isDiffText = isTextType && prevNode.nodeValue !== newNode.nodeValue;

  if (isNotSameType) originEle.replaceChild(newNode, prevNode);
  else if (isDiffText) prevNode.nodeValue = newNode.nodeValue;
  if (isNotSameType || isDiffText) return true;

  return false;
}

/**
 * 👾 execAttributesCheck
 * - [!] 일반 Node 타입에서는 사용 불가.
 * - 이전 Element의 attributes를 새로운 Element의 attributes를 기준으로 업데이트
 *      - 업데이트 후, 새로운 Element에 없는 속성이라면 제거.
 */
function execAttributesCheck(prevNode: Node | Element, newNode: Node | Element) {
  if (!(prevNode instanceof Element) || !(newNode instanceof Element)) return;

  const newAttrs = Array.from(newNode.attributes);
  const prevAttrs = Array.from(prevNode.attributes);
  newAttrs.forEach(
    ({ name, value }) =>
      prevAttrs.find(({ name: prevName, value: prevValue }) => name === prevName && value === prevValue) ??
      prevNode.setAttribute(name, value)
  );
  prevAttrs.forEach(
    ({ name }) => newAttrs.find(({ name: newName }) => newName === name) ?? prevNode.removeAttribute(name)
  );
}

/**
 * 👾 fixedNewNodes
 * - Compoennt에서 isKeepAdding에 의해 _renderState 변경 시 newNodes만 비교하여 업데이트하면 안됨.
 *    - prevNodes에는 다른 컴포넌트들에 의해 추가된 Element들이 있음.
 * - 주어진 prevNodes, newNodes를 활용하여 새로운 node들을 만들어내는 함수
 *   - prevNodes를 복제 후, newNodes의 요소를 추가하여 새로운 node들을 반환.
 */
function fixedNewNodes(prevNodes: Node[], newNodes: Node[]): Node[] {
  const result = [...prevNodes];
  newNodes.forEach((newNode) => {
    const idx = prevNodes.findIndex((prevNode) => {
      const isSameNodeName = newNode.nodeName === prevNode.nodeName;
      const isAllElement = prevNode instanceof HTMLElement && newNode instanceof HTMLElement;
      if (!isAllElement) return;
      const prevId = prevNode.dataset.componentId;
      const newId = newNode.dataset.componentId;
      const isSameId = prevId === newId;

      return isSameNodeName && isAllElement && isSameId;
    });
    if (idx === -1) return;
    result[idx] = newNode;
  });
  return result;
}
