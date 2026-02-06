import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../features/auth/authSlice";
import { supabase } from "../services/supabase";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const login = async () => {
        const {data, error} = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) return alert (error.message);
        dispatch(setUser(data.user));
        navigate("/"); 

    };

    return (
        <div className="login ">
            <input className="l-email"
            placeholder="Email"
            onChange={(e)=> setEmail(e.target.value)}  />
            <input className="l-password"
            placeholder="Password"
            onChange={(e)=> setPassword(e.target.value)}  />
            <button onClick={login} className="btn-login group"><p>Login</p></button>
        </div>
    )
}