import { TextInputProps } from "react-native";

import { Container } from "./styles";

export function Input({ ...props }: TextInputProps) {
  return <Container {...props} />;
}
