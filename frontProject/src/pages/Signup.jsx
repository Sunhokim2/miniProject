import React from 'react';
import '../css/Signup.css'; // Adjust the path as necessary
import EmailVerification from '../components/EmailVerification';
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
const Signup = () => {
    const match = useRef(0);
    const [email, setEmail] = React.useState('');
    const [verificationCode, setVerificationCode] = React.useState('');
    const [passwordError, setPasswordError] = React.useState(''); // 비밀번호 불일치 메시지 상태
    const [showError, setShowError] = useState(false);
    const [formData, setFormData] = React.useState({
        userName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const navigate = useNavigate();


    const validatePassword = () => {
        if (formData.password !== formData.confirmPassword) {
            setPasswordError('비밀번호가 일치하지 않습니다.');
            return false;
        }

        if (formData.password.length < 6) {
            setPasswordError('비밀번호는 6자 이상이어야 합니다.');
            return false;
        }

        setPasswordError('');
        return true;
    };

    // match.current.classList.remove('pw-match');
    const handleChange = (e) => {
        const { name, value } = e.target;
        // setFormData({...formData, [name]: value}); // 입력 필드의 name 속성을 키로 사용하여 값 업데이트

        const newStruct = { ...formData, [name]: value };
        setFormData(newStruct);
        //console.log('newStruct:', newStruct);
        const pw = newStruct.password;
        const cpw = newStruct.confirmPassword;
        // console.log ('비밀번호:', pw);
        // console.log ('비밀번호 확인:', cpw);

        if (pw === cpw) {
            setPasswordError('');
            match.current.classList.remove('pw-match');
        } else {
            setPasswordError('Passwords do not match');
            match.current.classList.add('pw-match');

        }


    };

    const handleSubmit = async (e) => {
        const code = verificationCode;
        const payload = { ...formData, code }; // formData와 verificationCode를 포함한 payload 생성
        e.preventDefault();
        // console.log('Form Data:', formData);
        // 추가 처리 로직 (예: 서버로 데이터 전송)
        if (passwordError) {
            alert("passwords do not match");
            return;
        }
        try {

            const response = await fetch('http://localhost:8080/api/auth/signup', { // Spring API 엔드포인트
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload), // 사용자 정보를 JSON으로 변환하여 전송
            });

            if (response.ok) {
                const data = await response.json();
                alert('Signup successful!');
                console.log('Response from server:', data);
                navigate('/login'); // Signup 성공 후 로그인 페이지로 이동
            } else {
                alert('Signup failed. Please try again.');
                const data = await response.json();
                console.error('Error response from server:', data);
            }
        } catch (error) {
            console.error('Error during signup:', error);
            alert('An error occurred while signing up.');
        }
    };
    return (
        <div className="w-full max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">회원가입</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <TextField
                        fullWidth
                        label="이름"
                        type="text"
                        name="userName"
                        //value={formData.userName}
                        onChange={handleChange}
                        required
                        InputProps={{
                            startAdornment: <PersonIcon className="mr-2 text-gray-500" />,
                        }}
                    />
                </div>
                <div style={{ height: '24px' }}></div>
                <div>
                    <TextField
                        fullWidth
                        label="이메일"
                        type="email"
                        name="email"
                        //value={formData.email}
                        onChange={handleChange}
                        required
                        InputProps={{
                            startAdornment: <EmailIcon className="mr-2 text-gray-500" />,
                        }}
                    />
                </div>
                <div style={{ height: '24px' }}></div>
                <div>

                    <EmailVerification email={formData.email} />


                    <TextField
                        fullWidth
                        label="이메일 인증코드"
                        type="text"
                        id="email-check"
                        name="email-check"
                        placeholder='인증코드 입력'
                        //value={formData.email}
                        onChange={(e) => setVerificationCode(e.target.value)}
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
                        id="password"
                        name="password"
                        type="password"
                        //value={formData.password}
                        onChange={handleChange}
                        required
                        InputProps={{
                            startAdornment: <LockIcon className="mr-2 text-gray-500" />,
                        }}
                        helperText="비밀번호는 6자 이상이어야 합니다."
                    />
                </div>
                <div style={{ height: '24px' }}></div>
                <div>
                    <TextField
                        fullWidth
                        label="비밀번호 확인"
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        //value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        InputProps={{
                            startAdornment: <LockIcon className="mr-2 text-gray-500" />,
                        }}

                    />
                    {formData.confirmPassword !== '' && formData.password !== formData.confirmPassword &&
                        <label id="pw-match" className="pw-match" ref={match}>
                            비밀번호가 일치해야 됩니다.
                        </label>
                    }
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
                        className="py-3 mt-4"
                    >
                        {/* {isLoading ? <CircularProgress size={24} color="inherit" /> : '회원가입'} */}
                        회원가입
                    </Button>
                </div>
            </form>
            <div style={{ height: '24px' }}></div>
            <div className="mt-6 text-center">
                <Link to="/login" className="text-primary hover:text-primary-dark text-large">
                    이미 계정이 있으신가요? 로그인
                </Link>
            </div>
        </div>
    );
};

export default Signup;