import styled from 'styled-components';
import color, { ColorProps } from '../color';
import space, { SpaceProps } from '../space';
import typography, { TypographyProps } from '../typography';
import layout, { LayoutProps } from '../layout';
import flexbox, { FlexBoxProps } from '../flexbox';
import background, { BackgroundProps } from '../background';
import border, { BorderProps } from '../border';
import position, { PositionProps } from '../position';
import shadow, { ShadowProps } from '../shadow';

type BoxProps =
ColorProps & SpaceProps & TypographyProps& LayoutProps & FlexBoxProps & BorderProps & BackgroundProps
& PositionProps & ShadowProps;

const Box = styled('div')<BoxProps>`
   ${color}
   ${space}
   ${typography}
   ${layout}
   ${flexbox}
   ${background}
   ${border}
   ${position}
   ${shadow}
`;

export default Box;