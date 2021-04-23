interface BackgroundProps {
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  backgroundRepeat?: string;
}

function background(props: BackgroundProps) {
    return `
        ${props.backgroundImage ? `background-image: ${props.backgroundImage};` : ''}
        ${props.backgroundSize ? `background-size: ${props.backgroundSize};` : ''}
        ${props.backgroundPosition ? `background-position: ${props.backgroundPosition};` : ''}
        ${props.backgroundRepeat ? `background-repeat: ${props.backgroundRepeat};` : ''}
    `
}

export {
    BackgroundProps
}
export default background;

