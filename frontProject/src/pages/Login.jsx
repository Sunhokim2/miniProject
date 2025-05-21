import React, { useState } from 'react';
import '../css/Login.css'; // Adjust the path as necessary
// import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import GoogleLoginButton from '../components/GoogleLogin';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import { getKakaoLoginUrl, getGoogleLoginUrl } from '../utils/oauth'; // Adjust the import path as necessary
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    // const [showError, setShowError] = useState(false);
    // const { login, isLoading, error } = useAuth();
    const navigate = useNavigate();
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




    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        
        console.log('username:', username);
        console.log('email:', email);
        const payload = { username, password }; // formData와 verificationCode를 포함한 payload 생성
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // body: JSON.stringify(formData),
                body: JSON.stringify(payload),
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
        <div className="w-full max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">이집 맛집</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <TextField
                        fullWidth
                        label="이메일"
                        type="email"
                        value={email}
                        onChange={(e) => {setEmail(e.target.value); setUsername(e.target.value)}}
                        required
                        InputProps={{
                            startAdornment: <EmailIcon className="mr-2 text-gray-500" />,
                        }}
                    />
                </div>
                <div>
                    <TextField
                        fullWidth
                        label="비밀번호"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        InputProps={{
                            startAdornment: <LockIcon className="mr-2 text-gray-500" />,
                        }}
                    />
                </div>
                <div>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        size="large"
                        // disabled={isLoading}
                        className="py-3"
                    >
                        로그인
                        {/* {isLoading ? <CircularProgress size={24} color="inherit" /> : '로그인'} */}
                    </Button>
                </div>

            </form>
        </div>

    );
};

export default Login;