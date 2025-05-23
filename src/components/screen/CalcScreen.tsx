import { useEffect, useRef } from 'react';
import styles from './CalcScreen.module.css';

interface CalcScreenProps {
  input: string;
  result: string;
  cursorPosition: number;
  onUserInputChange: (newInputValue: string, newCursorPos: number) => void;
}

export default function CalcScreen({ input, result, cursorPosition, onUserInputChange, }: CalcScreenProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // EFFECT 1: Set the cursor position when the cursorPosition prop changes
  // This is driven by App telling CalcScreen where the cursor should be
  // (e.g., after a button click in App)
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus(); // Ensure input is focused to see/set caret
      inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
    }
  }, [input, cursorPosition]); // Rerun if input or cursorPosition prop changes

  // HANDLER 1: When the user types directly into the input field
  const handleNativeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const newCursorPos = e.target.selectionStart || 0;
    onUserInputChange(newValue, newCursorPos); // Inform App
  };

  // HANDLER 2: When the user changes selection (clicks, uses arrow keys)
  // This updates App's understanding of where the cursor is
  const handleSelect = (e: React.SyntheticEvent<HTMLInputElement, Event>) => {
    const target = e.currentTarget as HTMLInputElement;
    if (target.selectionStart !== null) {
      // Inform App about the new cursor position, even if the value hasn't changed
      onUserInputChange(input, target.selectionStart);
    }
  };

  return (
    <>
      <div className={styles["screen"]}>
        <input
          ref={inputRef}
          className={styles["input"]}
          value={input}
          onChange={handleNativeInputChange}
          onSelect={handleSelect}
        ></input>
        <p className={styles["result"]}>{result}</p>
      </div>
    </>
  );
}