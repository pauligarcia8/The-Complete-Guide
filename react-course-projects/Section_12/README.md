# Section 12: Practice Project
Built a quiz app with help of the concepts learned through out this course. 

### How do we handle the questions and answers
Theres is questions.js file with an array of objects that contain the questions and the possible answer, in this array alway the first answer is the correct but in the future that will be shuffle. 
So we have this array with objects, to show the questions on the app what we do is the following:
1. import the array of objects from questions into Quiz.jsx
2. useState to handle a new array with the selected answers, starting with empty array. \
   `const [userAnswers, setUserAnswers] = useState([]);`
3. userAnswer.length help us indentifying the currently question, starting in 0. \
    `const activeQuestionIndex = userAnswers.length;`
4. map through questions.answers with the index of length.
~~~
 <ul id="answers">
    {QUESTIONS[activeQuestionIndex].answers.map((answer => (
        <li key={answer} className="answer">
            <button onClick={() => handleSelectAnswer(answer)}>{answer}</button>
        </li>
    )))}
</ul>
~~~
5. handle the selected answer and adding to the selectedAnswer array generating an increment to the length of the array pointing to the next position of the questions. 
~~~
const handleSelectAnswer = (selectedAnswer) => {
    setUserAnswers((prevUserAnswers) => {
        return [...prevUserAnswers, selectedAnswer];
    })
}
~~~
### Handling error when we don't have more questions
At this point if we keep and keep selecting we encounter an error because we exceed the number of question we have, so we do the following:
1. const quizIsComplete = activeQuestionIndex === QUESTIONS.length;
2. is quisIsComplete is true then render a message

### How to shuffle the answers
The idea is not to show that the first answer is always the correct one, so in order to handle this we do the following
1. Make a copy of the answer's array \
    `const shuffledAnswers = [...QUESTIONS[activeQuestionIndex].answers];`
2. use the sort() javascript method, wich edit the new array created in the previously step \
    `shuffledAnswers.sort(() => Math.random() - 0.5);`
3. use the shuffledAnswer and map them into a list

### Building a timer component 
The user has a time to select an answer, so to handle this we create a new component called QuestionTimer.jsx. 
This component accepts 2 props, one is a time in miliseconds and the other is a function. 
With help of useState we handle the setTimeout and the setInterval and also we need to use useEffect because we are updating the state so this could cause an infinite render loop and another important thing is to clean up the useEffect because otherwise we will have two interval running because we are not reseting the interval, the same happens for the timeout.

**QuestionTimer.jsx**
~~~
import { useEffect, useState } from "react";

const QuestionTimer = ({timeOut, onTimeout}) => {
    const [remaingingTime, setRemainingTime] = useState(timeOut);

    useEffect(() => {
        const timer = setTimeout(onTimeout, timeOut);

        return () => { // clean up function
            clearTimeout(timer);
        }
    }, [timeOut, onTimeout])

    useEffect(() => {
        const interval = setInterval(() => {
            setRemainingTime(prevRemainingTime => prevRemainingTime - 100);
        }, 100);

        return () => { // clean up function
            clearInterval(interval);
        }
    }, [])

    return (
        <progress id="question-time" max={timeOut} value={remaingingTime}/>
    )
}

export default QuestionTimer;
~~~
**Quiz.jsx**
~~~
<QuestionTimer
    timeout={10000}
    onTimeout={() => {handleSkipAnswer(null)}}
/>
~~~

To restart the timer we use the key prop on it, because if the key prop changes react destroy the previousely or unmount and unmount a new one. The key prop has value of the length of our answer array so as the length changes the timer will be reset. 
~~~
<QuestionTimer
    key={activeQuestionIndex}
    timeout={10000}
    onTimeout={handleSkipAnswer}
/>
~~~

**Using useCallback** \
On the setTimeout we have as a dependecy on the useEffect a function, so this function whenever the function component gets render is regenerated so the useEffect is reevaluated. So to work around this we do the following on the Quiz.jsx file: \

**Quiz.jsx**
~~~
const handleSkipAnswer = useCallback(() => handleSelectAnswer(null), [handleSelectAnswer]);

<QuestionTimer
    key={activeQuestionIndex}
    timeout={10000}
    onTimeout={handleSkipAnswer}
/>
~~~

### Highlighting selected answers 
 First of all we use useState `const [answerState, setAnswerState] = useState('');` to handle the aswers as answered, correct and wrong. 
 So in the function that handles the answer selection we set the state of the answer as 'answered', then with the help of setTimeout to wait a little we check rather the answer is correct (if match with the first answer on the answers array) or wrong and update the state accordingly.
 Also we are using useCallback and activeQuestionIndex so it gets reevaluted if that dependecy changes.

**Quiz.jsx**
 ~~~
  const activeQuestionIndex = answerState === '' ? userAnswers.length : userAnswers.length -1;

 const handleSelectAnswer = useCallback(function handleSelectAnswer(selectedAnswer) {
    setAnswerState('answered');
    setUserAnswers((prevUserAnswers) => {
      return [...prevUserAnswers, selectedAnswer];
    });

    setTimeout(() => {
      if (selectedAnswer === QUESTIONS[activeQuestionIndex].answers[0]) {
        setAnswerState('correct');
      } else {
        setAnswerState('wrong');
      }

      setTimeout(() => {
        setAnswerState(''); // reset the answer state
      }, 2000)
    }, 1000);

  }, [activeQuestionIndex]);
~~~
This way we handle the styles
~~~
<ul id="answers">
    {shuffledAnswers.map((answer) => {
    const isSelected = userAnswers[userAnswers.length -1] === answer;
    let cssClasses = '';

    if (answerState === 'answered' && isSelected) {
        cssClasses = 'selected'
    } 

    if ((answerState === 'correct' || answerState === 'wrong') && isSelected ) {
        cssClasses = answerState
    }

    return (
        <li key={answer} className="answer">
        <button 
            onClick={() => handleSelectAnswer(answer)} 
            className={cssClasses}
            disabled={answerState !== ''} // to disable
        >
            {answer}
        </button>
        </li>
    )
    })}
</ul>
~~~

At this point we have our quiz almost done except that the higlighting doesn't work very good. We have useEffect and useCallback with dependecies that trigger the re render of the function component so the shuffle sorting its retrigger leading to app missbehaviour. 
Its a perfect scenario to use useRef() hook, because we want to shuffle the answers once. `const shuffledAnswers = useRef();`
Then to know if the answer have been already shuffled we checked if shuffledAnswers.currentv is undefined because the first time that shuffle is undefined, then when the answer state changes the shuffledAnswer have already been shuffled so it doesn't need to shuffle again. We do the following: 
~~~
if (!shuffledAnswers.current) { 
    shuffledAnswers.current = [...QUESTIONS[activeQuestionIndex].answers];
    shuffledAnswers.current.sort(() => Math.random() - 0.5);
}
~~~

To use only one key to trigger the re render of a component we separate the answer list and the shuffle logic to a new component called Answers, then we create a Question component that renders the QuestionTimer and the Answers components and from the Quiz.jsx component we send the information needed as props and use here the key prop. 
