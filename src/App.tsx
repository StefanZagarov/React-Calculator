import { useState } from 'react';
import './App.css';
import Button from './components/button/Button';
import CalcScreen from './components/screen/CalcScreen';

// TODO: Add logic to swap current operator (+, -, etc.) when a new operator is clicked if there are no numbers yet

const C = `C`;
const BACKSPACE = `<--`;
const EQUAL = `=`;
const PLUS = `+`;
const MINUS = `-`;
const TIMES = `*`;
const DIVIDE = `/`;
const PERCENT = `%`;
const NEGATE = `+/-`; // Turn the current inputting number negative, or if its negative, turn it positive e.g. 5 + 1 will turn the 1 into -1
const LEFT_BRACKET = `(`;
const RIGHT_BRACKET = `)`;
const MOVE_CARET_RIGHTMOST = `>>`;

function App() {
  const [input, setInput] = useState<string>(`0`);
  const [result, setResult] = useState<string>(`0`);
  // App now owns the desired caret position state
  const [caretPosition, setCaretPosition] = useState<number>(1);

  // Callback for CalcScreen to inform App of user-driven changes
  function handleUserInputChangeInScreen(newInputValue: string, newCaretPos: number) {
    setInput(newInputValue);
    setCaretPosition(newCaretPos);
  };

  function handleClick(value: string) {
    const currentCaretPosition = caretPosition;
    let newInput = input;

    switch (value) {
      case C:
        setInput(`0`);
        setResult(`0`);
        return;

      case BACKSPACE:
        if (currentCaretPosition === 0) return;
        newInput = input.slice(0, currentCaretPosition - 1) + input.slice(currentCaretPosition);

        if (newInput === "") {
          setInput('0');
        }
        else {
          setInput(newInput);
          setCaretPosition(Math.max(0, currentCaretPosition - 1));
        }
        return;

      case MOVE_CARET_RIGHTMOST:
        setCaretPosition(input.length);
        return;

      case EQUAL:
        console.log("To be implemented");
        return;

      case PERCENT:
        console.log("To be implemented");
        return;

      case NEGATE:
        console.log("To be implemented");
        return;

      case LEFT_BRACKET:
        console.log("To be implemented");
        return;

      case RIGHT_BRACKET:
        console.log("To be implemented");
        return;

      case PLUS:
        console.log("To be implemented");
        return;

      case MINUS:
        console.log("To be implemented");
        return;

      case TIMES:
        console.log("To be implemented");
        return;

      case DIVIDE:
        console.log("To be implemented");
        return;

      default:
        console.log("Invalid input");
        break;
    }

    if (input === `0` && value !== `0`) {
      setInput(value);
      setCaretPosition(currentCaretPosition + 1);
      return;
    }

    const partBeforeCaret = input.slice(0, currentCaretPosition);
    const partAfterCaret = input.slice(currentCaretPosition);
    const newInputValue = partBeforeCaret + value + partAfterCaret;

    setInput(newInputValue);
    setCaretPosition(currentCaretPosition + 1);
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
            <Button variant="function-top" value='>>' onClick={handleClick} />
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
