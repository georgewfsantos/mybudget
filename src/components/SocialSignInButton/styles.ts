import { RFValue } from "react-native-responsive-fontsize";
import styled from "styled-components/native";

export const Container = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  height: ${RFValue(56)}px;
  border-radius: 5px;
  margin-bottom: 16px;
  background-color: ${({ theme }) => theme.colors.shape};
`;

export const LogoWrapper = styled.View`
  height: 100%;
  justify-content: center;
  align-items: center;
  padding: ${RFValue(16)}px;
  border-right-width: 1px;
  border-color: ${({ theme }) => theme.colors.background};
`;

export const ButtonText = styled.Text`
  flex: 1;
  text-align: center;
  font-size: ${RFValue(14)}px;
  font-family: ${({ theme }) => theme.fonts.medium};
`;
