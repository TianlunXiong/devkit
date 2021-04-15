interface ColorProps {
    color?: string,
    bg?: string,
}

function color(props: ColorProps) {
    return `
        ${props.color ? `color: ${props.color};` : ''}
        ${props.bg ? `background-color: ${props.bg};` : ''}
    `
}

export {
    ColorProps
}
export default color;

