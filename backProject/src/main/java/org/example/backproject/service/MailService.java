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
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class MailService {
    private static final Dotenv dotenv = Dotenv.load();
    private static final String ADMIN_EMAIL = dotenv.get("SMTP_EMAIL");
    private static final String ADMIN_PASSWORD = dotenv.get("SMTP_PASSWORD");
    private static final String SMTP_HOST = dotenv.get("SMTP_HOST", "smtp.naver.com");
    private static final String SMTP_PORT = dotenv.get("SMTP_PORT", "465");

    public String sendVerificationCode(String toEmail) throws MessagingException, UnsupportedEncodingException {
        // 환경변수 로깅
        log.info("메일 발송 시작: {}", toEmail);
        log.debug("SMTP 설정 - SMTP_HOST: {}, SMTP_PORT: {}", SMTP_HOST, SMTP_PORT);
        log.debug("SMTP_EMAIL 설정 여부: {}", ADMIN_EMAIL != null ? "설정됨" : "설정되지 않음");
        log.debug("SMTP_PASSWORD 설정 여부: {}", ADMIN_PASSWORD != null ? "설정됨" : "설정되지 않음");
        
        if (ADMIN_EMAIL == null || ADMIN_PASSWORD == null) {
            log.error("SMTP 계정 정보가 설정되지 않았습니다. .env 파일을 확인하세요.");
            throw new RuntimeException("SMTP 계정 정보가 설정되지 않았습니다.");
        }

        String code = String.valueOf(new Random().nextInt(900000) + 100000);
        log.debug("생성된 인증 코드: {}", code);

        Properties props = new Properties();
        props.put("mail.debug", "true"); // 디버깅 모드 활성화
        props.put("mail.smtp.host", SMTP_HOST);
        props.put("mail.smtp.port", SMTP_PORT);
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.ssl.enable", "true");
        props.put("mail.smtp.ssl.protocols", "TLSv1.2");
        props.put("mail.smtp.socketFactory.port", SMTP_PORT); 
        props.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");

        try {
            log.debug("SMTP 세션 생성 시도");
            Session session = Session.getInstance(props, new Authenticator() {
                @Override
                protected PasswordAuthentication getPasswordAuthentication() {
                    return new PasswordAuthentication(ADMIN_EMAIL, ADMIN_PASSWORD);
                }
            });
            session.setDebug(true); // 세션 디버깅 활성화
            
            log.debug("메일 메시지 생성");
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(ADMIN_EMAIL, "이집맛집 인증"));
            message.setRecipient(Message.RecipientType.TO, new InternetAddress(toEmail));
            message.setSubject("회원가입 이메일 인증 코드");
            message.setText("인증코드: " + code);

            log.debug("메일 전송 시도");
            Transport.send(message);
            log.info("메일 전송 완료: {}", toEmail);
            
            return code;
        } catch (MessagingException e) {
            log.error("메일 전송 실패: {}", e.getMessage(), e);
            throw new MessagingException("이메일 전송 실패: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("예상치 못한 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("이메일 전송 중 오류 발생: " + e.getMessage(), e);
        }
    }
}
