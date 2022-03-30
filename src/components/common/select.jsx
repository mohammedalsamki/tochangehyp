import React from "react";
const Select = ({
  name,
  label,
  options,
  dispName,
  error,
  selectedId,
  ...rest
}) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <select {...rest} name={name} id={name} className="form-control">
        {options.map((option) => (
          <option
            key={option.id}
            value={option.id}
            selected={selectedId === option.id}
          >
            {option[dispName]}
          </option>
        ))}
      </select>
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};

export default Select;
