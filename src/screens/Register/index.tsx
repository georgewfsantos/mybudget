import React, { useState } from "react";

import { Alert, Keyboard, Modal, TouchableWithoutFeedback } from "react-native";

import { yupResolver } from "@hookform/resolvers/yup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import uuid from "react-native-uuid";

import { Button } from "../../components/Form/Button";
import { CategorySelection } from "../CategorySelection";
import { CategorySelect } from "../../components/Form/CategorySelect";
import ReactHookFormInput from "../../components/Form/ReactHookFormInput";
import { TransactionTypeButton } from "../../components/Form/TransactionTypeButton";
import { TransactionType } from "../../components/TransactionCard";
import { useAuth } from "../../hooks/auth";
import { getUserTransactionsKey } from "../../utils/storageKeys";

import {
  Container,
  Form,
  Fields,
  Header,
  Title,
  TransactionTypeButtonGroup,
} from "./styles";

// I could use this type below:
/*  type FormValues = {
  [name: string]: string;
}; */

// or the type below using Partial<T>
type FormValues = {
  name: string;
  amount: string;
};

const initialSelectedCategory = {
  key: "category",
  name: "Category",
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Nome é obrigatório"),
  amount: Yup.number()
    .typeError("Informe um valor numérico")
    .positive("Valor não pode ser negativo")
    .required("Valor é obrigatório"),
});

export function Register() {
  const [selectedTransactionType, setSelectedTransactionType] = useState<
    TransactionType | ""
  >("");
  const [selectedCategory, setSelectedCategory] = useState(
    initialSelectedCategory
  );
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const navigation = useNavigation();

  const { user } = useAuth();

  const USER_TRANSACTIONS = getUserTransactionsKey(user.id);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(validationSchema),
  });

  function handleTransactionTypeSelection(type: TransactionType) {
    setSelectedTransactionType(type);
  }

  async function handleFormSubmit(formValues: Partial<FormValues>) {
    if (!selectedTransactionType) {
      return Alert.alert("Selecione o tipo da transação");
    }

    if (selectedCategory.key === "category") {
      return Alert.alert("Selecione a categoria da transação");
    }

    const newTransaction = {
      id: String(uuid.v4()),
      name: formValues.name,
      amount: formValues.amount,
      type: selectedTransactionType,
      category: selectedCategory.key,
      date: new Date(),
    };

    try {
      const transactionsFromStorage = await AsyncStorage.getItem(
        USER_TRANSACTIONS
      );
      const currentTransactions = transactionsFromStorage
        ? JSON.parse(transactionsFromStorage)
        : [];

      const transactions = [...currentTransactions, newTransaction];

      await AsyncStorage.setItem(
        USER_TRANSACTIONS,
        JSON.stringify(transactions)
      );

      reset();
      setSelectedTransactionType("");
      setSelectedCategory(initialSelectedCategory);

      navigation.navigate("Listagem");
    } catch (error) {
      Alert.alert("Não foi possível salvar");
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header>
          <Title>Cadastro</Title>
        </Header>

        <Form>
          <Fields>
            <ReactHookFormInput
              name="name"
              control={control}
              placeholder="Nome"
              autoCapitalize="sentences"
              autoCorrect={false}
              error={errors.name && errors.name.message}
            />
            <ReactHookFormInput
              name="amount"
              control={control}
              placeholder="Valor"
              keyboardType="numeric"
              error={errors.amount && errors.amount.message}
            />

            <TransactionTypeButtonGroup>
              <TransactionTypeButton
                type="credit"
                title="Income"
                isSelected={selectedTransactionType === "credit"}
                onPress={() => handleTransactionTypeSelection("credit")}
              />
              <TransactionTypeButton
                type="debit"
                title="Outcome"
                onPress={() => handleTransactionTypeSelection("debit")}
                isSelected={selectedTransactionType === "debit"}
              />
            </TransactionTypeButtonGroup>
          </Fields>

          <CategorySelect
            title={selectedCategory.name}
            onPress={() => setIsCategoryModalOpen(true)}
          />
          <Button title="Enviar" onPress={handleSubmit(handleFormSubmit)} />
        </Form>

        <Modal visible={isCategoryModalOpen}>
          <CategorySelection
            category={selectedCategory}
            setCategory={setSelectedCategory}
            closeCategorySelectionModal={() => setIsCategoryModalOpen(false)}
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  );
}
