import { useEffect, useState } from "react";
import { List } from "./List";
import axios from "axios";
import { Pagination } from "./Pagination";

function App() {
  const [items, setItems] = useState([]);
  const [currentPageUrl, setCurrentPageUrl] = useState(
    "https://pokeapi.co/api/v2/pokemon/"
  );
  const [previousPageUrl, setPreviousPageUrl] = useState("");
  const [nextPageUrl, setNextPageUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    let cancel;

    axios
      .get(currentPageUrl, {
        cancelToken: new axios.CancelToken((c) => (cancel = c)),
      })
      .then((res) => {
        setPreviousPageUrl(res.data.previous);
        setNextPageUrl(res.data.next);
        setItems(res.data.results.map((item) => item.name));

        setLoading(false);
      });

    return () => cancel();
  }, [currentPageUrl]);

  function goToNextPage() {
    setCurrentPageUrl(nextPageUrl);
  }

  function goToPreviousPage() {
    setCurrentPageUrl(previousPageUrl);
  }

  if (loading) return "Loading...";

  return (
    <>
      <List items={items} />
      <Pagination
        goToNextPage={nextPageUrl ? goToNextPage : null}
        goToPreviousPage={previousPageUrl ? goToPreviousPage : null}
      />
    </>
  );
}

export default App;
