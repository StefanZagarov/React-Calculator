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

const operators = [PLUS, MINUS, TIMES, DIVIDE, PERCENT];

function App() {
  const [inputScreen, setInputScreen] = useState<string>(`0`);
  const [result, setResult] = useState<string>(`0`);
  // App now owns the desired caret position state
  const [caretPosition, setCaretPosition] = useState<number>(1);

  function setNewCaretPosition(newCaretPosition: number) {
    setCaretPosition(newCaretPosition);
  }

  // Callback for CalcScreen to inform App of user-driven changes
  function handleKeyboardInput(value: string) {
    handleNewInput(value);
  };

  function resolveNewInputResult(value: string, currentCaretPosition: number) {
    const partBeforeCaret = inputScreen.slice(0, currentCaretPosition);
    const partAfterCaret = inputScreen.slice(currentCaretPosition);
    const newInputValue = partBeforeCaret + value + partAfterCaret;

    setInputScreen(newInputValue);
    setCaretPosition(currentCaretPosition + 1);
  }

  function isLeftOfCaretEmpty(): boolean {
    return inputScreen[caretPosition - 1] === undefined;
  }

  function resolveOperatorResult(inputValue: string, caretPosition: number) {
    if (operators.includes(inputScreen[caretPosition - 1])) {
      const partBeforeCaret = inputScreen.slice(0, caretPosition - 1);
      const partAfterCaret = inputScreen.slice(caretPosition);
      const newInputValue = partBeforeCaret + inputValue + partAfterCaret;

      setInputScreen(newInputValue);
      // Keep caret position, workaround for a weird behavior causing it to go rightmost:
      // Force change
      setCaretPosition(caretPosition - 1);
      // Then restore
      requestAnimationFrame(() => {
        setCaretPosition(caretPosition);
      });
    }
    else {
      resolveNewInputResult(inputValue, caretPosition);
    };
  }

  // TODO: Make result screen to automatically calculate input field's data, if an operator is present

  function handleNewInput(inputValue: string) {
    const currentCaretPosition = caretPosition;
    let newInput = inputScreen;

    switch (inputValue) {
      case C:
        setInputScreen(`0`);
        setResult(`0`);
        return;

      case BACKSPACE:
        if (currentCaretPosition === 0) return;
        newInput = inputScreen.slice(0, currentCaretPosition - 1) + inputScreen.slice(currentCaretPosition);

        if (newInput === "") {
          setInputScreen('0');
        }
        else {
          setInputScreen(newInput);
          setCaretPosition(Math.max(0, currentCaretPosition - 1));
        }
        return;

      case MOVE_CARET_RIGHTMOST:
        setCaretPosition(inputScreen.length);
        return;

      case EQUAL:
        console.log("To be implemented");
        return;

      case PERCENT:
        if (isLeftOfCaretEmpty()) return;
        resolveOperatorResult(inputValue, currentCaretPosition);
        return;

      case NEGATE:
        if (isLeftOfCaretEmpty()) return;

        console.log("To be implemented");
        return;

      case LEFT_BRACKET:
        if (isLeftOfCaretEmpty()) return;
        resolveNewInputResult(inputValue, currentCaretPosition);
        console.log("To be implemented");
        return;

      case RIGHT_BRACKET:
        if (isLeftOfCaretEmpty()) return;
        resolveNewInputResult(inputValue, currentCaretPosition);
        console.log("To be implemented");
        return;

      case PLUS:
        if (isLeftOfCaretEmpty()) return;
        resolveOperatorResult(inputValue, currentCaretPosition);

        console.log("To be implemented");
        return;

      case MINUS:
        if (isLeftOfCaretEmpty()) return;
        resolveOperatorResult(inputValue, currentCaretPosition);
        console.log("To be implemented");
        return;

      case TIMES:
        if (isLeftOfCaretEmpty()) return;
        resolveOperatorResult(inputValue, currentCaretPosition);
        console.log("To be implemented");
        return;

      case DIVIDE:
        if (isLeftOfCaretEmpty()) return;
        resolveOperatorResult(inputValue, currentCaretPosition);
        console.log("To be implemented");
        return;
    }

    if (inputScreen === `0` && caretPosition === 1 && inputValue !== "0") {
      setInputScreen(inputValue);
      setCaretPosition(currentCaretPosition + 1);
      return;
    }

    resolveNewInputResult(inputValue, currentCaretPosition);
  }

  return (
    <div className="container">
      <div className="calculator">

        <div className="screen">
          <CalcScreen
            inputScreen={inputScreen}
            result={result}
            caretPosition={caretPosition}
            onKeyboardInput={handleKeyboardInput}
            onCaretPositionChange={setNewCaretPosition}
          />
        </div>

        <div className="buttons">
          <div className="row">
            <Button variant="function-top" value='<--' onClick={handleNewInput} />
            <Button variant="function-top" value='=' onClick={handleNewInput} />
            <Button variant="function-top" value='>>' onClick={handleNewInput} />
          </div>

          <div className="row">
            <Button value='7' onClick={handleNewInput} />
            <Button value='8' onClick={handleNewInput} />
            <Button value='9' onClick={handleNewInput} />
            <Button variant="function" value='%' onClick={handleNewInput} />
            <Button variant="function" value='C' onClick={handleNewInput} />
          </div>

          <div className="row">
            <Button value='4' onClick={handleNewInput} />
            <Button value='5' onClick={handleNewInput} />
            <Button value='6' onClick={handleNewInput} />
            <Button variant="function" value='*' onClick={handleNewInput} />
            <Button variant="function" value='/' onClick={handleNewInput} />
          </div>

          <div className="row">
            <Button value='1' onClick={handleNewInput} />
            <Button value='2' onClick={handleNewInput} />
            <Button value='3' onClick={handleNewInput} />
            <Button variant="function" value='+' onClick={handleNewInput} />
            <Button variant="function" value='-' onClick={handleNewInput} />
          </div>

          <div className="row">
            <Button value='.' onClick={handleNewInput} />
            <Button value='0' onClick={handleNewInput} />
            <Button variant="function" value='+/-' onClick={handleNewInput} />
            <Button variant="function" value='(' onClick={handleNewInput} />
            <Button variant="function" value=')' onClick={handleNewInput} />
          </div>
        </div>
      </div>
    </div >
  );
}

export default App;
