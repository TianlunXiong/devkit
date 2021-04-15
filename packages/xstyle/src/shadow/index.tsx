interface ShadowProps {
    textShadow?: string;
    boxShadow?: string;
}

function shadow(props: ShadowProps) {
    return `
        ${props.boxShadow ? `box-shadow: ${props.boxShadow};` : ''}
        ${props.textShadow ? `text-shadow: ${props.textShadow};` : ''}
    `
}

export {
    ShadowProps
}
export default shadow;

