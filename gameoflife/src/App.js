import './App.css';
import Game from './Game';
import NavBar from './Pages/NavBar';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Homepage from './Pages/Homepage';
// import TeamAndLink from './Pages/TeamAndLink';

function App() {

  return (
    <div className="App">
      <NavBar/>
      <Game/>
    </div>
  );
}

export default App;
