import { useState, ChangeEvent, FocusEvent, InputHTMLAttributes } from "react";
import "./Input.css";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  placeholder: string;
  autocomplete?: string;
}

export default function Input({
  type,
  placeholder,
  name,
  autocomplete,
  onChange,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const initialValue = props.defaultValue || props.value;
  const [hasValue, setHasValue] = useState<boolean>(
    initialValue != null && initialValue !== ""
  );

  const handleFocus = (): void => {
    setIsFocused(true);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>): void => {
    setIsFocused(false);
    setHasValue(e.target.value !== "");
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setHasValue(e.target.value !== "");
    if (onChange) {
      onChange(e);
    }
  };

  const isActive = isFocused || hasValue;

  return (
    <div className="input-container">
      <input
        type={type}
        id={placeholder}
        name={name}
        className={`input-field ${isActive ? "active" : ""}`}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleInputChange}
        autoComplete={autocomplete}
        placeholder=" "
        {...props}
      />
      <label
        htmlFor={placeholder}
        className={`input-label ${isActive ? "active" : ""}`}
      >
        {placeholder}
      </label>
    </div>
  );
}
