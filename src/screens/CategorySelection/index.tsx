import { FlatList } from "react-native";

import {
  Container,
  Header,
  Title,
  Category,
  Icon,
  Name,
  Separator,
  Footer,
} from "./styles";

import { Button } from "../../components/Form/Button";

import { categories } from "../../utils/categories";

type Category = {
  key: string;
  name: string;
};

type Props = {
  category: Category;
  setCategory: (category: Category) => void;
  closeCategorySelectionModal: () => void;
};

export function CategorySelection({
  category,
  setCategory,
  closeCategorySelectionModal,
}: Props) {
  return (
    <Container>
      <Header>
        <Title>{category.name}</Title>
      </Header>

      <FlatList
        data={categories}
        style={{
          flex: 1,
          width: "100%",
        }}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <Category
            onPress={() => setCategory(item)}
            isSelected={category.key === item.key}
          >
            <Icon name={item.icon} />
            <Name>{item.name}</Name>
          </Category>
        )}
        ItemSeparatorComponent={() => <Separator />}
      />
      <Footer>
        <Button title="Selecionar" onPress={closeCategorySelectionModal} />
      </Footer>
    </Container>
  );
}
