import "./App.css";
import Register from "./components/Register";
import Header from "./components/Header";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Category from "./components/Category";
import Videos from "./components/Videos";
import Tutor from "./components/Tutor";
import Repair from "./components/Repair";
import TutorProfile from "./components/TutorProfile";
import BookSession from "./components/BookSession";
import MArtAi from "./components/MartAi";
import Pcbulder from "./components/Pcbulder";
import Cart from "./components/Cart"
import BecomeSeller from "./components/BecomeSeller";
import Aboutus from "./components/About";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="Category" element={<Category/>}/>
        <Route path="/tutor" element={<Tutor/>}/>
        <Route path="/videos" element={<Videos/>}/>
        <Route path="/repair" element={<Repair/>}/>
        <Route path="/tutorprofile" element={<TutorProfile/>}/>
        <Route path="/booksession" element={<BookSession/>}/>
        <Route path="/Martai" element={<MArtAi/>}/>
        <Route path="/pcbuilder" element={<Pcbulder/>}/>
        <Route path="/Cart" element={<Cart/>}/>
        <Route path="/becomeseller" element={<BecomeSeller/>}/>
        <Route path="/aboutus" element={<Aboutus/>}/>
      </Routes>
    </>
  );
}

export default App;