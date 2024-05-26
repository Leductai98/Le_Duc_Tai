import {
  ChangeEvent,
  KeyboardEvent,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { FormProps } from "antd";
import { InputNumber, message } from "antd";
import { Card, Typography, Button, Space, Image } from "antd";
import { Select } from "antd";

import { getCurrencyData } from "./services";
import Loading from "./components/Loading";
type FieldType = {
  from?: string;
  to?: string;
  amount?: number;
};

export type ICurrency = {
  currency: string;
  date: string;
  price: number;
  index?: number;
};

type IOption = {
  label: ReactElement;
  value: string;
};

function App() {
  const [currencyList, setCurrencyList] = useState<ICurrency[]>([]);
  const [selectOptions, setSelectOptions] = useState<IOption[]>([]);
  const [from, setFrom] = useState<ICurrency | null>(null);
  const [to, setTo] = useState<ICurrency | null>(null);
  const [amount, setAmount] = useState<number | string>("");
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    getData();
  }, []);

  const toOptions = useMemo(() => {
    if (from) {
      const index = from.index;
      const newOptions = [...selectOptions];
      if (index !== undefined) {
        if (index === 0) {
          newOptions.shift();
        } else {
          newOptions.splice(index, 1);
        }
      }
      return newOptions;
    } else {
      return selectOptions;
    }
  }, [selectOptions, from]);

  const getData: () => void = useCallback(async () => {
    try {
      const data = await getCurrencyData();
      const newData = Array.from(new Set(data));
      setCurrencyList(newData);
      const options: IOption[] = newData.map(
        (item: ICurrency, index: number) => {
          return {
            label: (
              <div className="currency" key={index}>
                <img src={`./tokens/${item.currency}.svg`} alt="" />
                <span>{item.currency}</span>
              </div>
            ),
            value: JSON.stringify({ ...item, index: index }),
          };
        }
      );
      setSelectOptions(options);
    } catch (err) {
      message.error(`${err}`, 3);
    }
  }, []);

  const renderRate = useCallback(() => {
    if (from && to) {
      return `${amount} ${from.currency} = ${(
        (to.price / from.price) *
        Number(amount)
      ).toFixed(2)} ${to.currency}`;
    } else {
      message.error("Please select from and to", 3);
    }
  }, [from, to, amount]);

  const handleSelect = useCallback((type: string, value: string) => {
    const obj = JSON.parse(value);
    if (type === "from") {
      setFrom(obj);
    } else {
      setTo(obj);
    }
  }, []);

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setAmount(value);
  }, []);

  const handleSwap = useCallback(() => {
    let timeOut: number;
    if (from && to && amount !== "" && amount !== 0) {
      setLoading(true);
      timeOut = setTimeout(() => {
        setLoading(false);
        setAmount("");
        message.success("Swap successfully completed", 3);
      }, 3000);
    } else {
      if (amount === "" || amount === 0) {
        message.error("Please fill amount");
      } else if (!from) {
        message.error("Please fill from token");
      } else {
        message.error("Please fill to token");
      }
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [amount, from, to]);

  return (
    <main>
      <div className="container">
        <form action="#">
          <div className="amount">
            <p>Enter Amount</p>
            <input
              type="number"
              value={amount}
              onChange={(event) => handleChange(event)}
            />
          </div>
          <div className="drop-list">
            <div className="from">
              <p>From</p>

              <Select
                placeholder="From token"
                options={selectOptions}
                onChange={(value: string) => handleSelect("from", value)}
              />
            </div>
            <div className="icon">
              <i className="fas fa-exchange-alt" />
            </div>
            <div className="to">
              <p>To</p>
              <Select
                placeholder="To token"
                options={toOptions}
                onChange={(value: string) => handleSelect("to", value)}
              />
            </div>
          </div>
          {from && to && amount ? (
            <div className="exchange-rate">{renderRate()}</div>
          ) : (
            <div className="exchange-rate">Getting exchange rate...</div>
          )}

          <button disabled={loading} onClick={handleSwap}>
            Swap
          </button>
          {loading && <Loading />}
        </form>
      </div>
    </main>
  );
}

export default App;
