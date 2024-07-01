import { useEffect, useState } from "react";
import { CurrencyRow } from "./components/CurrencyRow";

const BASE_URL = `https://api.currencyapi.com/v3/latest?apikey=${process.env.REACT_APP_API_KEY}`;

function App() {
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("");
  const [toCurrency, setToCurrency] = useState("");
  const [exchangeRate, setExchangeRate] = useState(0);
  const [amount, setAmount] = useState(1);
  const [amountFromCurrency, setAmountFromCurrency] = useState(true);

  let toAmount, fromAmount;

  if (amountFromCurrency) {
    fromAmount = amount;
    toAmount = amount * exchangeRate;
  } else {
    toAmount = amount;
    fromAmount = amount / exchangeRate;
  }

  useEffect(() => {
    fetch(BASE_URL)
      .then((res) => res.json())
      .then((data) => {
        const firstCurrency = Object.keys(data.data)[0];

        setCurrencyOptions([...Object.keys(data.data)]);
        setFromCurrency(firstCurrency);
        setToCurrency(Object.keys(data.data)[1]);
        setExchangeRate(data.data[firstCurrency].value);
      });
  }, []);

  useEffect(() => {
    if (!fromCurrency || !toCurrency) return;

    fetch(`${BASE_URL}&base_currency=${fromCurrency}`)
      .then((res) => res.json())
      .then((data) => {
        setExchangeRate(data.data[toCurrency].value);
      });
  }, [fromCurrency, toCurrency]);

  function handleFromAmountChange(e) {
    setAmount(e.target.value);
    setAmountFromCurrency(true);
  }

  function handleToAmountChange(e) {
    setAmount(e.target.value);
    setAmountFromCurrency(false);
  }

  return (
    <>
      <h1>Convert</h1>
      <CurrencyRow
        currencyOptions={currencyOptions}
        selectedCurrency={fromCurrency}
        onChangeCurrency={(e) => setFromCurrency(e.target.value)}
        amount={fromAmount}
        onChangeAmount={handleFromAmountChange}
      />
      <div className="equals">=</div>
      <CurrencyRow
        currencyOptions={currencyOptions}
        selectedCurrency={toCurrency}
        onChangeCurrency={(e) => setToCurrency(e.target.value)}
        amount={toAmount}
        onChangeAmount={handleToAmountChange}
      />
    </>
  );
}

export default App;
