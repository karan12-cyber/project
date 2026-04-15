import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import RagnarokFitnessHome from './pages/RagnarokFitnessHome.jsx'
import LoginPage from "./pages/loginpage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/userdashboard" element={<UserDashboard />} />
        <Route path="/" element={<RagnarokFitnessHome />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;