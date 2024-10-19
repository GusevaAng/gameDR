import { Route, Routes } from 'react-router';
import './App.css';
import Start from './components/Start/Start';
import Game from './components/Game/Game';
import Sutton from './components/Sutton/Sutton';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route 
          path='/'
          element={ <Start /> }
        />
        <Route 
          path='/basement'
          element={ <Game /> }
        />
        <Route 
          path='/Sutton'
          element={ <Sutton /> }
        />
      </Routes>
    </div>
  );
}

export default App;
