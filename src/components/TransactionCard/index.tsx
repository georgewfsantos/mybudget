import { categories } from "../../utils/categories";
import { formatDate } from "../../utils/constants";

import {
  Container,
  Title,
  Amount,
  Footer,
  Category,
  Icon,
  CategoryName,
  Date,
} from "./styles";

export type TransactionType = "credit" | "debit";

export type TransactionCardProps = {
  type: TransactionType;
  name: string;
  amount: string;
  category: string;
  date: string;
};

type Props = {
  data: TransactionCardProps;
};

export function TransactionCard({ data }: Props) {
  const { type, name, amount, category, date } = data;

  const categoryDetails = categories.find((item) => item.key === category);

  const formattedDate = formatDate(date);

  return (
    <Container>
      <Title>{name}</Title>

      <Amount type={type}>
        {type === "debit" && "- "}
        {amount}
      </Amount>

      <Footer>
        <Category>
          <Icon name={categoryDetails?.icon} />
          <CategoryName>{categoryDetails?.name}</CategoryName>
        </Category>
        <Date>{formattedDate}</Date>
      </Footer>
    </Container>
  );
}
