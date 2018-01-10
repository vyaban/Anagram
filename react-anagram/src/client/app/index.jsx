import React from 'react';
import {render} from 'react-dom';

class Letter extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            filled: this.props.filled ? "filled" : "notFilled",
            letter: this.props.letter
        }
    }
    
    componentWillReceiveProps(nextProps) {
      this.setState({
            filled: nextProps.filled ? "filled" : "notFilled",
            letter: nextProps.letter
        });  
    }
    
    render() {
        return <span className={this.state.filled}>{this.state.letter}</span>
    }
}

//processes what needs to be filled in or not
class AnagramProgress extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            anagramCharCounts: this.props.anagramCharCounts,
            origCharArr: this.props.origCharArr
        };
        
        this.toSpanReducer = this.toSpanReducer.bind(this);
        this.processChars = this.processChars.bind(this);
    }
    
    componentWillReceiveProps(nextProps) {
      this.setState(nextProps);  
    }
    
    toSpanReducer(context, letter) {
        let charCounts = context.charCounts;
        
        if (charCounts[letter.toUpperCase()] == null || charCounts[letter.toUpperCase()] == 0) {
            return {
                spans: context.spans.concat(<Letter filled={false} letter={letter} />),
                charCounts: charCounts
            }
        } else {
            charCounts[letter.toUpperCase()] = charCounts[letter.toUpperCase()] - 1;
                
            return {
                spans: context.spans.concat(<Letter filled={true} letter={letter} />),
                charCounts: charCounts
            }
        }
    }
    
    processChars() {
        let context = {
            spans: [], 
            charCounts: this.state.anagramCharCounts
        }
        
        //convert char array into span array
        return this.state.origCharArr.reduce(this.toSpanReducer, context).spans;
    }
    
    render() {
        let output = this.processChars();
        
        return <div>
            {output}
        </div>
    }
}

class Anagram extends React.Component {

    constructor(props) {
        super(props);
        
        this.inputTextChange = this.inputTextChange.bind(this);
        this.calculateCharacterBank = this.calculateCharacterBank.bind(this);
        
        this.state = {
            origWord: {
                word: props.word,
                letters: {}
            },
            anagramWord: {
                word: props.anagram,
                letters: this.calculateCharacterBank(props.anagram.toUpperCase())
            }
        };        
    }
    
    calculateCharacterBank(word) {
        let updatedBank = {};
        for(let i = 0; i < word.length; i++) {
           if (updatedBank[word.charAt(i)] == null) {
               updatedBank[word.charAt(i)] = 1;
           } else {
               updatedBank[word.charAt(i)] = updatedBank[word.charAt(i)] + 1;
           }
        }
        return updatedBank;
    }
    
    inputTextChange(event) {
        let change = {};
        const words = event.target.value;
        const letters = this.calculateCharacterBank(words.replace(/\W/g, '').toUpperCase());
        
        change[event.target.name] = {
            word: words,
            letters: letters
        };
        this.setState(change);
        
    }
    
   render () {
     let clonedAnagramCharCount = JSON.parse(JSON.stringify(this.state.anagramWord.letters));
     let originalWord = this.state.origWord.word || "Type an Anagram"
     
     return <div>
             <input name="origWord" className="topInput" type="text" value={this.state.origWord.word} onChange={this.inputTextChange} />
             <AnagramProgress anagramCharCounts={clonedAnagramCharCount} origCharArr={originalWord.split('')} />
             <input name="anagramWord" className="bottomInput" type="text" value={this.state.anagramWord.word} onChange={this.inputTextChange} />
         </div>;
   }
}

class AppHeader extends React.Component {
  render () {
    return <div id="header">
             <h1>Anagram Decipherer</h1>
             <h2>Inspired by Daniel Eden (@_dte)</h2>
             <a href="https://codepen.io/daneden/pen/GrodWv">https://codepen.io/daneden/pen/GrodWv</a>
             <br />
      </div>
  } 
}

class App extends React.Component {
    render () {
        return <div>
          <AppHeader />
          <Anagram word="Type an anagram" anagram="Type Anagram Here"/>
        </div>
    }
}

render(<App />, document.getElementById('app'));
