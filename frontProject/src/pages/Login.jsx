import React from 'react';
import '../css/Login.css'; // Adjust the path as necessary
import { Link } from 'react-router-dom';
import GoogleLoginButton from '../components/GoogleLogin';



const Login = () => {
    // const url_google_login = `https://accounts.google.com/o/oauth2/v2/auth?
    // client_id=${process.env.REACT_APP_GOOGLE_AUTH_CLIENT_ID}&
    // redirect_uri=http://localhost:5173/LogInLanding&
    // response_type=code&
    // scope=email+profile`;
    
    // const handleGoogleLogin= ()=>{
    //     window.location.href = url_google_login;
    // };

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
                    <Link to="/signup">
                    회원가입
                        {/* <Button>회원가입</Button> */}
                    </Link>
                    <GoogleLoginButton></GoogleLoginButton>

                </form>
            </div>
        </div>
    );
};

export default Login;