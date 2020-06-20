import React, { useState, useRef, useEffect } from "react";
import UserCard from "../UserCard";

function AutoComplete({ suggestions, filterSuggestions }) {
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userInput, setUserInput] = useState("");

  const [suggestionsRef, setSuggestionsRef] = useState([]);

  const containerRef = useRef();

  useEffect(() => {
    if (showSuggestions) {
      const callback = (event) => {
        if (!event.target.closest(".autocomplete")) {
          setShowSuggestions(false);
        }
      };

      document.addEventListener("click", callback);

      return () => {
        document.removeEventListener("click", callback);
      };
    }
  }, [showSuggestions]);

  /**
   * generate ref for each item in suggestions
   */
  useEffect(() => {
    setSuggestionsRef(
      suggestions.reduce((acc, value) => {
        acc[value.id] = React.createRef();
        return acc;
      }, {})
    );
  }, [suggestions]);

  useEffect(() => {
    if (showSuggestions) {
      scrollOptionIntoView();
    }
  }, [activeSuggestion, filteredSuggestions]);

  /**
   * change input when user type in search box
   */
  const onChange = (e) => {
    const userInput = e.currentTarget.value;

    // Filter our suggestions that don't contain the user's input
    const filteredSuggestions = suggestions.filter((suggestion) =>
      filterSuggestions(suggestion, userInput)
    );

    setActiveSuggestion(0);
    setFilteredSuggestions(filteredSuggestions);
    setShowSuggestions(true);
    setUserInput(userInput);
  };

  const onClick = (e) => {
    console.log("click : ", e.currentTarget.innerText);
    setUserInput(filteredSuggestions[e.currentTarget.dataset.index].name);
    setActiveSuggestion(0);
    setFilteredSuggestions([]);
    setShowSuggestions(false);
  };

  const getSuggestionsList = () => {
    let suggestionsListComponent;

    if (showSuggestions && userInput) {
      if (filteredSuggestions.length) {
        suggestionsListComponent = (
          <ul className="suggestions">
            {filteredSuggestions.map((suggestion, index) => {
              let className;

              // Flag the active suggestion with a class
              if (index === activeSuggestion) {
                className = "suggestion-active";
              }

              return (
                <li
                  className={className}
                  key={suggestion.id}
                  onClick={onClick}
                  ref={suggestionsRef[suggestion.id]}
                  data-index={index}
                  onMouseEnter={handleMouseEnter}
                >
                  <UserCard {...suggestion} />
                </li>
              );
            })}
          </ul>
        );
      } else {
        suggestionsListComponent = (
          <ul className="suggestions">
            <li>No suggestions, you're on your own!</li>
          </ul>
        );
      }
    }

    return suggestionsListComponent;
  };

  const handleMouseEnter = (event) => {
    if (event.target.dataset.index)
      setActiveSuggestion(Number(event.target.dataset.index));
  };

  const scrollOptionIntoView = () => {
    if (
      filteredSuggestions[activeSuggestion] &&
      suggestionsRef[filteredSuggestions[activeSuggestion].id].current
    ) {
      suggestionsRef[
        filteredSuggestions[activeSuggestion].id
      ].current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  };

  const onKeyDown = (e) => {
    // User pressed the enter key
    if (e.keyCode === 13) {
      setActiveSuggestion(0);
      setShowSuggestions(false);
      setUserInput(filteredSuggestions[activeSuggestion].name);
    }
    // User pressed the up arrow
    else if (e.keyCode === 38) {
      e.preventDefault();
      if (activeSuggestion === 0) {
        return;
      }

      setActiveSuggestion(activeSuggestion - 1);
    }
    // User pressed the down arrow
    else if (e.keyCode === 40) {
      e.preventDefault();
      if (activeSuggestion === filteredSuggestions.length - 1) {
        return;
      }

      setActiveSuggestion(activeSuggestion + 1);
    }
  };

  return (
    <div className="autocomplete" ref={containerRef}>
      <input
        type="text"
        onChange={onChange}
        onKeyDown={onKeyDown}
        value={userInput}
        placeholder="Search users by ID, address, name"
      />
      {getSuggestionsList()}
    </div>
  );
}

export default AutoComplete;
