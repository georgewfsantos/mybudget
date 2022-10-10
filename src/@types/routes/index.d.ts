export type ProductRouteNavigationProps = {
  id?: string;
};

export type OrderRouteNavigationProps = {
  id: string;
};

export declare global {
  namespace ReactNavigation {
    interface RootParamList {
      Listagem: undefined;
      Cadastrar: undefined;
      Resumo: undefined;
    }
  }
}
