import './App.css';
import Game from './Game';
import NavBar from './Pages/NavBar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './Pages/Homepage';
import TeamAndLink from './Pages/TeamAndLink';

function App() {

  return (
    <Router>
    <div className="App">
      <NavBar/>
      <Routes>
          <Route path="/" element={<Game />} />
          <Route path="/Homepage/*" element={<Homepage />} />
          <Route path="/TeamAndLink/*" element={<TeamAndLink />} />
        </Routes>
    </div>
    </Router>
  );
}

export default App;
