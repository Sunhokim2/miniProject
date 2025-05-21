import React, { useState } from 'react';
import '../css/Login.css'; // Adjust the path as necessary
import { Link, useNavigate } from 'react-router-dom';
import GoogleLoginButton from '../components/GoogleLogin';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
const Login = () => {

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const handleKakaoLogin = () => {
        window.location.href = getKakaoLoginUrl();
    };

    const handleGoogleLogin = () => {
        window.location.href = getGoogleLoginUrl();
    };


    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                alert('Login successful!');
                // 로그인 성공 후 원하는 페이지로 이동
                navigate('/loginlanding');
            } else {
                alert('Login failed. Please check your credentials.');
                console.log('Login failed:' + JSON.stringify(response));
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('An error occurred while logging in.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>이집맛집 Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">E-mail</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Enter your username"
                            required
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit" className="login-button">Login</button>
                    <Link to="/signup">
                        회원가입
                    </Link>
                    <br />
                    {/* <GoogleLoginButton></GoogleLoginButton> */}
                    <Link to="http://localhost:8080/oauth2/authorization/google">
                        구글로그인
                    </Link>
                </form>
            </div>
        </div>
    );
};

export default Login;