import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Routers from './Routes/Routers';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/*" element={<Routers />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
