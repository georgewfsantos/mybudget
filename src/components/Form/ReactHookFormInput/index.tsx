import { TextInputProps } from "react-native";
import { Control, Controller, FieldError } from "react-hook-form";

import { Input } from "../Input";

import { Container, Error } from "./styles";

type Props = TextInputProps & {
  control: Control<any>;
  name: string;
  error: string | undefined;
};

export default function ReactHookFormInput({
  control,
  name,
  error,
  ...rest
}: Props) {
  return (
    <Container>
      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <Input onChangeText={onChange} value={value} {...rest} />
        )}
        name={name}
      />
      {error && <Error>{error}</Error>}
    </Container>
  );
}
