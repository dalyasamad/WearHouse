// Renders a reusable React interface component.


import { useState } from "react";

// Renders the reusable CustomDropdown interface component.
function CustomDropdown({
  value,
  options,
  onChange,
  placeholder = "Select",
}) {
  const [open, setOpen] = useState(false);

  function selectOption(option) {
    onChange(option);
    setOpen(false);
  }

  return (
    <div className="custom-dropdown">
      <button
        type="button"
        className={`dropdown-button ${open ? "open" : ""}`}
        onClick={() => setOpen(!open)}
      >
        <span>{value || placeholder}</span>

        <span className={`dropdown-arrow ${open ? "rotate" : ""}`}>
          ⌄
        </span>
      </button>

      {open && (
        <div className="dropdown-menu">
          {options.map((option) => (
            <button
              type="button"
              key={option}
              className={`dropdown-option ${
                value === option ? "selected" : ""
              }`}
              onClick={() => selectOption(option)}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default CustomDropdown;