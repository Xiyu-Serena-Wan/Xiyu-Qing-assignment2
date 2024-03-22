import React from 'react';
import '../App.css';

function Homepage() {

  return (
    <div>
      <h1>Game Of Life</h1>
      <div className="description">
        <h4> Read the explaination of the game: </h4>
        <ul>
          <li>A living cell with less than two living neighbours dies.</li>
          <li>A living cell with two or three live neighbours lives.</li>
          <li>A living cell with more than three live neighbours dies.</li>
          <li>
            A dead cell with exactly three live neighbours becomes a live cell,
            as if by reproduction.
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Homepage;
