import { useCallback, useEffect, useState } from "react";

import { ActivityIndicator } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "styled-components";

import { BalanceCard } from "../../components/BalanceCard";
import {
  TransactionCardProps,
  TransactionCard,
} from "../../components/TransactionCard";

import {
  Container,
  Header,
  HeaderContentWrapper,
  UserInfo,
  Avatar,
  UserInfoTextContent,
  Greeting,
  UserName,
  Icon,
  BalanceCards,
  Transactions,
  TransactionListTitle,
  TransactionList,
  LogoutButton,
  LoadingWrapper,
} from "./styles";
import { useAuth } from "../../hooks/auth";
import { getUserTransactionsKey } from "../../utils/storageKeys";

export type TransactionListItemProps = TransactionCardProps & {
  id: string;
};

type BalanceCategoryProps = {
  total: string;
  lastTransaction: string;
};

type OverAllBalance = {
  income: BalanceCategoryProps;
  expenses: BalanceCategoryProps;
  total: string;
};

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<TransactionListItemProps[]>(
    []
  );
  const [overAllBalance, setOverAllBalance] = useState<OverAllBalance>(
    {} as OverAllBalance
  );

  const { signOut, user } = useAuth();

  const theme = useTheme();

  const USER_TRANSACTIONS = getUserTransactionsKey(user.id);

  function getLastTransactionDate(transactionType: "credit" | "debit") {
    const filteredTransactions = transactions?.filter(
      (item) => item.type === transactionType
    );

    if (filteredTransactions.length > 0) {
      const lastTransactionDate = new Date(
        Math.max.apply(
          Math,

          filteredTransactions.map((item) => new Date(item.date).getTime())
        )
      );

      return `${lastTransactionDate.getDate()} de ${lastTransactionDate.toLocaleString(
        "pt-BR",
        {
          month: "long",
        }
      )}`;
    }

    return "no_transactions";
  }

  async function loadTransactions() {
    const transactionsFromStorage = await AsyncStorage.getItem(
      USER_TRANSACTIONS
    );

    let totalIncome = 0;
    let totalExpenses = 0;

    const transactionsList = transactionsFromStorage
      ? JSON.parse(transactionsFromStorage)
      : [];

    const formattedTransactions: TransactionListItemProps[] =
      transactionsList.map((transaction: TransactionListItemProps) => {
        if (transaction.type === "credit") {
          totalIncome += Number(transaction.amount);
        } else {
          totalExpenses += Number(transaction.amount);
        }

        const amount = Number(transaction.amount).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });

        return {
          id: transaction.id,
          name: transaction.name,
          amount,
          type: transaction.type,
          category: transaction.category,
          date: transaction.date,
        };
      });

    setTransactions(formattedTransactions);

    setOverAllBalance({
      income: {
        total: totalIncome.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        lastTransaction: getLastTransactionDate("credit"),
      },
      expenses: {
        total: totalExpenses.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        lastTransaction: getLastTransactionDate("debit"),
      },
      total: (totalIncome - totalExpenses).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      }),
    });

    setIsLoading(false);
  }

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [
      overAllBalance?.income?.lastTransaction,
      overAllBalance?.expenses?.lastTransaction,
    ])
  );

  return (
    <Container>
      {isLoading ? (
        <LoadingWrapper>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </LoadingWrapper>
      ) : (
        <>
          <Header>
            <HeaderContentWrapper>
              <UserInfo>
                <Avatar source={{ uri: user.avatar }} />
                <UserInfoTextContent>
                  <Greeting>Olá,</Greeting>
                  <UserName>{user.name}</UserName>
                </UserInfoTextContent>
              </UserInfo>
              <LogoutButton onPress={signOut}>
                <Icon name="power" />
              </LogoutButton>
            </HeaderContentWrapper>
          </Header>
          <BalanceCards>
            <BalanceCard
              type="credit"
              title="Entradas"
              amount={overAllBalance.income.total}
              lastTransaction={
                overAllBalance.income.lastTransaction === "no_transactions"
                  ? "Não há transações registradas."
                  : `Última entrada dia ${overAllBalance.income.lastTransaction}`
              }
            />

            <BalanceCard
              type="debit"
              title="Saídas"
              amount={overAllBalance.expenses.total}
              lastTransaction={
                overAllBalance.expenses.lastTransaction === "no_transactions"
                  ? "Não há transações registradas"
                  : `Última saída dia ${overAllBalance.expenses.lastTransaction}`
              }
            />

            <BalanceCard
              type="total"
              title="Total"
              amount={overAllBalance.total}
              lastTransaction={
                overAllBalance.expenses.lastTransaction === "no_transactions"
                  ? "Não há transações registradas"
                  : `1 a ${overAllBalance.expenses.lastTransaction}`
              }
            />
          </BalanceCards>
          <Transactions>
            <TransactionListTitle>Listagem</TransactionListTitle>
            <TransactionList
              data={transactions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <TransactionCard data={item} />}
            />
          </Transactions>
        </>
      )}
    </Container>
  );
}
