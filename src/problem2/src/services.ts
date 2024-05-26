import { ICurrency } from "./App";

export const getCurrencyData: () => Promise<ICurrency[]> = async () => {
  const res = await fetch("https://interview.switcheo.com/prices.json");
  const data = await res.json();
  return data;
};
