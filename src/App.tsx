import {Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateBlog from "./pages/CreateBlog";
import Blog from "./pages/Blog";
import Navbar from "./components/Navbar";
import EditBlog from "./pages/EditBlog";

export default function App() {
    return(
        <>
            <Navbar/>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/create" element={<CreateBlog/>}/>
                <Route path="/blog/:id/edit" element={<EditBlog />} />

                <Route path="/blog/:id" element={<Blog/>}/>
            </Routes>
        </>
    );
}