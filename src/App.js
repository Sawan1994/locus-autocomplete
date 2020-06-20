import React from "react";
import "./App.css";
import "./styles.css";
import { options } from "./data";
import AutoComplete from "./components/autocomplete";

function App() {
  const filter = (suggestion, userInput) => {
    const { id, name, items, address } = suggestion;

    userInput = userInput.toLowerCase();

    return (
      name.toLowerCase().indexOf(userInput) > -1 ||
      id.toLowerCase().indexOf(userInput) > -1 ||
      address.toLowerCase().indexOf(userInput) > -1 ||
      items.find((item) => item.toLowerCase().indexOf(userInput) > -1)
    );
  };

  return (
    <div className="App">
      <AutoComplete suggestions={options} filterSuggestions={filter} />
    </div>
  );
}

export default App;
