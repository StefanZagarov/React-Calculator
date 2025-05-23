import { useState } from 'react';
import './App.css';
import Button from './components/button/Button';
import CalcScreen from './components/screen/CalcScreen';

const C = `C`;
const BACKSPACE = `<--`;
const EQUAL = `=`;
const PLUS = `+`;
const MINUS = `-`;
const TIMES = `*`;
const DIVIDE = `/`;
const PERCENT = `%`;

function App() {
  const [input, setInput] = useState<string>(`0`);
  const [result, setResult] = useState<string>(`0`);
  // App now owns the desired cursor position state
  const [caretPosition, setCaretPosition] = useState<number>(1);

  // Callback for CalcScreen to inform App of user-driven changes
  function handleUserInputChangeInScreen(newInputValue: string, newCursorPos: number) {
    setInput(newInputValue);
    setCaretPosition(newCursorPos);
  };

  function handleClick(value: string) {
    const currentCaretPosition = caretPosition;
    let newInput = input;
    console.log(currentCaretPosition);
    switch (value) {
      case C:
        setInput(`0`);
        setResult(`0`);
        setCaretPosition(1);
        return;

      case BACKSPACE:
        // If the input is "0" and the caret is at position 1 (after the '0'),
        // or if the input is just "0" (caret pos doesn't matter as much here), do nothing.
        if (input === `0`) {
          setCaretPosition(1);
          return;
        }

        // Caret at beginning, nothing to delete before it
        // setCaretPosition(0); // Already 0
        if (currentCaretPosition === 0) return; // Nothing to delete before it, so no change in input or cursor

        // If deleting the character would result in an empty string, set it to "0"
        // This happens if input has 1 character (e.g., "7") and caret is at 1 (after "7")
        if (input.length === 1 && currentCaretPosition > 0) { // currentCaretPos should be 1 here
          setInput('0');
          setCaretPosition(1);
          return;
        }

        // Standard deletion
        newInput = input.slice(0, currentCaretPosition - 1) + input.slice(currentCaretPosition);

        // If after deletion the string becomes empty (this shouldn't happen if above logic is correct,
        // but as a safeguard or if there are other ways an empty string might occur), reset to "0".
        // However, with the above logic, this case is less likely to be hit for backspace.
        if (newInput === "") { // More robust than newInput.length === 0 if "" is possible
          setInput('0');
          setCaretPosition(1);
        } else {
          setInput(newInput);
          setCaretPosition(Math.max(0, currentCaretPosition - 1));
        }

        return;
    }

    // setInput(input => input + value);
    const partBeforeCaret = input.slice(0, currentCaretPosition);
    const partAfterCaret = input.slice(currentCaretPosition);
    const newInputValue = partBeforeCaret + value + partAfterCaret;

    setInput(newInputValue);
  }

  return (
    <div className="container">
      <div className="calculator">

        <div className="screen">
          <CalcScreen
            input={input}
            result={result}
            cursorPosition={caretPosition}
            onUserInputChange={handleUserInputChangeInScreen}
          />
        </div>

        <div className="buttons">
          <div className="row">
            <Button variant="function-top" value='<--' onClick={handleClick} />
            <Button variant="function-top" value='=' onClick={handleClick} />
          </div>

          <div className="row">
            <Button value='7' onClick={handleClick} />
            <Button value='8' onClick={handleClick} />
            <Button value='9' onClick={handleClick} />
            <Button variant="function" value='%' onClick={handleClick} />
            <Button variant="function" value='C' onClick={handleClick} />
          </div>

          <div className="row">
            <Button value='4' onClick={handleClick} />
            <Button value='5' onClick={handleClick} />
            <Button value='6' onClick={handleClick} />
            <Button variant="function" value='*' onClick={handleClick} />
            <Button variant="function" value='/' onClick={handleClick} />
          </div>

          <div className="row">
            <Button value='1' onClick={handleClick} />
            <Button value='2' onClick={handleClick} />
            <Button value='3' onClick={handleClick} />
            <Button variant="function" value='+' onClick={handleClick} />
            <Button variant="function" value='-' onClick={handleClick} />
          </div>

          <div className="row">
            <Button value='.' onClick={handleClick} />
            <Button value='0' onClick={handleClick} />
            <Button variant="function" value='+/-' onClick={handleClick} />
            <Button variant="function" value='(' onClick={handleClick} />
            <Button variant="function" value=')' onClick={handleClick} />
          </div>
        </div>
      </div>
    </div >
  );
}

export default App;
