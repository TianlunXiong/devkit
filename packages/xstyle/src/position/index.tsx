interface PositionProps {
  position?: string;
  zIndex?: string;
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
}

function position(props: PositionProps) {
    return `
        ${props.position ? `position: ${props.position};` : ''}
        ${props.zIndex ? `z-index: ${props.zIndex};` : ''}
        ${props.top ? `top: ${props.top};` : ''}
        ${props.right ? `right: ${props.right};` : ''}
        ${props.bottom ? `bottom: ${props.bottom};` : ''}
        ${props.left ? `left: ${props.left};` : ''}
    `
}

export {
    PositionProps
}
export default position;

