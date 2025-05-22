import { useState } from 'react';
import './App.css';
import Button from './components/button/Button';
import CalcScreen from './components/screen/CalcScreen';

function App() {
  const [input, setInput] = useState(`0`);
  const [result, setResult] = useState(`0`);

  function handleClick(value: string) {
    switch (value) {
      case `C`:
        setInput(`0`);
        setResult(`0`);
        return;
      case `<--`:
        setInput(prevInput => {
          const newInput = prevInput.slice(0, -1);

          if (newInput.length === 0) return `0`;
          return newInput;
        });
        if (input.length === 0) setInput(`0`);
        return;
    }

    setInput(input => input + value);
  }

  return (
    <div className="container">
      <div className="calculator">

        <div className="screen">
          <CalcScreen input={input} result={result} />
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
            <Button variant="function" value='/' onClick={handleClick} />
            <Button variant="function" value='*' onClick={handleClick} />
          </div>

          <div className="row">
            <Button value='4' onClick={handleClick} />
            <Button value='5' onClick={handleClick} />
            <Button value='6' onClick={handleClick} />
            <Button variant="function" value='(' onClick={handleClick} />
            <Button variant="function" value='+' onClick={handleClick} />
          </div>

          <div className="row">
            <Button value='1' onClick={handleClick} />
            <Button value='2' onClick={handleClick} />
            <Button value='3' onClick={handleClick} />
            <Button variant="function" value='C' onClick={handleClick} />
            <Button variant="function" value='%' onClick={handleClick} />
          </div>

          <div className="row">
            <Button value='.' onClick={handleClick} />
            <Button value='0' onClick={handleClick} />
            <Button variant="function" value='+/-' onClick={handleClick} />
            <Button variant="function" value=')' onClick={handleClick} />
            <Button variant="function" value='-' onClick={handleClick} />
          </div>
        </div>
      </div>
    </div >
  );
}

export default App;
