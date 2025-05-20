import React from 'react';

const EmailVerification = ({email}) => {
     const sendEmailAddress = async () => {
        //console.log('email:', email);
        try {
            const response = await fetch('http://localhost:8080/api/auth/email', { // Spring API 엔드포인트
                method: 'POST',
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
            }
        } catch (error) {
            console.error('Error sending email-address:', error);
            alert('An error occurred while sending email-address.');
        }
    };
    return (
        <div className="form-group">
            
            <button 
                type="button" 
                className="verify-button"
                onClick={sendEmailAddress}>
                Send Verification Code
            </button>
        </div>
    );
};

export default EmailVerification;