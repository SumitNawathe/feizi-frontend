import logo from './logo.svg';
import './App.css';
import  { Routes, Route, BrowserRouter } from "react-router-dom";
import Navigation from './components/Navigation';
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProfileInfo from './pages/ProfileInfo';
import Segmentation from './pages/Segmentation';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div>
      <BrowserRouter>
      <Navigation />
        <Routes>
          <Route exact path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile-info" element={<ProfileInfo />} />
          <Route path="/segmentation/:filename" element={<Segmentation />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
