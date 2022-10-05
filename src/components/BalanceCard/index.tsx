import {
  Container,
  Header,
  Title,
  Icon,
  Footer,
  Amount,
  LastTransaction,
} from "./styles";

type Props = {
  title: string;
  amount: string;
  lastTransaction: string;
  type: "credit" | "debit" | "total";
};

const icon = {
  credit: "arrow-up-circle",
  debit: "arrow-down-circle",
  total: "dollar-sign",
};

export function BalanceCard({ title, amount, lastTransaction, type }: Props) {
  return (
    <Container type={type}>
      <Header>
        <Title type={type}>{title}</Title>
        <Icon name={icon[type]} type={type} />
      </Header>
      <Footer>
        <Amount type={type}>{amount}</Amount>
        <LastTransaction type={type}>{lastTransaction}</LastTransaction>
      </Footer>
    </Container>
  );
}
