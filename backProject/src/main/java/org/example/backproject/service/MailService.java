package org.example.backproject.service;

import java.io.UnsupportedEncodingException;
import java.util.Properties;
import java.util.Random;

import javax.mail.Authenticator;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import org.springframework.stereotype.Service;

import io.github.cdimascio.dotenv.Dotenv;

@Service
public class MailService {
    private static final Dotenv dotenv = Dotenv.load();
    private static final String ADMIN_EMAIL = dotenv.get("SMTP_EMAIL");
    private static final String ADMIN_PASSWORD = dotenv.get("SMTP_PASSWORD");

    public String sendVerificationCode(String toEmail) throws MessagingException, UnsupportedEncodingException{
        String code = String.valueOf(new Random().nextInt(900000) + 100000);

        Properties props = new Properties();
        props.put("mail.smtp.host", "smtp.naver.com");
        props.put("mail.smtp.port", "465");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.ssl.enable", "true");
        props.put("mail.smtp.ssl.protocols", "TLSv1.2");

        Session session = Session.getInstance(props, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication(){
                return new PasswordAuthentication(ADMIN_EMAIL, ADMIN_PASSWORD);
            }
        });

        Message message = new MimeMessage(session);
        message.setFrom(new InternetAddress(ADMIN_EMAIL, "이집맛집 인증"));
        message.setRecipient(Message.RecipientType.TO, new InternetAddress(toEmail));
        message.setSubject("회원가입 이메일 인증 코드");
        message.setText("인증코드: " + code);

        Transport.send(message);
        return code;
    }
}
