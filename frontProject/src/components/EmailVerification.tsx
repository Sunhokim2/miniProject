import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import EmailIcon from '@mui/icons-material/Email';

interface VerificationFormData {
    email: string;
    verificationCode: string;
}

interface EmailVerificationProps {
    email: string;
}

const EmailVerification: React.FC<EmailVerificationProps> = ({ email }) => {
    const [isSending, setIsSending] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [formData, setFormData] = useState<VerificationFormData>({
        email: '',
        verificationCode: '',
    });
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/api/auth/verify-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert('이메일 인증이 완료되었습니다.');
                navigate('/login');
            } else {
                alert('이메일 인증에 실패했습니다. 다시 시도해주세요.');
            }
        } catch (error) {
            console.error('이메일 인증 중 오류 발생:', error);
            alert('이메일 인증 중 오류가 발생했습니다.');
        }
    };

    const handleSendVerification = async () => {
        if (!email) {
            alert('이메일을 입력해주세요.');
            return;
        }

        setIsSending(true);
        try {
            const response = await fetch('http://localhost:8080/api/auth/email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setIsSent(true);
                alert('인증 코드가 이메일로 전송되었습니다.');
            } else {
                alert(data.error || '인증 코드 전송에 실패했습니다.');
            }
        } catch (error) {
            console.error('Error sending verification code:', error);
            alert('인증 코드 전송 중 오류가 발생했습니다.');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <Button
            variant="outlined"
            color="primary"
            onClick={handleSendVerification}
            disabled={isSending || isSent || !email}
            startIcon={<EmailIcon />}
            size="small"
            className="mt-1"
        >
            {isSending ? '전송 중...' : isSent ? '인증 코드 전송됨' : '인증 코드 받기'}
        </Button>
    );
};

export default EmailVerification;