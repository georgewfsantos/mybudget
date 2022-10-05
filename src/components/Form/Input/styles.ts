import { RFValue } from "react-native-responsive-fontsize";

import styled from "styled-components/native";
import { css } from "styled-components/native";

export const Container = styled.TextInput`
  width: 100%;
  padding: 16px 18px;
  font-size: ${RFValue(14)}px;
  ${({ theme }) => css`
    background-color: ${theme.colors.shape};
    color: ${theme.colors.text_dark}
    font-family: ${theme.fonts.regular};
  `};
  border-radius: 5px;
  margin-bottom: 8px;
`;
