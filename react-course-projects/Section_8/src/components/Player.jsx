import { useRef, useState } from "react";

export default function Player() {
  const [enteredPlayerName, setEnteredPlayerName] = useState('');
  const playerName = useRef();

  const handleClick = () => {
    setEnteredPlayerName(playerName.current.value);
    playerName.current.value('');
  }

  return (
    <section id="player">
      <h2>Welcome {enteredPlayerName ?? 'unknow entity'}</h2>
      <p>
        <input ref={playerName} type="text" />
        <button onClick={handleClick}>Set Name</button>
      </p>
    </section>
  );
}
