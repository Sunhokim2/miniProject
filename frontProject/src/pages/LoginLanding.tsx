import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginLanding: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // 로그인 성공 후 메인 페이지로 리다이렉션
        navigate('/');
    }, [navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">로그인 성공!</h1>
                <p className="text-gray-600">메인 페이지로 이동합니다...</p>
            </div>
        </div>
    );
};

export default LoginLanding;