interface SpaceProps {
    m?: string,
    mt?: string,
    mr?: string,
    mb?: string,
    ml?: string,
    mx?: string,
    my?: string,

    p?: string,
    pt?: string,
    pr?: string,
    pb?: string,
    pl?: string,
    px?: string,
    py?: string,
}

function space(props: SpaceProps) {
    return `
        ${props.m ? `margin: ${props.m};` : ''}
        ${props.mt ? `margin-top: ${props.mt};` : ''}
        ${props.mr ? `margin-right: ${props.mr};` : ''}
        ${props.mb ? `margin-bottom: ${props.mb};` : ''}
        ${props.ml ? `margin-left: ${props.ml};` : ''}
        ${props.mx ? `margin-left: ${props.mx};margin-right: ${props.mx}` : ''}
        ${props.my ? `margin-top: ${props.my};margin-top: ${props.my}` : ''}
        ${props.p ? `padding: ${props.p};` : ''}
        ${props.pt ? `padding-top: ${props.pt};` : ''}
        ${props.pr ? `padding-right: ${props.pr};` : ''}
        ${props.pb ? `padding-bottom: ${props.pb};` : ''}
        ${props.pl ? `padding-left: ${props.pl};` : ''}
        ${props.px ? `padding-left: ${props.px};padding-right: ${props.px}` : ''}
        ${props.py ? `padding-top: ${props.py};padding-top: ${props.py}` : ''}
    `
}

export {
    SpaceProps
}
export default space;

