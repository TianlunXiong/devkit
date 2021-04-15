interface GridProps {
  gridGap?: string;
  gridColumnGap?: string;
  gridRowGap?: string;
  gridColumn?: string;
  gridRow?: string;
  gridAutoFlow?: string;
  gridAutoColumns?: string;
  gridAutoRows?: string;
  gridTemplateColumns?: string;
  gridTemplateRows?: string;
  gridTemplateAreas?: string;
  gridArea?: string;
}

function grid(props: GridProps) {
    return `
        ${props.gridGap ? `grid-gap: ${props.gridGap};` : ''}
        ${props.gridColumnGap ? `grid-column-gap: ${props.gridColumnGap};` : ''}
        ${props.gridRowGap ? `grid-row-gap: ${props.gridRowGap};` : ''}
        ${props.gridColumnGap ? `grid-column-gap: ${props.gridColumnGap};` : ''}
        ${props.gridColumn ? `grid-column: ${props.gridColumn};` : ''}
        ${props.gridRow ? `grid-row-gap: ${props.gridRow};` : ''}
        ${props.gridAutoFlow ? `grid-auto-flow: ${props.gridAutoFlow};` : ''}
        ${props.gridAutoColumns ? `grid-auto-columns: ${props.gridAutoColumns};` : ''}
        ${props.gridAutoRows ? `grid-auto-rows: ${props.gridAutoRows};` : ''}
        ${props.gridTemplateColumns ? `grid-template-columns: ${props.gridTemplateColumns};` : ''}
        ${props.gridTemplateRows ? `grid-template-rows: ${props.gridTemplateRows};` : ''}
        ${props.gridTemplateAreas ? `grid-template-areas: ${props.gridTemplateAreas};` : ''}
        ${props.gridArea ? `grid-area: ${props.gridArea};` : ''}
    `
}

export {
    GridProps
}
export default grid;

