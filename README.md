🧠 SnapTask — Smart Task Collaboration Platform

SnapTask is a cross-platform mobile and web-ready application designed to connect Posters (who create and manage tasks) and Seekers (who complete them).
Built with React Native (Expo Router) and a Spring Boot + MongoDB backend, SnapTask provides real-time notifications, secure authentication, and a scalable data model — ideal for production-level collaboration systems.

🚀 Features
🔐 Authentication & Authorization

JWT-based authentication using Spring Security

Role-based Access Control (RBAC) for Poster and Seeker roles

Secure password reset and email verification flow

Integrated global exception handling for consistent API responses

📱 Client (React Native + Expo)

Built with Expo Router for modular navigation

Expo Notifications for foreground and background push alerts

Axios API integration with centralized request handling (JWT + error states)

Separate Poster and Seeker flows with dynamic tab navigation

Optimized context management for authentication, user profile, and notifications

⚙️ Backend (Spring Boot + MongoDB)

Spring Data MongoDB for scalable document modeling

Entities: Task, Bid, Notification, User with proper indexing and lightweight references

Firebase Cloud Messaging (FCM) integration for notifications

DTO-based request/response handling for clean client communication

Production-ready global error handling with ProblemDetail

📨 Notification System

Real-time notification delivery via Expo and Firebase FCM

Topic and device-based messaging

Notification service handles background and foreground states

Centralized DTOs for PosterNotification, SeekerNotification, and system alerts

🏗️ Tech Stack
Layer	Technology
Frontend	React Native (Expo Router), Axios, Context API
Backend	Spring Boot, Spring Data MongoDB
Auth	Spring Security (JWT), Role-based access
Database	MongoDB
Notifications	Firebase Cloud Messaging, Expo Notifications
Build Tools	Maven, Gradle (Spring), EAS (Expo)

⚡ Getting Started
🔹 1. Clone the repository
git clone https://github.com/<your-username>/snaptask.git
cd snaptask

🔹 2. Setup the backend
cd snaptask-server
./mvnw spring-boot:run

🔹 3. Setup the client
cd snaptask-client
npm install
npx expo start


⚠️ Make sure to replace your local backend IP in api.js
Example:

const api = axios.create({
  baseURL: "http://<YOUR_HOST_IP>:4000", // Your local IP and Spring Boot port
});

🔥 Current Progress

✅ Poster flow APIs (create, update, delete, view)
✅ Notification service integrated with Expo + Firebase
✅ Authentication controller + DTOs implemented
✅ Global exception handling with ProblemDetail
✅ Frontend API layer setup with Axios and request interceptor

🧰 Upcoming Features

Seeker flow integration (bidding, accepting tasks)

Admin panel for moderation and insights

Chat system for poster–seeker communication

Analytics dashboard for task performance
