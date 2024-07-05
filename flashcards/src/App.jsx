import { useEffect, useRef, useState } from "react";
import { FlashcardList } from "./FlashcardList";
import axios from "axios";

function decodeString(string) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = string;
  return textarea.value;
}

function App() {
  const [flashcards, setFlashcards] = useState([]);
  const [categories, setCategories] = useState([]);

  const categoryRef = useRef();
  const amountRef = useRef();

  useEffect(() => {
    axios.get("https://opentdb.com/api_category.php").then((res) => {
      setCategories(res.data.trivia_categories);
    });
  }, []);

  function handleSubmit(e) {
    e.preventDefault();

    axios
      .get("https://opentdb.com/api.php", {
        params: {
          amount: amountRef.current.value,
          category: categoryRef.current.value,
        },
      })
      .then((res) => {
        setFlashcards(
          res.data.results.map((questionItem, index) => {
            const answer = decodeString(questionItem.correct_answer);
            const options = [
              ...questionItem.incorrect_answers.map((a) => decodeString(a)),
              answer,
            ];

            return {
              id: `${index}-${Date.now()}`,
              question: decodeString(questionItem.question),
              answer,
              options: options.sort(() => Math.random() - 0.5),
            };
          })
        );
      });
  }

  return (
    <>
      <form className="header" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select name="" id="category" ref={categoryRef}>
            {categories.map((category) => {
              return (
                <option value={category.id} key={category.id}>
                  {category.name}
                </option>
              );
            })}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="amount">Number of Questions</label>
          <input
            type="number"
            id="amount"
            min={1}
            step={1}
            defaultValue={10}
            ref={amountRef}
          />
        </div>
        <div className="form-group">
          <button className="btn">Generate</button>
        </div>
      </form>
      <div className="contanier">
        <FlashcardList flashcards={flashcards} />
      </div>
    </>
  );
}

export default App;
