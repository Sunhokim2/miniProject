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

interface FormData {
    username: string;
    password: string;
}

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    // const [showError, setShowError] = useState(false);
    // const { login, isLoading, error } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState<FormData>({
        username: '',
        password: '',
    });

    const handleKakaoLogin = (): void => {
        window.location.href = "http://localhost:8080/oauth2/authorization/kakao";
    };

    const handleGoogleLogin = (): void => {
        window.location.href = "http://localhost:8080/oauth2/authorization/google";
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        console.log('username:', username);
        console.log('email:', email);
        const payload = { username, password };
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const data = await response.json();
                alert('Login successful!');
                navigate('/login-landing');
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
                        onChange={(e) => { setEmail(e.target.value); setUsername(e.target.value) }}
                        required
                        InputProps={{
                            startAdornment: <EmailIcon className="mr-2 text-gray-500" />,
                        }}
                    />
                </div>
                <div style={{ height: '24px' }}></div>
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
                <div style={{ height: '24px' }}></div>
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
            <div className="mt-8">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div style={{ height: '24px' }}></div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                            또는
                        </span>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3">
                    <button
                        type="button"
                        onClick={handleKakaoLogin}
                        className="w-full flex flex-col items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-[#391B1B] bg-[#FEE500] hover:bg-[#FDD835] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FEE500]"
                    >
                        <svg className="h-8 w-8 mb-1" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 3C6.5 3 2 6.30769 2 10.4615C2 13.0769 3.75 15.3846 6.5 16.6154L5.5 20.5385C5.5 20.7692 5.625 21 5.875 21C6 21 6.125 20.8846 6.25 20.7692L10.75 17.7692C11.125 17.7692 11.625 17.7692 12 17.7692C17.5 17.7692 22 14.4615 22 10.4615C22 6.30769 17.5 3 12 3Z"></path>
                        </svg>
                        <span className="text-xs whitespace-pre-line text-center">카카오 로그인</span>
                    </button>
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full flex flex-col items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-[#4285F4] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4285F4]"
                    >
                        <svg className="h-8 w-8 mb-1" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                        </svg>
                        <span className="text-xs whitespace-pre-line text-center">구글 로그인</span>
                    </button>

                </div>
            </div>
            <div className="mt-6 text-center">
                <Link to="/signup" className="text-primary hover:text-primary-dark text-large">
                    회원가입
                </Link>
            </div>
        </div>

    );
};

export default Login;