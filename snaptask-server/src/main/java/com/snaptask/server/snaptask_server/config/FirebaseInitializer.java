package com.snaptask.server.snaptask_server.config;

import java.io.IOException;
import java.io.InputStream;

import javax.annotation.PostConstruct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;

@Configuration
public class FirebaseInitializer {

    private static final Logger logger = LoggerFactory.getLogger(FirebaseInitializer.class);

    // Allow externalizing the JSON path via application.properties
    @Value("${firebase.service.account.path:firebase-service.json}")
    private String firebaseServiceAccountPath;

    @PostConstruct
    public void initialize() {
        try {
            if (!FirebaseApp.getApps().isEmpty()) {
                logger.info("Firebase App already initialized.");
                return;
            }

            // Load service account from classpath
            try (InputStream serviceAccount = getClass().getClassLoader().getResourceAsStream(firebaseServiceAccountPath)) {
                if (serviceAccount == null) {
                    throw new IOException("Firebase service account file not found at path: " + firebaseServiceAccountPath);
                }

                FirebaseOptions options = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                        .build();

                FirebaseApp.initializeApp(options);
                logger.info("Firebase App initialized successfully!");
            }

        } catch (IOException e) {
            logger.error("Failed to initialize Firebase App: {}", e.getMessage(), e);
            throw new IllegalStateException("Firebase initialization failed", e);
        }
    }
}
