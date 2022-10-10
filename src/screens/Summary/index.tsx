import { useEffect, useState, useCallback } from "react";

import { ActivityIndicator } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { addMonths, subMonths, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { RFValue } from "react-native-responsive-fontsize";
import { useTheme } from "styled-components";
import { VictoryPie } from "victory-native";

import { HistoryCard } from "../../components/HistoryCard";
import { TransactionCardProps } from "../../components/TransactionCard";
import { useAuth } from "../../hooks/auth";
import { categories } from "../../utils/categories";
import { getUserTransactionsKey } from "../../utils/storageKeys";

import {
  Container,
  Header,
  Title,
  Content,
  ChartWrapper,
  MonthSelector,
  MonthSelectorButton,
  MonthSelectorIcon,
  Month,
  LoadingWrapper,
} from "./styles";

type Transaction = TransactionCardProps;

type CategorySummary = {
  key: string;
  name: string;
  total: number;
  formattedTotal: string;
  color: string;
  percentage: string;
};

export function Summary() {
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<CategorySummary[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const theme = useTheme();

  const { user } = useAuth();

  const USER_TRANSACTIONS = getUserTransactionsKey(user.id);

  function handleDateChange(action: "next" | "previous") {
    if (action === "next") {
      const newDate = addMonths(selectedDate, 1);
      setSelectedDate(newDate);
    } else {
      const newDate = subMonths(selectedDate, 1);
      setSelectedDate(newDate);
    }
  }

  async function loadHistory() {
    setIsLoading(true);
    const transactionsFromStorage = await AsyncStorage.getItem(
      USER_TRANSACTIONS
    );

    const transactions = transactionsFromStorage
      ? JSON.parse(transactionsFromStorage)
      : [];

    const expenses = transactions.filter(
      (transaction: Transaction) =>
        transaction.type === "debit" &&
        new Date(transaction.date).getMonth() === selectedDate.getMonth() &&
        new Date(transaction.date).getFullYear() === selectedDate.getFullYear()
    );

    const totalExpenses = expenses.reduce(
      (accumulator: number, expense: Transaction) => {
        return accumulator + Number(expense.amount);
      },
      0
    );

    const totalByCategory: CategorySummary[] = [];

    categories.forEach((category) => {
      let categoryAmountSum = 0;

      expenses.forEach((expense: Transaction) => {
        if (expense.category === category.key) {
          categoryAmountSum += Number(expense.amount);
        }
      });

      if (categoryAmountSum > 0) {
        const formattedTotal = categoryAmountSum.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });

        const percentage = `${(
          (categoryAmountSum / totalExpenses) *
          100
        ).toFixed(0)}%`;

        totalByCategory.push({
          key: category.key,
          name: category.name,
          total: categoryAmountSum,
          formattedTotal,
          color: category.color,
          percentage,
        });
      }
    });

    setSummary(totalByCategory);
    setIsLoading(false);
  }

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [selectedDate])
  );

  return (
    <Container>
      <Header>
        <Title>Resumo por Categoria</Title>
      </Header>

      {isLoading ? (
        <LoadingWrapper>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </LoadingWrapper>
      ) : (
        <Content
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingBottom: useBottomTabBarHeight(),
          }}
        >
          <MonthSelector>
            <MonthSelectorButton onPress={() => handleDateChange("previous")}>
              <MonthSelectorIcon name="chevron-left" />
            </MonthSelectorButton>

            <Month>
              {format(selectedDate, "MMMM, yyyy", {
                locale: ptBR,
              })}
            </Month>

            <MonthSelectorButton onPress={() => handleDateChange("next")}>
              <MonthSelectorIcon name="chevron-right" />
            </MonthSelectorButton>
          </MonthSelector>

          <ChartWrapper>
            <VictoryPie
              data={summary}
              colorScale={summary.map((category) => category.color)}
              style={{
                labels: {
                  fontSize: RFValue(18),
                  fontWeight: "bold",
                  fill: theme.colors.shape,
                },
              }}
              labelRadius={50}
              x="percentage"
              y="total"
            />
          </ChartWrapper>
          {summary.map((category) => (
            <HistoryCard
              key={category.key}
              title={category.name}
              amount={category.formattedTotal}
              color={category.color}
            />
          ))}
        </Content>
      )}
    </Container>
  );
}
