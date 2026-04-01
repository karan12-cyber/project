import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import RagnarokFitnessHome from './pages/RagnarokFitnessHome.jsx'
import LoginPage from "./pages/LoginPage.jsx";
// import UserDashBord from "./pages/UserDashBord.jsx";




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<RagnarokFitnessHome />} />
        {/* <Route path="/user" element={<UserDashBord />}/> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;