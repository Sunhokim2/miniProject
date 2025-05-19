import {GoogleLogin} from "@react-oauth/google";
import {GoogleOAuthProvider} from "@react-oauth/google";
import { redirect, useNavigate } from "react-router-dom";

const GoogleLoginButton = () => {
    const navigate = useNavigate();
    const clientId = '1018972340590-3cc2ajhnlnbu8jphvat8bcsnkumel3a2.apps.googleusercontent.com'

    const sendCredential =async (res) =>{
        try{
            const response = await fetch('http//localhost:8080/****',{
                method:'POST',
                headers : {
                    'Content-Type':'application/json',
                },
                body: JSON.stringify({res}),
            });
            if(response.ok){
                alert('success');
            }else{
                 alert("send credential fail" );
                //alert(JSON.stringify(res.credential));
            }


        }
        catch(error){
            console.error("error sending credential : ", error);
        }
    };

    return (
        <>
            <GoogleOAuthProvider clientId={clientId}>
                <GoogleLogin
                    onSuccess={(res) => {
                        console.log(res);

                        sendCredential(res);
                        navigate('/loginlanding');
                    }}
                    onFailure={(err) => {
                        console.log(err);
                    }}
                />
            </GoogleOAuthProvider>
        </>
    );
};

export default GoogleLoginButton
