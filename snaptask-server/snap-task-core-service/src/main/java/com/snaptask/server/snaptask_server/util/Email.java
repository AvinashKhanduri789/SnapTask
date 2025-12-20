package com.snaptask.server.snaptask_server.util;

import org.springframework.stereotype.Component;

@Component
public class Email {
    public String buildHtmlEmail(String title, String message, String highlightValue) {
        return """
            <html>
                <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
                    <div style="max-width: 600px; margin: auto; background-color: #ffffff;
                                border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); padding: 20px;">
                        <h2 style="color: #333;">%s</h2>
                        <p style="font-size: 16px; color: #555;">%s</p>
                        %s
                        <hr style="margin-top: 30px; border: none; border-top: 1px solid #ddd;">
                        <p style="font-size: 12px; color: #888; text-align: center;">
                            &copy; %d SnapTask. All rights reserved.
                        </p>
                    </div>
                </body>
            </html>
        """.formatted(
                title,
                message,
                highlightValue != null && !highlightValue.isEmpty()
                        ? "<div style='background-color:#f0f8ff; padding:15px; border-radius:5px; text-align:center; font-size:18px; font-weight:bold; color:#007bff;'>"
                        + highlightValue + "</div>"
                        : "",
                java.time.LocalDate.now().getYear()
        );
    }
}
