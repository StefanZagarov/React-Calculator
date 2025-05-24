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
const NEGATE = `+/-`; // Turn the current inputting number negative, or if its negative, turn it positive e.g. 5 + 1 will turn the 1 into -1
const LEFT_BRACKET = `(`;
const RIGHT_BRACKET = `)`;
const MOVE_CARET_RIGHT = `>>`;

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
        newInput = input.slice(0, currentCaretPosition - 1) + input.slice(currentCaretPosition);

        if (newInput === "") { // More robust than newInput.length === 0 if "" is possible
          setInput('0');
          // setCaretPosition(1);
        } else {
          setInput(newInput);
          setCaretPosition(Math.max(0, currentCaretPosition - 1));
        }
        return;

      case MOVE_CARET_RIGHT:
        setCaretPosition(input.length);
        return;
    }


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
