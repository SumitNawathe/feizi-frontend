import logo from './logo.svg';
import './App.css';
import  { Routes, Route, BrowserRouter } from "react-router-dom";
import Navigation from './components/Navigation';
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div>
      <Navigation />
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
