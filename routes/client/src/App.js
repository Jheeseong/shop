import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

import LandingPage from "./components/views/landingPage/LandingPage";
import LoginPage from "./components/views/loginPage/LoginPage";
import Navbar from "./components/views/navbar/Navbar";
import RegisterPage from "./components/views/registerPage/RegisterPage";

function App() {
  return (
      <Router>
        <div>


          <hr />

          <Routes>
            <Route exact path="/" element = {<LandingPage />} />
            <Route path="/login" element={<LoginPage />}  />
            <Route path="/register" element={<RegisterPage />}  />
          </Routes>
        </div>
      </Router>
  );
}

export default App;
