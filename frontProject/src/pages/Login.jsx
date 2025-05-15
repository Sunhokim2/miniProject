import React from 'react';
import '../css/Login.css'; // Adjust the path as necessary
import { Link } from 'react-router-dom';



const Login = () => {
    return (
        <div className="login-container">
            <div className="login-box">
                <h2>이집맛집 Login</h2>
                <form>
                    <div className="form-group">
                        <label htmlFor="E-Mail">E-Mail</label>
                        <input type="text" id="E-Mail" name="E-Mail" placeholder="Enter your E-Mail" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" placeholder="Enter your password" required />
                    </div>
                    <button type="submit" className="login-button">Login</button>
                    <Link to="/signup">회원가입</Link>
                </form>
            </div>
        </div>
    );
};

export default Login;