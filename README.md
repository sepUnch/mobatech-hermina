<div align="center">

# Mobatech Healthcare Ecosystem

[![Go](https://img.shields.io/badge/Go-1.21%2B-00ADD8?style=flat-square&logo=go&logoColor=white)](https://go.dev/)
[![Flutter](https://img.shields.io/badge/Flutter-3.19-02569B?style=flat-square&logo=flutter&logoColor=white)](https://flutter.dev/)
[![Next.js](https://img.shields.io/badge/Next.js-14%2B-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0%2B-4479A1?style=flat-square&logo=mysql&logoColor=white)](https://www.mysql.com/)

A comprehensive and modular hospital management and telemedicine ecosystem, featuring a robust Go backend API, a glassmorphism CRM portal, an AI-powered diagnostic engine, and a scalable Flutter mobile application for patients.

</div>

---

## Architecture & Technology Stack

The application strictly adheres to a **Microservice-Oriented Architecture** with separated layers for Client, Admin, Core Backend, and AI Processing to ensure maximum scalability and maintainability.

| Layer          | Technologies                                             |
| -------------- | -------------------------------------------------------- |
| Mobile Client  | Flutter, Riverpod, Dio, GoRouter, Secure Storage         |
| CRM Portal     | Next.js (App Router), Tailwind CSS (Glassmorphism), Zustand |
| Core Backend   | Go (Golang), GORM, JWT, AES-256 Encryption               |
| AI & Analytics | Python, DeepMind Gemini, RAG Engine, Vector Search       |
| Persistence    | MySQL2 (Relational), Vector Database (Embeddings)        |

---

## Core Features

- **Blazingly Fast Mobile App:** Pure native-like performance with robust `Riverpod` state management and cached API consumptions for zero-jitter navigation.
- **High-Security Core API:** JWT-based authentication with role-based access control (RBAC) and AES-256 level encryption for all patient sensitive data (PDP Compliance).
- **Glassmorphism CRM Dashboard:** A visually stunning, unified administrative dashboard featuring SSR-first approach, real-time widgets, and smooth micro-animations.
- **Strict Data Validation:** Comprehensive and unified utility formatting (`Formatters.*`) and regex validation (`Validators.*`) on both mobile and web frontends.
- **AI-Powered Diagnostics:** Context-aware RAG Engine connected to Gemini AI capable of analyzing patient symptoms, checking medical records, and scheduling polyclinics automatically.

---

## Installation & Setup Guide

**System Requirements:**
- Go v1.21 or higher
- Node.js v18.0.0 or higher
- Flutter SDK v3.19 or higher
- Python v3.10 or higher
- MySQL v8.0+

### 1. Repository Setup

Clone the repository to your local machine:

```bash
git clone https://github.com/Samaele13/mobatech.git
cd mobatech
```

### 2. Core Backend (Go)

Initialize the Go server and dependencies:

```bash
cd mobatech-backend
go mod tidy
go run main.go
```
*Note: The backend runs on `localhost:8080` by default. It utilizes `start.sh` to scaffold the Super Admin account.*

### 3. CRM Portal (Next.js)

Setup the Web Dashboard:

```bash
cd ../mobatech-crm
npm install
npm run dev
```
*Access the CRM Portal at `http://localhost:3000`.*

### 4. Patient Application (Flutter)

Run the mobile app:

```bash
cd ../mobatech-flutter
flutter pub get
flutter run
```

---

## Production Build

To compile the CRM and Backend for production deployment:

**Web:**
```bash
npm run build
npm run start
```

**Backend:**
```bash
go build -o mobatech-server
./mobatech-server
```

---

## Documentation & Standards

This repository is an **Industry-Ready** boilerplate. It rigorously follows the `AGENTS.md` and `engineering-standards` ensuring:
- Strict typing and explicit null-safety handling across TS, Dart, and Go.
- Component modularity limited to 150-lines maximum per file.
- Unified and centralized design systems, tokens, validators, and formatters.
- Ignored environment secrets, generated binaries, and unhashed assets in `.gitignore`.

---

## Authors

**Raihan Akbar** — [GitHub](https://github.com/rhankbrguw) · [LinkedIn](https://www.linkedin.com/in/raihan-akbar-2b5820334/)

**Ansya Rulloh Vini** — [GitHub](https://github.com/ansyarulloh) · [LinkedIn](https://www.linkedin.com/in/ansya-rulloh-vini-2414302a1/)
