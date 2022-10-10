import { TouchableOpacityProps } from "react-native";
import { SvgProps } from "react-native-svg";

import { Container, LogoWrapper, ButtonText } from "./styles";

type Props = TouchableOpacityProps & {
  title: string;
  svg: React.FC<SvgProps>;
};

export function SocialSignInButton({ title, svg: Svg, ...rest }: Props) {
  return (
    <Container {...rest}>
      <LogoWrapper>
        <Svg />
      </LogoWrapper>
      <ButtonText>{title}</ButtonText>
    </Container>
  );
}
