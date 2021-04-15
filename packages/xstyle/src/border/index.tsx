interface BorderProps {
  border?: string;
  borderWidth?: string;
  borderStyle?: string;
  borderColor?: string;
  borderRadius?: string;
  borderTop?: string;
  borderTopWidth?: string;
  borderTopStyle?: string;
  borderTopColor?: string;
  borderTopLeftRadius?: string;
  borderTopRightRadius?: string;
  borderRight?: string;
  borderRightWidth?: string;
  borderRightStyle?: string;
  borderRightColor?: string;
  borderBottom?: string;
  borderBottomWidth?: string;
  borderBottomStyle?: string;
  borderBottomColor?: string;
  borderBottomLeftRadius?: string;
  borderBottomRightRadius?: string;
  borderLeft?: string;
  borderLeftWidth?: string;
  borderLeftStyle?: string;
  borderLeftColor?: string;
}

function border(props: BorderProps) {
    return `
        ${props.border ? `border: ${props.border};` : ''}
        ${props.borderWidth ? `border-width: ${props.borderWidth};` : ''}
        ${props.borderStyle ? `border-style: ${props.borderStyle};` : ''}
        ${props.borderColor ? `border-color: ${props.borderColor};` : ''}
        ${props.borderRadius ? `border-radius: ${props.borderRadius};` : ''}
        ${props.borderTop ? `border-top: ${props.borderTop};` : ''}
        ${props.borderTopWidth ? `border-top-width: ${props.borderTopWidth};` : ''}
        ${props.borderTopStyle ? `border-top-style: ${props.borderTopStyle};` : ''}
        ${props.borderTopColor ? `border-top-color: ${props.borderTopColor};` : ''}
        ${props.borderTopLeftRadius ? `border-left-top-radius: ${props.borderTopLeftRadius};` : ''}
        ${props.borderTopRightRadius ? `border-left-right-radius: ${props.borderTopRightRadius};` : ''}
        ${props.borderRight ? `border-right: ${props.borderRight};` : ''}
        ${props.borderRightWidth ? `border-right-width: ${props.borderRightWidth};` : ''}
        ${props.borderRightStyle ? `border-right-style: ${props.borderRightStyle};` : ''}
        ${props.borderRightColor ? `border-right-color: ${props.borderRightColor};` : ''}
        ${props.borderBottom ? `border-bottom: ${props.borderBottom};` : ''}
        ${props.borderBottomWidth ? `border-bottom-width: ${props.borderBottomWidth};` : ''}
        ${props.borderBottomStyle ? `border-bottom-style: ${props.borderBottomStyle};` : ''}
        ${props.borderBottomColor ? `border-bottom-color: ${props.borderBottomColor};` : ''}
        ${props.borderBottomLeftRadius ? `border-bottom-top-radius: ${props.borderBottomLeftRadius};` : ''}
        ${props.borderBottomRightRadius ? `border-bottom-right-radius: ${props.borderBottomRightRadius};` : ''}
        ${props.borderLeft ? `border-left: ${props.borderLeft};` : ''}
        ${props.borderLeftWidth ? `border-left-width: ${props.borderLeftWidth};` : ''}
        ${props.borderLeftStyle ? `border-left-style: ${props.borderLeftStyle};` : ''}
        ${props.borderLeftColor ? `border-left-color: ${props.borderLeftColor};` : ''}
    `
}

export {
    BorderProps
}
export default border;

