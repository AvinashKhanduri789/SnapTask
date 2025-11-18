package com.snaptask.server.snaptask_server.service.email;

import com.sendgrid.*;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.snaptask.server.snaptask_server.enums.EmailNotificationType;
import com.snaptask.server.snaptask_server.util.Email;
import jakarta.mail.MessagingException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class NotificationEmailService {

    @Value("${sendgrid.api.key}")
    private String sendGridApiKey;

    @Value("${sendgrid.from.email}")
    private String fromEmail;

    private final Email email;

    public NotificationEmailService(Email email) {
        this.email = email;
    }

    @Async
    public void sendNotificationEmail(String to, EmailNotificationType type, String dynamicValue) {
        String subject;
        String messageBody;

        switch (type) {
            case ACCOUNT_VERIFICATION -> {
                subject = "Verify Your SnapTask Account";
                messageBody = email.buildHtmlEmail(
                        "Welcome to SnapTask!",
                        "Please use the following verification code to activate your account:",
                        dynamicValue
                );
            }

            case PASSWORD_RESET -> {
                subject = "Reset Your SnapTask Password";
                messageBody = email.buildHtmlEmail(
                        "Password Reset Request",
                        "Use the following code to reset your password:",
                        dynamicValue
                );
            }

            case OTP -> {
                subject = "Your One-Time Password (OTP)";
                messageBody = email.buildHtmlEmail(
                        "OTP for Verification",
                        "Use the OTP below to continue your secure action:",
                        dynamicValue
                );
            }

            case PASSWORD_RESET_COMPLETED -> {
                subject = "Password Reset Successful";
                messageBody = email.buildHtmlEmail(
                        "Password Reset Confirmed",
                        "Your password has been successfully updated. If this wasn’t you, please contact support immediately.",
                        null
                );
            }

            case WELCOME -> {
                subject = "Welcome to SnapTask";
                messageBody = email.buildHtmlEmail(
                        "Welcome Onboard!",
                        "Your account has been successfully created. Start exploring tasks now!",
                        ""
                );
            }

            default -> throw new IllegalArgumentException("Unsupported email type: " + type);
        }

        try {
            sendUsingSendGrid(to, subject, messageBody);
            log.info("Email of type [{}] sent to {}", type, to);
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
        }
    }

    private void sendUsingSendGrid(String to, String subject, String htmlContent) throws Exception {

        com.sendgrid.helpers.mail.objects.Email from =
                new com.sendgrid.helpers.mail.objects.Email(fromEmail);

        com.sendgrid.helpers.mail.objects.Email toEmail =
                new com.sendgrid.helpers.mail.objects.Email(to);

        Content content = new Content("text/html", htmlContent);
        Mail mail = new Mail(from, subject, toEmail, content);

        SendGrid sg = new SendGrid(sendGridApiKey);
        Request request = new Request();

        request.setMethod(Method.POST);
        request.setEndpoint("mail/send");
        request.setBody(mail.build());

        sg.api(request);
    }

}
