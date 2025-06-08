import { useState } from 'react';
import './App.css';
import Button from './components/button/Button';
import CalcScreen from './components/screen/CalcScreen';
import { Parser } from 'expr-eval';

// TODO NEXT: Improve the result screen to contain the numbers if they become too long
// TODO NEXT 1: Create a CI/CD pipeline to be able to share the app with my friends
// TODO: Break this code into utils/hooks

const C = `C`;
const BACKSPACE = `<--`; // Add an icon for consistency through all browsers
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

const operators = [PLUS, MINUS, TIMES, DIVIDE];

const parser = new Parser();

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

  // Write the new input in the input field
  function resolveNewInput(value: string, currentCaretPosition: number): string {
    const partBeforeCaret = inputScreen.slice(0, currentCaretPosition);
    const partAfterCaret = inputScreen.slice(currentCaretPosition);
    const newInputValue = partBeforeCaret + value + partAfterCaret;

    setInputScreen(newInputValue);
    setCaretPosition(currentCaretPosition + 1);

    return newInputValue;
  }

  function isLeftOfCaretEmpty(): boolean {
    return inputScreen[caretPosition - 1] === undefined;
  }

  function replaceCurrentOperator(inputValue: string) {
    const partBeforeCaret = inputScreen.slice(0, caretPosition - 1);
    const partAfterCaret = inputScreen.slice(caretPosition);
    const newInputValue = partBeforeCaret + inputValue + partAfterCaret;

    setInputScreen(newInputValue);
    // TODO: Improve caret behavior, currently without this logic the caret goes rightmost
    // Keep caret position, workaround for a weird behavior causing it to go rightmost:
    // Force change
    setCaretPosition(caretPosition - 1);
    // Then restore
    requestAnimationFrame(() => {
      setCaretPosition(caretPosition);
    });

    return newInputValue;
  }

  // Check if there is operator at the front and replace it if there is, otherwise write the new operator
  function resolveOperatorInput(inputValue: string, caretPosition: number) {
    if (operators.includes(inputScreen[caretPosition - 1])) {
      const newInputValue = replaceCurrentOperator(inputValue);
      calculateResult(newInputValue);
    }
    else {
      const newInputValue = resolveNewInput(inputValue, caretPosition);
      calculateResult(newInputValue);
    };
  }

  function handleNegate(input: string, caretPosition: number): string {

    if (inputScreen === "0") return input;

    const matches = [...input.matchAll(/-?\d+(\.\d+)?/g)];

    for (const match of matches) {
      const start = match.index!;
      const end = start + match[0].length;

      if (caretPosition >= start && caretPosition <= end) {
        const number = match[0];
        const isNegative = number.startsWith('-');

        const negated = isNegative
          ? number.slice(1)
          : '-' + number;

        const newInput = input.slice(0, start) + negated + input.slice(end);

        // Adjust caret based on insertion/removal of minus
        const caretShift = isNegative ? -1 : 1;
        const newCaretPos = caretPosition + caretShift;

        // Ensure caret doesn't go out of bounds
        setCaretPosition(Math.max(0, newCaretPos));
        setInputScreen(newInput);
        isNegateToggled = !isNegateToggled;
        return newInput;
      }
    }

    // No number under caret
    return input;
  }

  function hasBalancedBrackets(expression: string): boolean {
    let bracketCount = 0;
    // Maybe do this only on bracket input
    for (const char of expression) {
      if (char === "(") bracketCount++;
      else if (char === ")") bracketCount--;

      if (bracketCount < 0) return false;
    }

    return bracketCount === 0;
  }

  // TODO: Make result screen to automatically calculate input field's data, if an operator is present
  function calculateResult(expression: string): void {
    // Trigger on present operator
    const hasOperatorAndNumbers = /\d[+\-*/%]-?\d/.test(expression);

    if (!hasOperatorAndNumbers) return;

    if (!hasBalancedBrackets(expression)) {
      setResult("Unbalanced brackets");
      return;
    }

    // TODO: Edge cases: operator without number after it. Brackets, empty brackets, half brackets
    try {
      // Replace % with %* if needed
      const fixedExpr = expression.replace(/%(\d|\()/g, '%*$1');
      // Convert percentage values. Example: "50%" becomes "(50/100)", "3.5%" becomes "(3.5/100)"
      const expressionWithPercent = fixedExpr.replace(/(\d+(\.\d+)?)%/g, "($1/100)");

      // Upgrade to mathjs if more complex calculations are required (e.g. sin, cos, etc.)
      const result = parser.evaluate(expressionWithPercent);

      if (typeof result === "number" && isFinite(result)) {
        setResult(result.toString());
      }
      else {
        setResult("Invalid expression");
      }
    } catch (error) {
      console.log(error);
      setResult("Invalid expression");
    }
  }

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

          calculateResult(newInput);
        }
        return;
      // TODO: Fix caret being removed
      case MOVE_CARET_RIGHTMOST:
        setCaretPosition(inputScreen.length);
        return;

      case EQUAL:
        // TODO: Add to a list of history
        console.log("To be implemented");
        // setResult(suggestResult());
        return;

      case PERCENT:
        if (isLeftOfCaretEmpty()) return;
        resolveOperatorInput(inputValue, currentCaretPosition);
        return;

      case NEGATE:
        newInput = handleNegate(newInput, currentCaretPosition);

        calculateResult(newInput);
        return;

      case LEFT_BRACKET:
        if (isLeftOfCaretEmpty()) return;
        newInput = resolveNewInput(inputValue, currentCaretPosition);
        calculateResult(newInput);
        return;

      case RIGHT_BRACKET:
        if (isLeftOfCaretEmpty()) return;
        newInput = resolveNewInput(inputValue, currentCaretPosition);
        calculateResult(newInput);
        return;

      case PLUS:
        if (isLeftOfCaretEmpty()) return;
        resolveOperatorInput(inputValue, currentCaretPosition);
        return;

      case MINUS:
        if (isLeftOfCaretEmpty()) return;
        resolveOperatorInput(inputValue, currentCaretPosition);
        return;

      case TIMES:
        if (isLeftOfCaretEmpty()) return;
        resolveOperatorInput(inputValue, currentCaretPosition);
        return;

      case DIVIDE:
        if (isLeftOfCaretEmpty()) return;
        resolveOperatorInput(inputValue, currentCaretPosition);
        return;
    }

    if (inputScreen === `0` && caretPosition === 1 && inputValue !== "0") {
      setInputScreen(inputValue);
      setCaretPosition(currentCaretPosition + 1);
      return;
    }

    const newInputResult = resolveNewInput(inputValue, currentCaretPosition);
    calculateResult(newInputResult);
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
