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
        console.log("Reduction Step");
        console.log(context);
        console.log(letter);
        let charCounts = context.charCounts;
        
        if (charCounts[letter.toUpperCase()] == null || charCounts[letter.toUpperCase()] == 0) {
            return {
                spans: context.spans.concat(<Letter filled={false} letter={letter} />),
                charCounts: charCounts
            }
        } else {
            console.log(charCounts[letter.toUpperCase()]);
            charCounts[letter.toUpperCase()] = charCounts[letter.toUpperCase()] - 1;
            console.log(charCounts[letter.toUpperCase()]);
                
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
        this.state = {
            origWord: {
                word: props.word,
                letters: {}
            },
            anagramWord: {
                word: "",
                letters: {}
            }
        };
        
        this.inputTextChange = this.inputTextChange.bind(this);
        this.calculateCharacterBank = this.calculateCharacterBank.bind(this);
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
     return <div>
             <input name="origWord" type="text" value={this.state.origWord.word} onChange={this.inputTextChange} />
             <AnagramProgress anagramCharCounts={this.state.anagramWord.letters} origCharArr={this.state.origWord.word.split('')} />
             <input name="anagramWord" type="text" value={this.state.anagramWord.word} onChange={this.inputTextChange} />
         </div>;
   }
}

class App extends React.Component {
    render () {
        return <Anagram word="Type an anagram" />
    }
}

render(<App />, document.getElementById('app'));
