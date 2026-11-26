# ⚡ NEXUS ARENA — SYSTEM ARCHITECTURE

### Secure Authentication Ecosystem + Real-Time Multiplayer Gaming Platform

---

## 01. PROJECT OVERVIEW

```mermaid
flowchart TB
    ROOT(["⚡ NEXUS ARENA"])

    ROOT --> AUTH["AUTHIFY<br/>Secure Identity Platform"]
    ROOT --> GAME["MULTIPLAYER ARENA<br/>Real-Time Gaming"]

    AUTH --> A1["JWT Authentication"]
    AUTH --> A2["MFA / OTP Verification"]
    AUTH --> A3["Refresh Token Rotation"]
    AUTH --> A4["RBAC & Account Security"]

    GAME --> G1["Private Game Rooms"]
    GAME --> G2["6-Digit Room Codes"]
    GAME --> G3["Live Game Synchronization"]
    GAME --> G4["Victory Animations"]

    classDef root fill:#172554,stroke:#60a5fa,color:#fff,stroke-width:3px
    classDef module fill:#312e81,stroke:#818cf8,color:#fff
    classDef feature fill:#064e3b,stroke:#34d399,color:#fff

    class ROOT root
    class AUTH,GAME module
    class A1,A2,A3,A4,G1,G2,G3,G4 feature
```

---

## 02. COMPLETE TECHNOLOGY STACK

```mermaid
flowchart TB
    ROOT["NEXUS ARENA TECHNOLOGY STACK"]

    ROOT --> FRONTEND["FRONTEND"]
    ROOT --> BACKEND["BACKEND"]
    ROOT --> DATABASE["DATA LAYER"]
    ROOT --> INFRA["INFRASTRUCTURE"]

    FRONTEND --> F1["React 18"]
    FRONTEND --> F2["Vite"]
    FRONTEND --> F3["Tailwind CSS"]
    FRONTEND --> F4["Context API"]
    FRONTEND --> F5["Axios"]
    FRONTEND --> F6["STOMP + SockJS"]

    BACKEND --> B1["Java 21"]
    BACKEND --> B2["Spring Boot 3"]
    BACKEND --> B3["Spring Security 6"]
    BACKEND --> B4["Spring WebSocket"]
    BACKEND --> B5["Hibernate / JPA"]
    BACKEND --> B6["Swagger / OpenAPI"]

    DATABASE --> D1[("PostgreSQL")]
    DATABASE --> D2[("Redis")]
    DATABASE --> D3["Flyway Migrations"]

    INFRA --> I1["Docker"]
    INFRA --> I2["Vercel"]
    INFRA --> I3["Render / Fly.io"]
    INFRA --> I4["Supabase"]
    INFRA --> I5["Upstash Redis"]
    INFRA --> I6["Gmail SMTP"]

    classDef root fill:#172554,stroke:#60a5fa,color:#fff
    classDef category fill:#312e81,stroke:#818cf8,color:#fff
    classDef tech fill:#1f2937,stroke:#64748b,color:#fff

    class ROOT root
    class FRONTEND,BACKEND,DATABASE,INFRA category
    class F1,F2,F3,F4,F5,F6,B1,B2,B3,B4,B5,B6,D1,D2,D3,I1,I2,I3,I4,I5,I6 tech
```

---

## 03. HIGH-LEVEL SYSTEM ARCHITECTURE

```mermaid
flowchart TB
    USER(["USER / PLAYER"])

    subgraph CLIENT["CLIENT LAYER"]
        UI["React Application"]
        CONTEXT["Authentication Context"]
        AXIOS["Axios API Client"]
        SOCKET["STOMP / SockJS Client"]
    end

    subgraph SERVER["SPRING BOOT BACKEND"]
        API["REST Controllers"]
        FILTER["Security Filter Chain"]
        AUTH["Authentication Service"]
        MFA["MFA / OTP Service"]
        TOKEN["JWT / Refresh Token Service"]
        GAME["Game Room Service"]
        WS["WebSocket Handler"]
        MAIL["Email Service"]
    end

    subgraph STORAGE["DATA LAYER"]
        DB[("PostgreSQL")]
        REDIS[("Redis")]
        MIGRATION["Flyway"]
    end

    USER --> UI
    UI --> CONTEXT
    UI --> AXIOS
    UI --> SOCKET

    AXIOS --> API
    API --> FILTER
    FILTER --> AUTH
    AUTH --> MFA
    AUTH --> TOKEN

    SOCKET <-->|"STOMP / WebSocket"| WS
    WS --> GAME

    AUTH --> DB
    MFA --> DB
    TOKEN --> DB
    GAME --> DB

    AUTH --> REDIS
    API --> MAIL
    MIGRATION --> DB
```

---

## 04. AUTHENTICATION & SECURITY FLOW

```mermaid
flowchart TD
    START(["USER LOGIN"])
    INPUT["Submit Email & Password"]
    API["POST /api/v1/auth/login"]
    SECURITY["Spring Security"]
    VERIFY{"Credentials Valid?"}

    START --> INPUT
    INPUT --> API
    API --> SECURITY
    SECURITY --> VERIFY

    VERIFY -->|No| REJECT["Reject Login"]
    VERIFY -->|Yes| ACCOUNT{"Account Locked?"}

    ACCOUNT -->|Yes| BLOCK["Account Access Denied"]
    ACCOUNT -->|No| MFA{"MFA Enabled?"}

    MFA -->|Yes| OTP["Verify TOTP Code"]
    OTP --> OTPVALID{"OTP Valid?"}
    OTPVALID -->|No| REJECT
    OTPVALID -->|Yes| TOKEN["Generate RSA-256 JWT"]

    MFA -->|No| TOKEN

    TOKEN --> REFRESH["Generate Refresh Token"]
    REFRESH --> COOKIE["Set HttpOnly Cookie"]
    COOKIE --> SUCCESS(["AUTHENTICATED SESSION"])
```

### SECURITY COMPONENTS

```mermaid
flowchart TB
    SECURITY["SECURITY ENGINE"]

    SECURITY --> JWT["RSA-256 JWT"]
    SECURITY --> ROTATION["Refresh Token Rotation"]
    SECURITY --> MFA["TOTP Multi-Factor Authentication"]
    SECURITY --> OTP["Six-Digit OTP"]
    SECURITY --> COOKIE["HttpOnly Cookies"]
    SECURITY --> LOCK["Account Lockout"]
    SECURITY --> RBAC["Role-Based Access Control"]
    SECURITY --> RATE["Redis Rate Limiting"]
    SECURITY --> EMAIL["Email Verification"]

    classDef main fill:#172554,stroke:#60a5fa,color:#fff
    classDef feature fill:#064e3b,stroke:#34d399,color:#fff

    class SECURITY main
    class JWT,ROTATION,MFA,OTP,COOKIE,LOCK,RBAC,RATE,EMAIL feature
```

---

## 05. REFRESH TOKEN ROTATION

```mermaid
flowchart TD
    A["Client sends refresh token"] --> B["Validate refresh token"]
    B --> C{"Token valid?"}

    C -->|No| D["Reject refresh request"]
    C -->|Yes| E{"Token previously used?"}

    E -->|Yes| F["Detect token reuse"]
    F --> G["Revoke entire token family"]
    G --> H["Record security event in audit log"]
    H --> I["Require user to authenticate again"]

    E -->|No| J["Generate new refresh token"]
    J --> K["Mark old token as used"]
    K --> L["Persist new refresh token"]
    L --> M["Generate new access token"]
    M --> N["Return new access token and refresh cookie"]
    N --> O(["Authenticated session continues"])
```

---

## 06. REAL-TIME MULTIPLAYER GAME ARCHITECTURE

```mermaid
flowchart TB
    P1(["PLAYER X"])
    P2(["PLAYER O"])

    subgraph FRONTEND["REACT FRONTEND"]
        B1["Player X Game Board"]
        B2["Player O Game Board"]
        C1["WebSocket Client"]
    end

    subgraph BACKEND["SPRING BOOT BACKEND"]
        WS["WebSocket Endpoint /ws"]
        STOMP["STOMP Message Handler"]
        ROOM["Game Room Management"]
        VALIDATE["Move Validation"]
        STATE["Game State Management"]
    end

    P1 --> B1
    P2 --> B2

    B1 --> C1
    B2 --> C1

    C1 -->|"Join Room / Submit Move"| WS
    WS --> STOMP
    STOMP --> ROOM
    ROOM --> VALIDATE
    VALIDATE --> STATE

    STATE -->|"Updated Game State"| STOMP
    STOMP --> WS
    WS -->|"Broadcast Update"| C1

    C1 --> B1
    C1 --> B2
```

### GAME LIFECYCLE

```mermaid
stateDiagram-v2
    [*] --> RoomCreated

    RoomCreated --> WaitingForPlayer
    WaitingForPlayer --> PlayerJoined
    PlayerJoined --> GameStarted

    GameStarted --> PlayerXTurn
    PlayerXTurn --> PlayerOTurn: Valid move
    PlayerOTurn --> PlayerXTurn: Valid move

    PlayerXTurn --> GameFinished: Win or draw
    PlayerOTurn --> GameFinished: Win or draw

    GameFinished --> RoomReset: Reset requested
    RoomReset --> WaitingForPlayer: New game

    GameFinished --> [*]: Exit room
```

---

## 07. WEBSOCKET EVENT COMMUNICATION

```mermaid
sequenceDiagram
    autonumber

    participant X as Player X
    participant C as React Client
    participant S as Spring WebSocket
    participant H as STOMP Handler
    participant R as Game Room
    participant O as Player O

    X->>C: Join game room
    C->>S: Connect to /ws
    S->>H: Establish STOMP connection

    C->>S: Send /app/game/{roomId}/join
    S->>H: Process join request
    H->>R: Add player to room

    O->>S: Join same room
    S->>H: Process second player
    H->>R: Update room membership

    C->>S: Send /app/game/{roomId}/move
    S->>H: Process player move
    H->>R: Validate and update game

    R-->>H: Updated game state
    H-->>S: Publish game event
    S-->>C: /topic/game/{roomId}
    S-->>O: /topic/game/{roomId}

    C->>S: Send /app/game/{roomId}/reset
    S->>H: Process reset request
    H->>R: Reset game state
    R-->>S: Broadcast reset state
```

---

## 08. DATABASE ARCHITECTURE

```mermaid
flowchart TB
    APP["NEXUS ARENA AUTHENTICATION SERVICE"]

    subgraph DATABASE["POSTGRESQL DATABASE"]
        USERS[("users")]
        ROLES[("roles")]
        USER_ROLES[("user_roles")]
        REFRESH[("refresh_tokens")]
        EMAIL[("email_verification_tokens")]
        RESET[("password_reset_tokens")]
        OTP[("otp_verification")]
        LOGIN[("login_attempts")]
        AUDIT[("audit_logs")]
    end

    APP --> USERS
    APP --> ROLES
    APP --> REFRESH
    APP --> EMAIL
    APP --> RESET
    APP --> OTP
    APP --> LOGIN
    APP --> AUDIT

    USERS --> USER_ROLES
    ROLES --> USER_ROLES

    USERS -.->|"User identity"| REFRESH
    USERS -.->|"Email verification"| EMAIL
    USERS -.->|"Password recovery"| RESET
    USERS -.->|"MFA and OTP"| OTP
    USERS -.->|"Login tracking"| LOGIN
    USERS -.->|"Security activity"| AUDIT
```

### DATABASE TECHNOLOGIES

```mermaid
flowchart LR
    APP["Spring Boot Application"]

    subgraph DATA_LAYER["PERSISTENCE LAYER"]
        JPA["Spring Data JPA"]
        ORM["Hibernate ORM"]
        FLYWAY["Flyway Migrations"]
    end

    DB[("PostgreSQL Database")]

    APP --> JPA
    JPA --> ORM
    ORM <-->|"Read / Write"| DB
    FLYWAY -->|"Schema versioning"| DB
```

---

## 09. BACKEND API ARCHITECTURE

```mermaid
flowchart TB
    ROOT["REST API /api/v1"]

    ROOT --> AUTH["AUTH CONTROLLER"]
    ROOT --> USERS["USER CONTROLLER"]
    ROOT --> ADMIN["ADMIN CONTROLLER"]

    subgraph AUTH_API["AUTHENTICATION ENDPOINTS"]
        A1["POST /register"]
        A2["POST /login"]
        A3["POST /refresh"]
        A4["POST /logout"]
        A5["POST /mfa/verify-login"]
        A6["GET /me"]
        A7["GET /verify-email"]
        A8["POST /forgot-password"]
        A9["POST /reset-password"]
    end

    subgraph USER_API["USER ENDPOINTS"]
        U1["POST /change-password"]
        U2["POST /change-email"]
        U3["POST /mfa/setup"]
        U4["POST /mfa/verify"]
        U5["POST /mfa/disable"]
        U6["POST /otp/send"]
        U7["POST /otp/verify"]
    end

    subgraph ADMIN_API["ADMIN ENDPOINTS - ROLE_ADMIN"]
        D1["GET /"]
        D2["POST /users/{userId}/lock"]
        D3["POST /users/{userId}/unlock"]
        D4["PATCH /users/{userId}/roles"]
    end

    AUTH --> A1
    AUTH --> A2
    AUTH --> A3
    AUTH --> A4
    AUTH --> A5
    AUTH --> A6
    AUTH --> A7
    AUTH --> A8
    AUTH --> A9

    USERS --> U1
    USERS --> U2
    USERS --> U3
    USERS --> U4
    USERS --> U5
    USERS --> U6
    USERS --> U7

    ADMIN --> D1
    ADMIN --> D2
    ADMIN --> D3
    ADMIN --> D4
```

### WEBSOCKET API

```mermaid
flowchart TB
    WS["WebSocket Endpoint /ws"]

    WS --> APP["APPLICATION DESTINATIONS"]
    WS --> TOPIC["SUBSCRIPTION DESTINATIONS"]

    APP --> JOIN["/app/game/{roomId}/join"]
    APP --> MOVE["/app/game/{roomId}/move"]
    APP --> RESET["/app/game/{roomId}/reset"]

    TOPIC --> GAME["/topic/game/{roomId}"]

    JOIN --> HANDLER["STOMP Message Handler"]
    MOVE --> HANDLER
    RESET --> HANDLER

    HANDLER --> BROADCAST["Publish Updated Game State"]
    BROADCAST --> GAME
```

---

## 10. COMPLETE PROJECT DIRECTORY

```mermaid
flowchart TD
    ROOT["nexus-arena"]
    ROOT --> BE["auth-service"]
    ROOT --> FE["authify"]

    BE --> JAVA["src/main/java/com/example/authservice"]
    BE --> RES["src/main/resources"]
    BE --> DOCKER["Dockerfile"]

    JAVA --> CONFIG["config"]
    JAVA --> CONTROLLER["controller"]
    JAVA --> ENTITY["entity"]
    JAVA --> SECURITY["security"]
    JAVA --> SERVICE["service"]
    JAVA --> REPOSITORY["repository"]

    RES --> MIGRATION["db/migration"]
    RES --> YAML["application.yaml"]

    FE --> SRC["src"]
    FE --> TAILWIND["tailwind.config.js"]
    FE --> VITE["vite.config.js"]

    SRC --> API["api"]
    SRC --> COMPONENTS["components"]
    SRC --> CONTEXT["context"]
    SRC --> PAGES["pages"]
    SRC --> ROUTES["routes"]
    SRC --> UTILS["utils"]
```

---

## 11. CLOUD DEPLOYMENT ARCHITECTURE

```mermaid
flowchart TD
    USER(["End User"])

    USER -->|"HTTPS"| VERCEL["Vercel - React Frontend"]

    VERCEL -->|"REST API Requests"| BACKEND["Spring Boot Backend"]
    VERCEL <-->|"WebSocket Connection"| BACKEND

    BACKEND -->|"Database Operations"| DB[("Supabase PostgreSQL")]
    BACKEND -->|"Caching and Rate Limiting"| REDIS[("Upstash Redis")]
    BACKEND -->|"Email Delivery"| SMTP["Gmail SMTP"]

    subgraph HOSTING["BACKEND HOSTING"]
        BACKEND
        HOST["Render or Fly.io"]
    end

    HOST -.-> BACKEND
```

---

## 12. FEATURE COMPLETION MAP

```mermaid
flowchart TD
    ROOT["NEXUS ARENA"]

    ROOT --> SECURITY["SECURITY AND AUTHENTICATION"]
    ROOT --> GAME["MULTIPLAYER GAMING"]
    ROOT --> INFRA["INFRASTRUCTURE"]
    ROOT --> DEPLOY["CLOUD DEPLOYMENT"]

    SECURITY --> S1["RSA-256 JWT Authentication"]
    SECURITY --> S2["Refresh Token Rotation"]
    SECURITY --> S3["Two-Factor Authentication"]
    SECURITY --> S4["OTP Verification"]
    SECURITY --> S5["HttpOnly Cookies"]
    SECURITY --> S6["Account Lockout"]
    SECURITY --> S7["Email Verification"]
    SECURITY --> S8["Role-Based Access Control"]
    SECURITY --> S9["Redis Rate Limiting"]

    GAME --> G1["WebSocket Integration"]
    GAME --> G2["Private Game Rooms"]
    GAME --> G3["6-Digit Room Codes"]
    GAME --> G4["Real-Time Game Updates"]
    GAME --> G5["Victory Animations"]

    INFRA --> I1["PostgreSQL"]
    INFRA --> I2["Redis"]
    INFRA --> I3["Flyway Migrations"]
    INFRA --> I4["Docker"]

    DEPLOY --> D1["Vercel Frontend"]
    DEPLOY --> D2["Cloud Backend"]
    DEPLOY --> D3["Supabase Database"]
    DEPLOY --> D4["Upstash Redis"]
```

---

## 13. LOCAL DEVELOPMENT WORKFLOW

```mermaid
flowchart TD
    START(["Start Development"])

    START --> CLONE["Clone GitHub Repository"]
    CLONE --> CONFIG["Configure Environment"]

    CONFIG --> DB["Start PostgreSQL"]
    CONFIG --> REDIS["Start Redis"]

    DB --> BACKEND["Open auth-service"]
    REDIS --> BACKEND

    BACKEND --> BUILD["Run mvn clean install"]
    BUILD --> RUNBE["Run mvn spring-boot:run"]

    RUNBE --> FRONTEND["Open authify"]
    FRONTEND --> INSTALL["Run npm install"]
    INSTALL --> RUNFE["Run npm run dev"]

    RUNFE --> TEST["Test Authentication and Multiplayer"]
    TEST --> END(["Application Running"])
```

### COMMAND REFERENCE

```bash
# Clone repository
git clone https://github.com/AnshCyberSec/nexus-arena.git

cd nexus-arena

# Backend
cd auth-service
mvn clean install
mvn spring-boot:run

# Frontend - open a separate terminal
cd nexus-arena/authify
npm install
npm run dev
```

---

## 14. ENGINEERING HIGHLIGHTS

```mermaid
mindmap
  root((NEXUS ARENA))
    Backend Engineering
      Java 21
      Spring Boot
      REST APIs
      Spring Security
    Security Engineering
      RSA-256 JWT
      Refresh Token Rotation
      MFA and TOTP
      RBAC
      Rate Limiting
    Real-Time Systems
      WebSocket
      STOMP
      Multiplayer Rooms
      Live Game Updates
    Data Engineering
      PostgreSQL
      Hibernate
      Redis
      Flyway
    Frontend Engineering
      React
      Context API
      Axios
      Tailwind CSS
    Deployment
      Docker
      Vercel
      Render or Fly.io
      Supabase
```

---

## 15. AUTHOR

<div align="center">

### ANSHUMAN DALABE HERA

**Full Stack Developer | Java Backend Developer | Cybersecurity Enthusiast**

[GitHub — AnshCyberSec](https://github.com/AnshCyberSec)

### BUILD. SECURE. CONNECT. COMPETE.

**WELCOME TO NEXUS ARENA.**

⭐ If you like this project, consider giving it a star!

</div>
