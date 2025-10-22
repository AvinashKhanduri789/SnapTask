package com.snaptask.server.snaptask_server.service.email;

import com.snaptask.server.snaptask_server.enums.EmailNotificationType;
import com.snaptask.server.snaptask_server.util.Email;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

/**
 * Handles all outgoing email notifications like verification, OTP, and password reset.
 */
@Service
@Slf4j
public class NotificationEmailService {

    private final JavaMailSender mailSender;
    private final Email email;

    public NotificationEmailService(JavaMailSender mailSender,Email email) {
        this.mailSender = mailSender;
        this.email = email;
    }

    /**
     * Sends an email notification based on the provided type.
     */
    @Async
    public void sendNotificationEmail(String to, EmailNotificationType type, String dynamicValue) {
        String subject;
        String messageBody;

        switch (type) {
            case ACCOUNT_VERIFICATION -> {
                subject = "Verify Your SnapTask Account";
                messageBody = email.buildHtmlEmail("Welcome to SnapTask!",
                        "Please use the following verification code to activate your account:",
                        dynamicValue);
            }

            case PASSWORD_RESET -> {
                subject = "Reset Your SnapTask Password";
                messageBody = email.buildHtmlEmail("Password Reset Request",
                        "Use the following code to reset your password:",
                        dynamicValue);
            }

            case OTP -> {
                subject = "Your One-Time Password (OTP)";
                messageBody = email.buildHtmlEmail("OTP for Verification",
                        "Use the OTP below to continue your secure action:",
                        dynamicValue);
            }

            case  PASSWORD_RESET_COMPLETED -> {
                subject = "Password Reset Successful";
                messageBody = email.buildHtmlEmail(
                        "Password Reset Confirmed",
                        "Your password has been successfully updated. If this wasn’t you, please contact support immediately.",
                        null
                );
            }

            case WELCOME -> {
                subject = "Welcome to SnapTask ";
                messageBody = email.buildHtmlEmail("Welcome Onboard!",
                        "Your account has been successfully created. Start exploring tasks now!",
                        "");
            }

            default -> throw new IllegalArgumentException("Unsupported email type: " + type);
        }

        try {
            sendHtmlEmail(to, subject, messageBody);
            log.info("Email of type [{}] sent to {}", type, to);
        } catch (MessagingException e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());

        }
    }

    /**
     * Low-level reusable email sending logic.
     */

    private void sendHtmlEmail(String to, String subject, String htmlContent) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);

        mailSender.send(message);
    }
}
