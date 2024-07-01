import { useState } from "react";
import { SidebarItem } from "./components/SidebarItem";
import { Slider } from "./components/Slider";
import { DEFAULT_OPTIONS } from "./options";

function App() {
  const [options, setOptions] = useState(DEFAULT_OPTIONS);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
  const selectedOption = options[selectedOptionIndex];

  function handleSlideChange({ target }) {
    setOptions((prevOptions) => {
      return prevOptions.map((option, index) => {
        if (index !== selectedOptionIndex) return option;

        return { ...option, value: target.value };
      });
    });
  }

  function getImageStyle() {
    const filters = options.map((option) => {
      return `${option.property}(${option.value}${option.unit})`;
    });

    return { filter: filters.join(" ") };
  }

  return (
    <div className="container">
      <div className="main-image" style={getImageStyle()}></div>
      <div className="sidebar">
        {options.map((option, index) => {
          return (
            <SidebarItem
              key={index}
              name={option.name}
              active={index === selectedOptionIndex}
              handleClick={() => setSelectedOptionIndex(index)}
            />
          );
        })}
      </div>
      <Slider
        min={selectedOption.range.min}
        max={selectedOption.range.max}
        value={selectedOption.range.value}
        handleChange={handleSlideChange}
      />
    </div>
  );
}

export default App;
