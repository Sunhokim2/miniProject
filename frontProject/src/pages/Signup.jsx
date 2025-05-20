import React from 'react';
import '../css/Signup.css'; // Adjust the path as necessary
import EmailVerification from '../components/EmailVerification';
import {useState,useEffect,useRef} from 'react'
const Signup = () => {
    const match = useRef(0);    
    const [email, setEmail] = React.useState('');
    const [verificationCode, setVerificationCode] = React.useState('');
    const [passwordError, setPasswordError] = React.useState(''); // 비밀번호 불일치 메시지 상태
    const [formData, setFormData] = React.useState({
        userName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    // match.current.classList.remove('pw-match');
    const handleChange = (e) => {
        const { name, value } = e.target;
        // setFormData({...formData, [name]: value}); // 입력 필드의 name 속성을 키로 사용하여 값 업데이트
        
        const newStruct = {...formData, [name]:value};
        setFormData(newStruct);

        const pw = newStruct.password;
        const cpw = newStruct.confirmPassword;
        // console.log ('비밀번호:', pw);
        // console.log ('비밀번호 확인:', cpw);

        if(pw === cpw){
            setPasswordError('');
            match.current.classList.remove('pw-match');
        }else{
            setPasswordError('Passwords do not match');
            match.current.classList.add('pw-match');
            
        }
        
        
    };
    
    const handleSubmit = async (e) => {
        const code = verificationCode;
        const payload = {...formData, code}; // formData와 verificationCode를 포함한 payload 생성
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
                alert('Signup successful!' +JSON.stringify(payload));
                console.log('Response from server:', data);
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
        <div className="signup-container">
            <div className="signup-box">
                <h2>Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input 
                            type="text" 
                            id="userName" 
                            name="userName" 
                            placeholder="Enter your username" required 
                            // value={formData.username}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            placeholder="Enter your email" required
                            // value={formData.email}
                            onChange={handleChange}
                        />
                        
                    </div>
                    <div className="form-group">
                        <label htmlFor="email-check">
                            <EmailVerification email={formData.email}/>
                        </label>
                        <input 
                            type="text" 
                            id="email-check" 
                            name="email-check" 
                            placeholder="verify email code" required 
                            
                            onChange={(e) => setVerificationCode(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            name="password" 
                            placeholder="Enter your password" required 
                            // value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirm-password">Confirm Password</label>
                        <input 
                            type="password" 
                            id="confirmPassword" 
                            name="confirmPassword" 
                            placeholder="Confirm your password" required
                            // value={formData.confirmPassword}
                            onChange={handleChange} 
                        />  
                        {formData.confirmPassword !== '' &&<label id="pw-match" className="pw-match" ref={match}>
                                비밀번호가 일치해야 됩니다.
                        </label>}
                        
                    </div>

                    <button type="submit" className="signup-button">Sign Up</button>
                </form>
            </div>
        </div>
    );
};

export default Signup;