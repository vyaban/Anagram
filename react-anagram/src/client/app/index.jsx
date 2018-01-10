import React from 'react';
import {render} from 'react-dom';

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
        console.log(updatedBank);
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
             <p>{this.state.origWord.word}</p>
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
