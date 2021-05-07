interface LayoutProps {
  width?: string;
  height?: string;
  display?: string;
  minWidth?: string;
  minHeight?: string;
  maxWidth?: string;
  maxHeight?: string;
  size?: string;
  verticalAlign?: string;
  overflow?: string;
  overflowX?: string;
  overflowY?: string;
}

function layout(props: LayoutProps) {
    return `
        ${props.width ? `width: ${props.width};` : ''}
        ${props.height ? `height: ${props.height};` : ''}
        ${props.display ? `display: ${props.display};` : ''}
        ${props.minWidth ? `min-width: ${props.minWidth};` : ''}
        ${props.minHeight ? `min-height: ${props.minHeight};` : ''}
        ${props.maxWidth ? `max-height: ${props.maxWidth};` : ''}
        ${props.maxHeight ? `max-height: ${props.maxHeight};` : ''}
        ${props.size ? `height: ${props.size};width: ${props.size};` : ''}
        ${props.verticalAlign ? `vertical-align: ${props.verticalAlign};` : ''}
        ${props.overflow ? `overflow: ${props.overflow};` : ''}
        ${props.overflowX ? `overflow-x: ${props.overflowX};` : ''}
        ${props.overflowY ? `overflow-y: ${props.overflowY};` : ''}
    `
}

export {
    LayoutProps
}
export default layout;

