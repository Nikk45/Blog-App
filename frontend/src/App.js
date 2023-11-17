import { BrowserRouter, Route, Routes } from "react-router-dom";
import './index.css';
import Register from "./pages/Register";
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from "./pages/Home";
import Header from "./components/Common/Header";
import Login from "./pages/Login";
import CreateBlog from "./pages/CreateBlog";
import MyBlogs from "./pages/MyBlogs";
import HomePage from "./pages/HomePage";
import Users from "./pages/Users";


function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/register" element={<Register />}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/create-blog" element={<CreateBlog/>}/>
        <Route path="/my-blogs" element={<MyBlogs/>}/>
        <Route path="/homepage" element={<HomePage/>}/>
        <Route path="/users" element={<Users/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
