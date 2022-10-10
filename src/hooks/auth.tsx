import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import * as AuthSession from "expo-auth-session";
import * as AppleAuthSession from "expo-apple-authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { USER } from "../utils/storageKeys";

const { CLIENT_ID } = process.env;
const { REDIRECT_URI } = process.env;

type AuthProviderProps = {
  children: ReactNode;
};

type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};

type AuthContext = {
  user: User;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signOut: () => Promise<void>;
  isUserLoading: boolean;
};

type AuthResponse = {
  params: {
    access_token: string;
  };
  type: string;
};

const AuthContext = createContext({} as AuthContext);

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>({} as User);
  const [isUserLoading, setIsUserLoading] = useState(true);

  async function signInWithGoogle() {
    try {
      const RESPONSE_TYPE = "token";
      const SCOPE = encodeURI("profile email");

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

      const { type, params } = (await AuthSession.startAsync({
        authUrl,
      })) as AuthResponse;

      if (type === "success") {
        const response = await fetch(
          `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`
        );

        const userData = await response.json();

        const formattedUserData = {
          id: userData.id,
          email: userData.email,
          name: userData.given_name,
          avatar: userData.picture,
        };

        setUser(formattedUserData);

        await AsyncStorage.setItem(USER, JSON.stringify(userData));
      }
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async function signInWithApple() {
    try {
      const credentials = await AppleAuthSession.signInAsync({
        requestedScopes: [
          AppleAuthSession.AppleAuthenticationScope.EMAIL,
          AppleAuthSession.AppleAuthenticationScope.FULL_NAME,
        ],
      });

      if (credentials) {
        const name = credentials.fullName!.givenName!;
        const avatar = `https://ui-avatars.com/api/?name=${name}&length=1`;

        const userData = {
          id: credentials.user,
          email: credentials.email!,
          name,
          avatar,
        };

        setUser(userData);

        await AsyncStorage.setItem(USER, JSON.stringify(userData));
      }
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async function signOut() {
    setUser({} as User);
    await AsyncStorage.removeItem(USER);
  }

  useEffect(() => {
    async function loadUserData() {
      const userData = await AsyncStorage.getItem(USER);

      if (userData) {
        setUser(JSON.parse(userData));
      }
      setIsUserLoading(false);
    }
    loadUserData();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        signInWithGoogle,
        signInWithApple,
        signOut,
        isUserLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);

  return context;
}

export { AuthProvider, useAuth };
