//Imports
import { useState } from 'react';
import './App.css';

//React components
import Infinitives from './components/Infinitives';
import Tenses from './components/Tenses';
import Persons from './components/Persons';
import RowSelection from './components/RowSelection';

//Data file containing all verbs' info
import data from './data.json'

function App() {
  //We deconstruct all information needed from the json file
  const { infinitives, tenses, persons } = data;

  //----STATE------STATE----------STATE--------STATE--------STATE--------STATE-------STATE--------//
  //These are here to store the user answer
  const [userAnswer, setUserAnswer] = useState('');
  const [input, setInput] = useState('');

  // Having the gameOn mode will avoid unwanted behaviours when clicking on the Play and Check buttons
  const [gameIsOn, setGameIsOn] = useState(false);
  const [gameOver, setGameOver] = useState(true);

  //These are the final infinitive, tense and person that the user needs to guess
  const [infinitiveToAnswer, setInfinitiveToAnswer] = useState('');
  const [tenseToAnswer, setTenseToAnswer] = useState('');
  const [personToAnswer, setPersonToAnswer] = useState();

  //This is the definitive verb that the userNeeds to guess
  const [finalWord, setFinalWord] = useState('');

  //This state changes the style of the text when you give the right/wrong answer
  const [rightAnswer, setRightAnswer] = useState(false);
  const [wrongAnswer, setWrongAnswer] = useState(false);

  const [userTries, setUserTries] = useState(3);

  //-------FUNCTIONS----FUNCTIONS-------FUNCTIONS--------FUNCTIONS-------FUNCTIONS-------FUNCTIONS-----FUNCTIONS------

  //Function that selects the random verb that the user needs to guess
  const handlePlay = () => {
    //delete previous user input
    setInput('');
    setRightAnswer(false);
    setWrongAnswer(false);

    //Set Game to mode ON
    setGameIsOn(true);
    setGameOver(false);

    //Restore user tries to 3
    setUserTries(3);

    //choose infinitive
    let randomInfinitiveIndex = Math.floor(Math.random() * infinitives.length);
    let varInfinitiveToAnswer = infinitives[randomInfinitiveIndex];

    //choose tense
    let randomTenseIndex = Math.floor(Math.random() * tenses.length);
    let varTenseToAnswer = tenses[randomTenseIndex];

    //choose person
    let randomPersonIndex = Math.floor(Math.random() * persons.length)
    let varPersonToAnswer = persons[randomPersonIndex];

    let begin = varTenseToAnswer[1][randomPersonIndex];

    if (varInfinitiveToAnswer.slice(-2) === 'er') {
      randomPersonIndex += 6;
    } else if (varInfinitiveToAnswer.slice(-2) === 'ir') {
      randomPersonIndex += 12;
    }
    let ending = varTenseToAnswer[2][randomPersonIndex]

    setFinalWord(begin + varInfinitiveToAnswer.slice(0, -2) + ending);
    let varFinalWord = begin + varInfinitiveToAnswer.slice(0, -2) + ending;

    //turn variables into state
    setInfinitiveToAnswer(varInfinitiveToAnswer);
    setTenseToAnswer(varTenseToAnswer);
    setPersonToAnswer(varPersonToAnswer);
    setFinalWord(varFinalWord);

  }

  //Function that checks whether the user was right in his guess
  const handleCheck = () => {
    if (gameIsOn) {
      if (userTries > 0) {
        if (input !== "") {
          //tidy user input (delete accents, diacritics, etc)
          let newInput = input.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
          let newFinalWord = finalWord.normalize("NFD").replace(/[\u0300-\u036f]/g, "")

          setUserAnswer(newInput);
          //setInput('');
          if (newInput === newFinalWord) {
            setRightAnswer(true);
            setInput(finalWord);
            setGameIsOn(false);
            setGameOver(true);
          } else if (newInput !== newFinalWord && userTries === 1) {
            setUserTries(0)
            setWrongAnswer(true);
            setInput(`Answer was "${finalWord}"`)
            setGameOver(true);
          } else {
            setWrongAnswer(true);
            setInput(input);
            setUserTries(prevTries => prevTries - 1)
          }
        } else { setInput("Type your answer!") };
      }
    }
  }




  return (
    <div className="App">
      <div className="framework">

        <h1 className="title">Spanish verbs trainer</h1>
        <p>{`Remaining tries: ${userTries}`}</p>

        <div className="row1">
          <Infinitives infinitives={Infinitives} />
          <Tenses tenses={Tenses} />
          <Persons persons={Persons} />
        </div>

        <div className="row2">
          <RowSelection
            randomInfinitive={infinitiveToAnswer}
            randomTense={tenseToAnswer}
            randomPerson={personToAnswer}
          />
          <input
            className="user-text"
            id={(rightAnswer ? "correct-answer" : "") + (wrongAnswer ? "incorrect-answer" : "")}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={gameOver}
          />
          <div className='button-group'>
            <button role="button" onClick={handlePlay}>Play</button>
            <button onClick={handleCheck}>Check</button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;