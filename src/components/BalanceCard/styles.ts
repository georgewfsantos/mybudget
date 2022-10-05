import styled, { css } from "styled-components/native";
import { Feather } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";

type CardType = {
  type: "credit" | "debit" | "total";
};

const isCardTypeTotal = (type: string) => type === "total";

export const Container = styled.View<CardType>`
  background-color: ${({ theme, type }) =>
    isCardTypeTotal(type) ? theme.colors.secondary : theme.colors.shape};
  width: ${RFValue(300)}px;
  border-radius: 5px;
  padding: 19px 23px;
  padding-bottom: ${RFValue(42)}px;
  margin-right: 16px;
`;

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const Title = styled.Text<CardType>`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(14)}px;
  color: ${({ theme, type }) =>
    isCardTypeTotal(type) ? theme.colors.shape : theme.colors.text_dark};
`;

export const Icon = styled(Feather)<CardType>`
  font-size: ${RFValue(40)}px;

  ${({ theme, type }) =>
    type === "credit" &&
    css`
      color: ${theme.colors.success};
    `}

  ${({ theme, type }) =>
    type === "debit" &&
    css`
      color: ${theme.colors.attention};
    `}
  
    ${({ theme, type }) =>
    type === "total" &&
    css`
      color: ${theme.colors.shape};
    `}
`;

export const Footer = styled.View``;

export const Amount = styled.Text<CardType>`
  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: ${RFValue(32)}px;
  color: ${({ theme, type }) =>
    isCardTypeTotal(type) ? theme.colors.shape : theme.colors.text_dark};
  margin-top: 38px;
`;

export const LastTransaction = styled.Text<CardType>`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(12)}px;
  color: ${({ theme, type }) =>
    isCardTypeTotal(type) ? theme.colors.shape : theme.colors.text};
`;
