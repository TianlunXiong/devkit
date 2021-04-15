interface TypographyProps {
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  lineHeight?: string;
  letterSpacing?: string;
  textAlign?: string;
}

function typography(props: TypographyProps) {
    return `
        ${props.fontFamily ? `font-family: ${props.fontFamily};` : ''}
        ${props.fontSize ? `font-size: ${props.fontSize};` : ''}
        ${props.fontWeight ? `font-weight: ${props.fontWeight};` : ''}
        ${props.lineHeight ? `line-height: ${props.lineHeight};` : ''}
        ${props.letterSpacing ? `letter-spacing: ${props.letterSpacing};` : ''}
        ${props.textAlign ? `text-align: ${props.textAlign};` : ''}
    `
}

export {
    TypographyProps
}
export default typography;

