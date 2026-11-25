
<div align="center">

  <img src="https://raw.githubusercontent.com/AnshCyberSec/nexus-arena/main/authify/public/icons.svg" width="115" alt="Nexus Arena Logo" />

  <h1>⚡ NEXUS ARENA ⚡</h1>

  <h3>THE FUTURE OF SECURE MULTIPLAYER GAMING</h3>

  <p>
    <b>One Platform. Infinite Possibilities. Zero Compromises.</b>
  </p>

  <p>
    An Enterprise-Grade Authentication Ecosystem<br/>
    Combined With an Immersive Real-Time Multiplayer Gaming Experience.
  </p>

  <br/>

  <a href="https://nexus-arena-lovat.vercel.app/login">
    <img src="https://img.shields.io/badge/▶_PLAY_NEXUS_ARENA-FF5722?style=for-the-badge&logo=vercel&logoColor=white&labelColor=171329" height="55" alt="Play Nexus Arena"/>
  </a>

  <br/>
  <br/>

  <p>
    <b>ENTER THE ARENA • CHALLENGE YOUR FRIENDS • EXPERIENCE THE FUTURE</b>
  </p>

  <br/>

  <img src="https://img.shields.io/badge/Java_21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white"/>
  <img src="https://img.shields.io/badge/Spring_Boot_3-6DB33F?style=for-the-badge&logo=springboot&logoColor=white"/>
  <img src="https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white"/>

  <br/>

  <img src="https://img.shields.io/badge/Spring_Security-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white"/>
  <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white"/>
  <img src="https://img.shields.io/badge/WebSocket-010101?style=for-the-badge&logo=socketdotio&logoColor=white"/>
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white"/>

  <br/>
  <br/>

  <p>
    🔐 <b>Enterprise Security</b>
    &nbsp; • &nbsp;
    🎮 <b>Real-Time Multiplayer</b>
    &nbsp; • &nbsp;
    ⚡ <b>Cloud Deployment</b>
  </p>

  <br/>

  <a href="https://github.com/AnshCyberSec/nexus-arena">
    <img src="https://img.shields.io/badge/VIEW_SOURCE_CODE-181717?style=for-the-badge&logo=github&logoColor=white"/>
  </a>

  <a href="https://github.com/AnshCyberSec/nexus-arena/stargazers">
    <img src="https://img.shields.io/github/stars/AnshCyberSec/nexus-arena?style=for-the-badge&logo=github&color=gold&label=STARS"/>
  </a>

</div>

---


---

## 🚀 About The Project

**Nexus Arena** is not just another authentication system. It is a full-stack, production-ready application that demonstrates how a modern, secure web application should be built. It features **Military-Grade Security** (JWT, MFA, HttpOnly Cookies, Rate Limiting) combined with a **Real-Time Multiplayer Tic-Tac-Toe Arena** powered by WebSockets.

Whether you are here to test the seamless authentication flow or to challenge a friend in the arena, Nexus Arena delivers an ultra-premium, buttery-smooth experience.

---

## 🛠️ Tech Stack & Architecture

### **Frontend (The Art of UI/UX)**
*   **Framework:** React 18 + Vite (Lightning fast)
*   **Styling:** Tailwind CSS (Custom "Nexus" Deep Violet & Gold Theme)
*   **State Management:** React Context API
*   **Real-Time:** `@stomp/stompjs` + `SockJS`
*   **Animations:** Canvas Confetti, Custom CSS Keyframes
*   **API Client:** Axios (with Interceptors for silent token refresh)

### **Backend (The Iron Fortress)**
*   **Framework:** Java 21 + Spring Boot 3
*   **Security:** Spring Security 6, RSA-256 Signed JWT, OAuth2, MFA (TOTP)
*   **Real-Time:** Spring WebSocket (STOMP Protocol)
*   **Database:** PostgreSQL + Hibernate/JPA + Flyway Migrations
*   **Caching & Rate Limiting:** Redis (Upstash)
*   **Email Service:** JavaMail (SMTP via Gmail)
*   **API Docs:** Swagger / OpenAPI 3

---

## 🗄️ Database Schema (Flyway Migrations)

Our database architecture is highly normalized and handles everything from auth tokens to audit logs.

| Table Name | Purpose / Description |
| :--- | :--- |
| `users` | Stores core user details, account status, MFA secrets, and lockout timestamps. |
| `roles` & `user_roles` | RBAC implementation mapping users to specific roles (USER, ADMIN). |
| `refresh_tokens` | Tracks token rotation, family IDs, and revocation for absolute session security. |
| `email_verification_tokens` | One-time secure tokens for email verification. |
| `password_reset_tokens` | Expiring tokens for password resets with usage tracking. |
| `otp_verification` | Stores hashed 6-digit OTPs for sensitive operations with attempt counters. |
| `login_attempts` | Tracks successful and failed logins (IP + UserAgent) for brute-force detection. |
| `audit_logs` | System-wide immutable logs tracking critical events (e.g., USER_REGISTERED, PASSWORD_CHANGED). |

---

## 🔌 API Endpoints (Backend)

### 🔐 Authentication Endpoints (`/api/v1/auth`)
*   `POST /register` - Register a new user.
*   `POST /login` - Authenticate and receive JWT + HttpOnly Refresh Cookie.
*   `POST /refresh` - Rotate refresh token for a new access token.
*   `POST /logout` - Revoke refresh token and clear cookies.
*   `POST /mfa/verify-login` - Complete login flow if MFA is enabled.
*   `GET /me` - Fetch current authenticated user profile.
*   `GET /verify-email?token=...` - Verify email via link.
*   `POST /forgot-password` - Request a password reset link.
*   `POST /reset-password` - Reset password using secure token.

### 👤 User Management (`/api/v1/users`)
*   `POST /change-password` - Update password with current password verification.
*   `POST /change-email` - Request email change (triggers re-verification).
*   `POST /mfa/setup` - Generate QR code and secret for 2FA.
*   `POST /mfa/verify` - Verify and enable 2FA.
*   `POST /mfa/disable` - Disable 2FA (requires current code).
*   `POST /otp/send?purpose=...` - Send OTP to the authenticated user.
*   `POST /otp/verify` - Verify the 6-digit OTP.

### 🛡️ Admin Operations (`/api/v1/admin` - Requires ROLE_ADMIN)
*   `GET /` - Fetch paginated list of all users.
*   `POST /users/{userId}/lock` - Lock a user account.
*   `POST /users/{userId}/unlock` - Unlock a user account.
*   `PATCH /users/{userId}/roles` - Change roles assigned to a user.

### 🎮 Real-Time WebSockets (`/ws` & `/app`)
*   `STOMP /app/game/{roomId}/join` - Join a room (Assigns X or O).
*   `STOMP /app/game/{roomId}/move` - Make a move on the board.
*   `STOMP /app/game/{roomId}/reset` - Request game reset.
*   `SUBSCRIBE /topic/game/{roomId}` - Listen to game state changes.

---

## ✨ Ultimate Feature List

### 🔐 Security & Authentication (Enterprise Grade)
- [x] **Advanced JWT Auth:** Stateless authentication using RSA-256 asymmetric keys.
- [x] **Refresh Token Rotation:** Secure token rotation with reuse detection (revokes entire family on theft).
- [x] **Two-Factor Authentication (2FA):** Google Authenticator support via TOTP.
- [x] **HttpOnly Cookies:** Refresh tokens stored securely to prevent XSS attacks.
- [x] **Account Lockout:** Brute-force protection (locks account for 15 mins after 5 failed attempts).
- [x] **Email Verification:** Secure token-based email verification & password reset.
- [x] **OTP Service:** 6-digit Time-based OTP generation for sensitive actions.
- [x] **Role-Based Access Control (RBAC):** Admin and User roles with protected routes.
- [x] **Rate Limiting:** Custom Redis-based rate limiting filter to prevent DDoS.

### 🎮 Real-Time Multiplayer Arena
- [x] **WebSocket Integration:** Instantaneous move updates across continents.
- [x] **Room Management:** Create private rooms and invite friends via 6-digit codes.
- [x] **Cinematic Victory Screen:** Confetti blasts, dynamic sounds, and win/loss animations.
- [x] **Interactive Dashboard:** Track your MFA status, account details, and jump into the arena.

---

## 📂 Project Structure

```text
nexus-arena/
│
├── auth-service/              # ☕ Java Spring Boot Backend
│   ├── src/main/java/com/example/authservice/
│   │   ├── config/            # Security, CORS, WebSocket, Redis Configs
│   │   ├── controller/        # REST APIs & WebSocket Controllers
│   │   ├── entity/            # JPA Entities (User, Token, AuditLog)
│   │   ├── security/          # JWT Filters, KeyProviders, Custom UserDetails
│   │   ├── service/           # Business Logic (Auth, MFA, Email, Token)
│   │   └── repository/        # Spring Data JPA Interfaces
│   ├── src/main/resources/
│   │   ├── db/migration/      # Flyway SQL Scripts (V1, V2, V3)
│   │   └── application.yaml   # Environment Configs
│   └── Dockerfile             # Containerization
│
└── authify/                   # ⚛️ React Frontend
    ├── src/
    │   ├── api/               # Axios & WebSocket Setup
    │   ├── components/        # Reusable UI (Button, Input, Navbar, Game Board)
    │   ├── context/           # Global State (AuthContext)
    │   ├── pages/             # Auth, Dashboard, Admin, Online Game
    │   ├── routes/            # Protected & Public Routes
    │   └── utils/             # Validators, Constants, Sound Engine
    ├── tailwind.config.js     # Custom Theme & Animations
    └── vite.config.js         # Proxy & Build Config
```

---

## 🚀 Quick Start (Run Locally)

Follow these steps to set up and run **Nexus Arena** on your local machine.

### 1. Backend Setup (Spring Boot)

**Step 1: Clone the Repository**
```bash
git clone https://github.com/AnshCyberSec/nexus-arena.git
```

**Step 2: Navigate to Backend Directory**
```bash
cd nexus-arena/auth-service
```

**Step 3: Build the Project**
```bash
mvn clean install
```

**Step 4: Run the Backend Application**
```bash
mvn spring-boot:run
```

> **Note:** Ensure PostgreSQL and Redis are running locally. Alternatively, configure your cloud database and Redis credentials in `application.yaml`.

### 2. Frontend Setup (React + Vite)

**Step 1: Navigate to Frontend Directory**
```bash
cd nexus-arena/authify
```

**Step 2: Install Dependencies**
```bash
npm install
```

**Step 3: Start the Development Server**
```bash
npm run dev
```

The frontend will now be accessible through the local development URL provided by Vite.

---

## 🌐 Live Deployment Architecture

Nexus Arena follows a modern cloud-based deployment architecture, combining globally distributed frontend hosting with scalable backend infrastructure.

| Component | Technology / Platform | Description |
| :--- | :--- | :--- |
| **Frontend** | Vercel | React application hosted on a global edge network. |
| **Backend** | Render / Fly.io | Dockerized Spring Boot application hosting. |
| **Database** | Supabase | Serverless PostgreSQL database. |
| **Caching** | Upstash Redis | Serverless Redis infrastructure for caching and rate limiting. |
| **Email Service** | Gmail SMTP | Email delivery for verification and authentication workflows. |

<div align="center">

**🚀 Experience Nexus Arena Live**

[![Live Demo](https://img.shields.io/badge/PLAY_NEXUS_ARENA-FF5722?style=for-the-badge&logo=vercel&logoColor=white)](https://nexus-arena-lovat.vercel.app/login)

</div>

---

<div align="center">

### 👨‍💻 Built By

**Anshuman Dalabehera**

*Full Stack Developer & Cybersecurity Enthusiast*


**⭐ If you like Nexus Arena, consider giving the repository a star!**

</div>
