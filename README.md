# Hermina Smart Assistant (Mobatech)

This repository contains the source code and architectural documentation for the Hermina Smart Assistant project, an AI-driven healthcare application integrating a Generative AI (GPT-5) Chatbot, an Anonymization Engine, and the Hospital Information System (SIRS).

## Architecture Overview

The system is built using a Client-Server architecture with a dedicated AI/RAG microservice. The technology stack is separated into three primary components:

1. **Client Layer (Mobile Application)**
   - Built with Flutter.
   - Implements Clean Architecture (Presentation, Domain, Data layers).
   - Handles patient interactions, polyclinic registration, and consultation rendering.

2. **Backend Layer (API Server)**
   - Built with Golang (Gin Framework).
   - Serves as the primary REST API Gateway connecting the mobile client to the database.
   - Manages CRUD operations for master data, schedules, and triggers the synchronization pipeline to the Vector Database.

3. **AI & RAG Engine Layer**
   - Built with Python.
   - Implements the Retrieval-Augmented Generation (RAG) algorithm.
   - Executes Dual-Layer Anonymization (Regex & Named Entity Recognition via BERT) before sending prompts to the public LLM (GPT-5) to ensure compliance with Personal Data Protection (PDP) regulations.

## Repository Structure

```text
mobatech/
├── mobatech-flutter/     # Client Layer: Flutter application source code.
├── mobatech-crm/         # Admin Portal: Next.js/React CRM for hospital staff and master data.
├── mobatech-backend/     # Backend Layer: Golang REST API server source code.
├── mobatech-ai/          # AI Layer: Python scripts for data chunking, embeddings, and RAG search.
├── AGENTS.md             # Crucial engineering constraints, error codes, and strict coding guidelines.
└── CRM_ADMIN_PRD.md      # Product Requirements Document outlining the Next.js/React Admin Web Portal.
```

## Mandatory Reading for Contributors

Before contributing or initializing autonomous agent tasks, all developers and AI agents must review the following contextual documents:

1. **`AGENTS.md`**: This is the strict technical guideline for the project. It dictates the prohibition of hardcoded literals, enforcing regex validations, limiting file lengths, and utilizing specific state management architectures. Failure to adhere to these rules will result in rejected pull requests.
2. **`CRM_ADMIN_PRD.md`**: Provides the functional and non-functional requirements for the CRM Web Admin Portal.

## 🚀 Quick Start & Developer Onboarding

**We employ a strict "One Admin Master Key" philosophy.** To set up your local environment from a clean state (Factory Reset):

1. **Clone the repository** and install dependencies in respective folders (e.g. `npm install` for CRM).
2. **Copy `.env.example`** to `.env` in all four directories (`mobatech-backend`, `mobatech-crm`, `mobatech-flutter`, `mobatech-ai`) and adjust your local credentials.
3. **Execute the Factory Reset Script**:
   ```bash
   cd mobatech-crm
   bash start.sh
   ```
   This script will drop your local database, remigrate tables, and securely inject exactly **one** Super Admin account. No dummy or dirty data is generated.
4. **Login** to the CRM (http://localhost:3000) using:
   - **Email:** `admin@hermina.com`
   - **Password:** `admin123`
5. From the Admin Dashboard, you can manually build your Polyclinics, hire Doctors, and hire Pharmacists via the UI.

Welcome to the Hermina Smart Assistant Ecosystem!
