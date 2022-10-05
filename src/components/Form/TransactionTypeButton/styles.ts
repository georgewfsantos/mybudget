import styled from "styled-components/native";
import { Feather } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";

import { TransactionType } from "../../TransactionCard";
import { css } from "styled-components/native";

type IconProps = {
  type: TransactionType;
};

type ContainerProps = {
  isSelected: boolean;
  type: TransactionType;
};

export const Container = styled.TouchableOpacity<ContainerProps>`
  width: 48%;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  padding: 16px;
  ${({ theme, type, isSelected }) =>
    isSelected &&
    type === "credit" &&
    css`
      background-color: ${theme.colors.success_light};
    `}
  ${({ theme, type, isSelected }) =>
    isSelected &&
    type === "debit" &&
    css`
      background-color: ${theme.colors.attention_light};
    `}
  ${({ theme, isSelected }) => css`
    border-width: ${isSelected ? 0 : 1.5}px;
    border-color: ${theme.colors.text};
    border-style: solid;
  `}
`;

export const Icon = styled(Feather)<IconProps>`
  font-size: ${RFValue(24)}px;
  margin-right: 12px;
  color: ${({ theme, type }) =>
    type === "credit" ? theme.colors.success : theme.colors.attention};
`;

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(14)}px;
`;
