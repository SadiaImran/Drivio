import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import DrivioDashboard from "./pages/Admin";
import UserDashboard from "./pages/UserDashboard";

function App() {
  return (
    // <DrivioDashboard/>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path ='/admin' element = {<DrivioDashboard/>} ></Route>
        <Route path ='/dashboard' element = {<UserDashboard/>} ></Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
