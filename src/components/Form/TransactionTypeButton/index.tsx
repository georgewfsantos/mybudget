import { TouchableOpacityProps } from "react-native";
import { TransactionType } from "../../TransactionCard";

import { Container, Icon, Title } from "./styles";

type Props = TouchableOpacityProps & {
  title: string;
  type: TransactionType;
  isSelected: boolean;
};

const icons = {
  credit: "arrow-up-circle",
  debit: "arrow-down-circle",
};

export function TransactionTypeButton({
  title,
  type,
  isSelected,
  ...rest
}: Props) {
  return (
    <Container isSelected={isSelected} type={type} {...rest}>
      <Icon name={icons[type]} type={type} />
      <Title>{title}</Title>
    </Container>
  );
}
