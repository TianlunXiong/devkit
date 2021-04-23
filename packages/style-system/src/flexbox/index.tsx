interface FlexBoxProps {
  alignItems?: string;
  alignContent?: string;
  justifyItems?: string;
  justifyContent?: string;
  flexWrap?: string;
  flexDirection?: string;
  flex?: string;
  flexGrow?: string;
  flexShrink?: string;
  flexBasis?: string;
  justifySelf?: string;
  alignSelf?: string;
  order?: string;
}


function flexbox(props: FlexBoxProps) {
    return `
        ${props.flex ? `flex: ${props.flex};` : ''}
        ${props.flexGrow ? `flex-grow: ${props.flexGrow};` : ''}
        ${props.flexShrink ? `flex-shrink: ${props.flexShrink};` : ''}
        ${props.flexBasis ? `flex-basis: ${props.flexBasis};` : ''}
        ${props.flexDirection ? `flex-direction: ${props.flexDirection};` : ''}
        ${props.flexWrap ? `flex-wrap: ${props.flexWrap};` : ''}
        ${props.alignItems ? `align-items: ${props.alignItems};` : ''}
        ${props.alignSelf ? `justify-self: ${props.justifySelf};` : ''}
        ${props.justifyContent ? `justify-content: ${props.justifyContent};` : ''}
        ${props.justifyItems ? `justify-items: ${props.justifyItems};` : ''}
        ${props.justifySelf ? `justify-self: ${props.justifySelf};` : ''}
        ${props.order ? `order: ${props.order};` : ''}
    `
}

export {
    FlexBoxProps
}
export default flexbox;

