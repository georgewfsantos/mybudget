import { useState } from "react";

import { ActivityIndicator, Alert, Platform } from "react-native";

import { RFValue } from "react-native-responsive-fontsize";
import { useTheme } from "styled-components";

import {
  Container,
  Header,
  HeaderTitleWrapper,
  Title,
  SignInText,
  Footer,
  SignInButtonGroup,
} from "./styles";

import AppleLogo from "../../assets/apple.svg";
import GoogleLogo from "../../assets/google.svg";
import Logo from "../../assets/logo.svg";
import { SocialSignInButton } from "../../components/SocialSignInButton";
import { useAuth } from "../../hooks/auth";

export function SignIn() {
  const [isUserLogging, setIsUserLogging] = useState(false);

  const { signInWithGoogle, signInWithApple } = useAuth();

  const theme = useTheme();

  async function handleSignInWithGoogle() {
    try {
      setIsUserLogging(true);
      return await signInWithGoogle();
    } catch (error) {
      Alert.alert("Não foi possível buscar informações da sua conta Google");
      setIsUserLogging(false);
    }
  }

  async function handleSignInWithApple() {
    try {
      setIsUserLogging(true);
      return await signInWithApple();
    } catch (error) {
      Alert.alert("Não foi possível buscar informações da sua conta Google");
      setIsUserLogging(false);
    }
  }

  return (
    <Container>
      <Header>
        <HeaderTitleWrapper>
          <Logo width={RFValue(120)} height={RFValue(68)} />
          <Title>
            Controle suas {"\n"}
            finanças de forma {"\n"}
            muito simples
          </Title>
        </HeaderTitleWrapper>

        <SignInText>
          Faça seu login com {"\n"}
          uma das contas abaixo
        </SignInText>
      </Header>

      <Footer>
        <SignInButtonGroup>
          <SocialSignInButton
            title="Entrar com Google"
            svg={GoogleLogo}
            onPress={handleSignInWithGoogle}
          />
          {Platform.OS === "ios" && (
            <SocialSignInButton
              title="Entrar com Apple"
              svg={AppleLogo}
              onPress={handleSignInWithApple}
            />
          )}
        </SignInButtonGroup>

        {isUserLogging && (
          <ActivityIndicator
            color={theme.colors.shape}
            style={{ marginTop: 18 }}
          />
        )}
      </Footer>
    </Container>
  );
}
