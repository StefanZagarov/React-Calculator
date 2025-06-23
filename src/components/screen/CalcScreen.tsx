import { useEffect, useLayoutEffect, useRef } from 'react';
import styles from './CalcScreen.module.css';

interface CalcScreenProps {
  inputScreen: string;
  result: string;
  caretPosition: number;
  onKeyboardInput: (newInputValue: string) => void;
  onCaretPositionChange: (newCaretPosition: number) => void;
}

const numberRegExCheck = /^[0-9/*\-+.]$/;

export default function CalcScreen({ inputScreen: input, result, caretPosition, onKeyboardInput, onCaretPositionChange }: CalcScreenProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus(); // Ensure input is focused to see/set caret
    }
  }, [input]);

  // useLayoutEffect is generally a good choice for DOM manipulations that need to happen synchronously after all DOM mutations but before the browser has painted
  useLayoutEffect(() => {
    if (inputRef.current) {
      inputRef.current.setSelectionRange(caretPosition, caretPosition);
    }
  }, [caretPosition]);

  // Add dynamic resizing for result to fit within container
  const resultRef = useRef<HTMLParagraphElement>(null);
  const initialFontRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    const el = resultRef.current;
    if (el) {
      if (initialFontRef.current === null) {
        initialFontRef.current = parseFloat(getComputedStyle(el).fontSize);
      }
      // Reset to original font size before measuring
      el.style.fontSize = `${initialFontRef.current}px`;
      // If content overflows, scale down the font size
      if (el.scrollWidth > el.clientWidth && initialFontRef.current > 0) {
        const ratio = el.clientWidth / el.scrollWidth;
        el.style.fontSize = `${initialFontRef.current * ratio}px`;
      }
    }
  }, [result]);

  // HANDLER 1: When the user types directly into the input field
  function handleKeyboardInput(e: React.FormEvent<HTMLInputElement>) {
    // Best practice when manually controlling insertion with onBeforeInput is to always call e.preventDefault()
    e.preventDefault();
    // React doesn't officially export React.InputEvent, so I have to use React.FormEvent
    const nativeEvent = e.nativeEvent as InputEvent;
    const character = nativeEvent.data as string; // The character the user is trying to insert

    const isNumber = numberRegExCheck.test(character);

    if (!isNumber) return;

    onKeyboardInput(character);
  };

  // HANDLER 2: When the user changes caret position (clicks or uses arrow keys)
  // This updates App's understanding of where the caret is
  const handleSelect = (e: React.SyntheticEvent<HTMLInputElement, Event>) => {
    const input = e.currentTarget;
    const position = input.selectionStart as number;

    onCaretPositionChange(position);
  };

  return (
    <>
      <div className={styles["screen"]}>
        <input
          ref={inputRef}
          className={styles["input"]}
          value={input}
          onBeforeInput={handleKeyboardInput}
          onSelect={handleSelect}

        ></input>
        <p ref={resultRef} className={styles["result"]}>{result}</p>
      </div>
    </>
  );
}