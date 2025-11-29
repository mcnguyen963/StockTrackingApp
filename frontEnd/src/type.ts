export type UserData = {
  key: string;
  email: string;
  displayName: string;
  FavoriteStocks: string[];
};
export type Page =
  | "Home"
  | "Compound Interest Calculator"
  | "S&P 500 Simulator"
  | "Settings"
  | "About";
