import { useState } from "react";
import axios from "axios"; 
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css";
import LoadingIndicator from "./LoadingIndicator";

function Form({ route, method }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const name = method === "post" ? "Login" : "Register"; 

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        try {
            let res;
            if (method === "post") {
                // 登入 API 請求
                res = await axios.post("http://localhost:8000/auth/token", {
                    username,
                    password,
                });
                // 儲存 access token 並導向主頁
                localStorage.setItem(ACCESS_TOKEN, res.data.access_token);
                navigate("/");
            } else if (method === "register") {
                // 註冊 API 請求
                res = await axios.post("http://localhost:8000/auth/", {
                    username,
                    password,
                    first_name: firstName, // 添加 first_name
                    last_name: lastName,   // 添加 last_name
                    email,    
                });
                // 註冊成功後導向登入頁面
                navigate("/login");
            }
        } catch (error) {
            alert(error.response ? error.response.data.detail : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h1>{name}</h1>
            <input
                className="form-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
            />
            <input
                className="form-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
            />
            {method === "register" && (
                <>
                    <input
                        className="form-input"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First Name"
                        required
                    />
                    <input
                        className="form-input"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last Name"
                        required
                    />
                    <input
                        className="form-input"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                    />
                </>
            )}
            {loading && <LoadingIndicator />}
            <button className="form-button" type="submit">
                {name}
            </button>
        </form>
    );
}

export default Form;