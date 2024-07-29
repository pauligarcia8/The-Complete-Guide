import { useRef, useState } from "react";
import ResultModal from "./ResultModal";

export default function TimerChallenge({ title, targetTime }) {
  const timer = useRef();
  const dialog = useRef();
  const [timeRemaing, setTimeRemaining] = useState(targetTime * 1000);
  const timerIsActive = timeRemaing > 0 && timeRemaing < targetTime * 1000;

  if (timeRemaing <= 0) {
    clearInterval(timer.current);
    dialog.current.open();
  }

  const handleReset = () => {
    setTimeRemaining(targetTime * 1000);
  }

  const handleStart = () => {
    timer.current = setInterval(() => {
      setTimeRemaining(prevTimeRemaining => prevTimeRemaining - 10);
    }, 10);

  }

  const handleStop = () => {
    dialog.current.open();
    clearInterval(timer.current);
  }

  return (
    <>
      <ResultModal ref={dialog} targetTime={targetTime} remainingTime={timeRemaing} onReset={handleReset} />
      <section className='challenge'>
        <h2>{title}</h2>
        {/* {timerExpired && <p>You lost!</p>} */}
        <p className='challenge-time'>
          {targetTime} second{targetTime > 1 ? 's' : ''}
        </p>
        <p>
          <button onClick={timerIsActive ? handleStop : handleStart}>
              {timerIsActive ? 'Stop' : 'Start'} challenge
          </button>
        </p>
        <p className={timerIsActive ? 'active' : undefined}>
          {timerIsActive ? 'Time is running...' : 'Timer innactive'}
        </p>
      </section>
    </>
  );
}