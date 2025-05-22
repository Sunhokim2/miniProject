import React from 'react';
import Button from '@mui/material/Button';

const EmailVerification = ({ email }) => {
    const sendEmailAddress = async () => {
        //console.log('email:', email);
        try {
            const response = await fetch('http://localhost:8080/api/auth/email', { // Spring API 엔드포인트
                method: 'POST',
                url:'http://localhost:8080/api/auth/email',
                data:{},
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }), // email 데이터를 JSON으로 변환하여 전송
            });

            if (response.ok) {
                const data = await response.json();
                alert('send email send to spring successfully!');
            } else {
                alert('Failed to send email-address.');
                console.log(response);
                console.log(email);
            }
        } catch (error) {
            console.error('Error sending email-address:', error);
            alert('An error occurred while sending email-address.');
        }
    };
    return (
        <div className="form-group">

            <Button
                type="button"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                onClick={sendEmailAddress}
                className="py-3 mt-4">

                Send Verification Code
            </Button>

        </div>
    );
};

export default EmailVerification;