import { useEffect, useRef, useState } from "react";

export function Flashcard({ flashcard }) {
  const [flip, setFlip] = useState(false);
  const [height, setHeight] = useState("initial");

  const frontRef = useRef();
  const backRef = useRef();

  function setMaxHeight() {
    const frontHeight = frontRef.current.getBoundingClientRect().height;
    const backHeight = backRef.current.getBoundingClientRect().height;

    setHeight(Math.max(frontHeight, backHeight, 100));
  }

  useEffect(setMaxHeight, [
    flashcard.question,
    flashcard.answer,
    flashcard.options,
  ]);

  useEffect(() => {
    window.addEventListener("resize", setMaxHeight);

    return () => window.removeEventListener("resize", setMaxHeight);
  }, []);

  return (
    <div
      className={`card ${flip ? "flip" : ""}`}
      style={{ height }}
      onClick={() => setFlip((pre) => !pre)}
    >
      <div className="front" ref={frontRef}>
        {flashcard.question}
        <div className="options">
          {flashcard.options.map((option, index) => {
            return (
              <div key={index} className="flashcard-option">
                {option}
              </div>
            );
          })}
        </div>
      </div>
      <div className="back" ref={backRef}>
        {flashcard.answer}
      </div>
    </div>
  );
}
