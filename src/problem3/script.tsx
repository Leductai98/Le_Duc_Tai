/* 
Old version of code have these issues:

1. Missing type of blockchain and missing it in WalletBalance interface
2. Interface FormattedWalletBalance have 2 field is the same field with WalletBalance.
3. Have unnecessary variable.
*/

// add blockchain fields and type of it
interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

// extends type from WalletBalance
interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

// change type Props to BoxProps because Props have the same field with BoxProps
const WalletPage: React.FC<BoxProps> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const getPriority = (blockchain: string): number => {
    switch (blockchain) {
      case "Osmosis":
        return 100;
      case "Ethereum":
        return 50;
      case "Arbitrum":
        return 30;
      case "Zilliqa":
        return 20;
      case "Neo":
        return 20;
      default:
        return -99;
    }
  };

  // add type for sortedBalances
  const sortedBalances: FormattedWalletBalance[] = useMemo(() => {
    return (
      balances
        .filter((balance: WalletBalance) => {
          const balancePriority = getPriority(balance.blockchain);
          // delete wrong variable and refactor code
          return balancePriority > -99 && balance.amount > 0;
        })

        // refactor code
        .sort((lhs: WalletBalance, rhs: WalletBalance) => {
          const leftPriority = getPriority(lhs.blockchain);
          const rightPriority = getPriority(rhs.blockchain);
          return rightPriority - leftPriority;
        })
        .map((balance: WalletBalance) => ({
          ...balance,
          formatted: balance.amount.toFixed(),
        }))
    );
  }, [balances, prices]);

  // delete unuse variable formattedBalances

  const rows = sortedBalances.map(
    (balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    }
  );

  return <div {...rest}>{rows}</div>;
};
