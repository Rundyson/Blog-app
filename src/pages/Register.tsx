import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import { setUser } from "../features/auth/authSlice";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const register = async () => {
        const {data, error} = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) return alert (error.message);
        dispatch(setUser(data.user));
        navigate("/");
    };

    return (
        <div className="register">
            <input
            className="r-email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}/>
            <input
            className="r-password"
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}/>
            <button onClick={register} className="btn-register"><p>Register</p></button>
        </div>
    )
};