import logo from './logo.svg';
import './App.css';
import React from 'react';

// function takes in the current entire history and returns the proper numbers
// eg. arr = ['2','.','6','+','7','8'] ===> ['2.6','+','78']
function convertToProperFormat(arr) {
  // determine numbers
  let numsArr = [];
  let number = '';
  for(let i=0; i<arr.length; i++)
  {
    if(arr[i].length > 1) {
      continue;
    }
    if(Number.isInteger(arr[i]) || arr[i] == '.')
    {
      number += arr[i];
    }
    else {
      numsArr.push(number);
      number = '';
      numsArr.push(arr[i]);
    }
  }
  numsArr.push(number);
  return numsArr
}

class App extends React.Component {
  constructor(props)
  {
    super(props)
    this.state = {history : [], input : '', displayValue : '0'};
    this.inputHandler = this.inputHandler.bind(this);
  }
  inputHandler(str) {
    if(str == "clear")
    {
      this.setState({history: [], input : '', displayValue : '0'});
      return;
    }
    if(str == '0')
    {
      if(this.state.history[this.state.history.length - 1] == '0') { //if the current is 0 and the previous number is also 0 then return 
        return;
      }
    }
    if(Number.isInteger(str)) {
      if(this.state.history.length == 0) {
        this.setState((prevState) => {
          return {history : [...prevState.history.slice(1)], input : str, displayValue : prevState.displayValue.slice(1)}; // remove first 0 when something entered
         });
      } 
        this.setState((prevState) => {
        return {history : [...prevState.history, str], input : str, displayValue : prevState.displayValue.concat(str)}; // add input to history
        });
      
      return;
    }
    if(str == '+' || str == '-' || str == '*' || str == '/')
    {
      // if prev input was also an operator, make the current operator the only operator.
      if(this.state.history[this.state.history.length - 1] == '+' || this.state.history[this.state.history.length - 1] == '-' || this.state.history[this.state.history.length - 1] == '*' || this.state.history[this.state.history.length - 1] == '/') {
        // exception: if the current operator is -, then make the next number negative
        if(str == '-') {
          this.setState((prevState) => {
            return {history : [...prevState.history, str], input : str, displayValue : str}
          });
        }
        else {
          this.setState((prevState) => {
            return {history : [...prevState.history.slice(0, prevState.history.length - 1), str], input : str, displayValue : str}
          });
        }
      }
      else {
      this.setState((prevState) => {
        return {history : [...prevState.history, str] ,input : str, displayValue : str}; // add operand to history
       });
      }
      return;
    }
    if(str == '=')
    {
      this.setState((prevState) => {
        return {history : [...prevState.history, str] ,input : str, displayValue : str}; // add = to history
      });
      // determine numbers
      let numsArr = convertToProperFormat(this.state.history); // get array with proper format of numbers (e.g ['2','3','+','6'] => ['23','+','6'])

      // remove any empty elements in arr
      numsArr = numsArr.filter((item) => {
        return item != '';
      });
      let result = parseFloat(numsArr.shift()); //first number is the current result
      // at each iter, get operator and apply operator to the next num
      
      while(numsArr.length > 0)
      {
        // PROBLEM: CHECK WHY SECONDNUM IS NAN

        // keep on making operator = numsArr.shift() until numsArr[0] = digit 
        // exception: if nums[-1] = operator and nums[0] = - and nums[1] = digit, then keep the prev operator and make digit negative and break loop
        let operator = '';
        let secondNum = '';
        let negativeNum = false;
        while(numsArr[0] == '+' || numsArr[0] == '*' || numsArr[0] == '/' || numsArr[0] == '-') {
          if(numsArr[0] == '-' && (operator == '+' || operator == '*' || operator == '/' || operator == '-') && (parseFloat(numsArr[1])))  {
            numsArr.shift(); // remove - 
            secondNum = parseFloat(numsArr.shift()) * -1; // make next number -ve
            negativeNum = true;
            break;
          }
          operator = numsArr.shift();
        }
        
        if(negativeNum == false) {
          secondNum = parseFloat(numsArr.shift());
        }
        
        console.log('here', operator, secondNum);
        if(operator == '+')
        {
          result += secondNum;
          console.log('result += ', secondNum, ' => result: ',result);
        }
        if(operator == '-')
        {
          result -= secondNum;
          console.log('result -= ', secondNum, ' => result: ',result);
        }
        if(operator == '*')
        {
          result *= secondNum;
          console.log('result *= ', secondNum, ' => result: ',result);
        }
        if(operator == '/')
        {
          result /= secondNum;
          console.log('result /= ', secondNum, ' => result: ',result);

        }
        
      }
      console.log(result, typeof result);
      result = parseFloat(result.toFixed(4));
      this.setState((prevState) => {
        return {history : [result], input : str, displayValue : result.toString()};
      });
      return;
    }
    if(str == '.') {
      let numsArr = convertToProperFormat(this.state.history);
      // check if num alr doesnt contain a .
      if(!numsArr[numsArr.length - 1].includes('.')) {
        // if first input = 0 (just starting out), or prev input = operand, then add 0 before .
        // if(this.state.history == [] || this.state.history[this.state.history.length - 1] == '+' || this.state.history[this.state.history.length - 1] == '-' || this.state.history[this.state.history.length - 1] == '*' || this.state.history[this.state.history.length - 1] == '/') {
        //   this.setState((prevState) => {
        //     return {history : [...prevState.history, '0', str], input : str, displayValue : '0' + str}; // add . to history
        //   });
        // }
        // else {
          this.setState((prevState) => {
            return {history : [...prevState.history, str] ,input : str, displayValue : prevState.displayValue.concat(str)}; // add . to history
          });
      }
      return;
    }
  }
  render() {
    return (
      <div className="App">
        <History history={this.state.history}/>
        <Display output={this.state.displayValue} />
        <InputButtons inputHandler={this.inputHandler}/>
      </div>
    );
  }
}

class History extends React.Component {
  constructor(props)
  {
    super(props)
  }
  render()
  {
    return (
      <div id="history">
        {this.props.history}
      </div>
    );
  }
}

class Display extends React.Component {
  constructor(props)
  {
    super(props)
  }
  render()
  {
    return (
      <div id="display">
        {this.props.output}
      </div>
    );
  }
}

class InputButtons extends React.Component {
  constructor(props)
  {
    super(props)
    this.handleAC = this.handleAC.bind(this)
    this.handleDigit = this.handleDigit.bind(this)
    this.handleOperator = this.handleOperator.bind(this)
  }
  handleOperator(event)
  {
    this.props.inputHandler(event.target.value);
  }
  handleDigit(event)
  {
    this.props.inputHandler(parseInt(event.target.value));
  }
  handleAC()
  {
    this.props.inputHandler("clear");
  }
  render()
  {
    return (
      <div id="input-buttons">
        <button onClick={this.handleDigit} value={0} id="zero">0</button>

        <button onClick={this.handleOperator} value={'.'} id="decimal">.</button>
        <button onClick={this.handleAC} id="clear">AC</button>
        <button onClick={this.handleOperator} value={'/'} id="divide">/</button>
        <button onClick={this.handleDigit} value={7} id="seven">7</button>
        <button onClick={this.handleDigit} value={8} id="eight">8</button>
        <button onClick={this.handleDigit} value={9} id="nine">9</button>
        <button onClick={this.handleOperator} value={'*'} id="multiply">x</button>
        <button onClick={this.handleDigit} value={4} id="four">4</button>
        <button onClick={this.handleDigit} value={5} id="five">5</button>
        <button onClick={this.handleDigit} value={6} id="six">6</button>
       
        <button onClick={this.handleOperator} value={'-'} id="subtract">-</button>
        <button onClick={this.handleDigit} value={1} id="one">1</button>
        <button onClick={this.handleDigit} value={2} id="two">2</button>
        <button onClick={this.handleDigit} value={3} id="three">3</button>
        <button onClick={this.handleOperator} value={'+'} id="add">+</button>

        
        <button onClick={this.handleOperator} value={'='} id="equals">=</button>
        
      </div>
    );
  }
}



export default App;
