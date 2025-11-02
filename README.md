# SmartBee — Starter full-stack scaffold

This repository now contains a minimal Next.js (App Router) + TypeScript + Tailwind starter for the SmartBee learning & services site.

Key files added:
- `app/` — Next.js App Router pages and layout
- `components/` — small reusable components (NavBar, Footer, Card, forms)
- `app/api/` — route handlers for contact and service requests (placeholders)
- `lib/firebase.ts` — Firebase initializer (requires env vars)
- `.env.example` — example env variables for Firebase

Local run
1. Install dependencies: `npm install`
2. Run dev server: `npm run dev`

Notes & next steps
- API routes are placeholders that log to console — hook them to Firestore using `lib/firebase.ts` and server-side calls.
- Install the rest of the UI libs you want (ShadCN UI, lucide-react already in package.json). Run `npm i` to install.
- Configure `FIREBASE_*` env vars for real Firestore persistence.

Auth & API notes
- This scaffold now requires users to be signed in to submit contact or service-request forms. The client uses the Firebase client SDK to sign in with Google and sends the ID token in the Authorization header.
- On the server the API routes verify the ID token using `firebase-admin` and store the submitting user's `uid` and `email` on the document. Make sure `FIREBASE_SERVICE_ACCOUNT` (base64-encoded service account JSON) and the `NEXT_PUBLIC_FIREBASE_*` vars are set in your environment.
# SmartBee — Learning Platform

Minimal scaffold for a learning platform (frontend + backend) designed for Kubernetes deployment with security best-practices and automation (CI/CD, Dependabot). Replace placeholder secrets and storage with production-grade services (managed DB, object store, secret manager).

What's included
- backend: Node.js + Express (TypeScript) with secure middleware, ads API and auth stub
- frontend: React + Vite (TypeScript) with ads display and admin UI stub
- Dockerfiles for backend and frontend (non-root user, small base)
- Kubernetes manifests (Deployment, Service, Ingress) with securityContext
- GitHub Actions workflow for CI/CD and deploy to cluster using secrets
- Dependabot config for automated dependency updates

Security notes
- No secrets in repo. Use GitHub Secrets / Secret Manager in CI and Kubernetes secrets for runtime.
- Use image scanning and vulnerability checks in CI (add Snyk/Trivy in workflow)
- Use TLS via Ingress / cert-manager in cluster

How to use
1. Create GitHub Secrets: DOCKER_REGISTRY, DOCKER_USERNAME, DOCKER_PASSWORD, KUBE_CONFIG (base64 of kubeconfig)
2. Push and let GitHub Actions build images and deploy to cluster
3. Replace in-memory stores with a real DB and object store (S3/GCS)


####################
SMARTBEE — Full-Stack Website Generation Prompt

Prompt:

Build a full-stack responsive website named SmartBee — a modern learning and automation platform — using the Next.js 14 App Router, TypeScript, and Tailwind CSS.

🧠 Purpose

SmartBee serves a dual purpose:

Learning Platform:
Host high-quality educational content for DevOps, SRE, AIOps, and MLOps learners — including videos, notes, and guided projects.

Professional Services:
Provide consulting and implementation services for companies — including infrastructure automation, CI/CD pipelines, AIOps-based monitoring, and MLOps deployment solutions.

🧩 Architecture & Tech Stack

Frontend: Next.js 14 + TypeScript + Tailwind CSS

UI Library: ShadCN/UI + Lucide-react icons

State Management: React Query or Zustand

Backend: Next.js API routes (or optional Node.js/Express layer if needed)

Database: Firebase Firestore (for simplicity) or PostgreSQL via Prisma ORM

Auth: Firebase Auth (Email + Google login)

Deployment: Vercel (frontend) + Firebase (backend + database)

🖥️ Pages & Features
1. Home Page (/)

Modern hero banner:
“Empowering Engineers. Automating the Future.”

Two main CTAs:

Explore Learning → /learn

Get Services → /services

Quick intro: “SmartBee bridges the gap between learning and automation excellence.”

Animated illustrations or subtle bee motif (yellow/black accent)

2. Learning Page (/learn)

Four sections (cards or tabs):

DevOps

SRE

AIOps

MLOps

Each section displays:

Title, description, difficulty (Beginner/Intermediate/Advanced)

List of materials: video link, notes, and downloadable resources

Add “Start Learning” button linking to /dashboard (for logged-in users)

Optional: “AI Tutor” placeholder component for chatbot integration later

3. Services Page (/services)

Highlight SmartBee’s offerings:

Infrastructure automation

CI/CD pipeline design

Cloud monitoring using AIOps

MLOps model deployment

Use cards with icons and CTA buttons.

Include “Request Consultation” form:

Name, Email, Company, Service type, Message

On submit → Save to Firestore collection serviceRequests

4. About Page (/about)

Mission:
“To bridge learning and automation through intelligent DevOps and AI-driven solutions.”

Team cards with role and tech stack expertise

Add subtle motion/hover effects.

5. Contact Page (/contact)

Simple contact form:

Name, Email, Message

Dropdown: “Learning Support” or “Service Inquiry”

Store submissions in Firestore collection contacts

Footer with:

SmartBee © {year}

LinkedIn, GitHub, Twitter icons

“Privacy Policy” and “Terms” links

6. Dashboard (/dashboard)

Accessible only for logged-in users

Display enrolled learning modules, progress tracking

Option to save notes or mark topics complete

For company clients, show ticket status for requested services

🎨 Design Guidelines

Colors: Honey Yellow (#FACC15), Black, and White with subtle gradients

Use glassmorphism or soft shadows

Rounded corners (2xl) and grid layout

Typography: Inter or Poppins font

Smooth animations with Framer Motion

⚙️ Backend Functionality

API Routes in /app/api/... for:

POST /api/contact → save contact form

POST /api/service-request → save service form

GET /api/materials → fetch learning materials

Firebase setup:

Auth: email/password + Google sign-in

Firestore: collections users, materials, contacts, serviceRequests

🧰 Bonus Features (Optional)

AI Chatbot (“Ask SmartBee”) floating widget (use OpenAI API placeholder)

Blog section /blog with latest DevOps and AIOps trends (Markdown based)

Admin Panel /admin to add or manage learning materials

🎯 Goal

Generate clean, modular, and production-ready full-stack code for SmartBee:

Follow Next.js 14 folder structure (app/ router)

Include reusable components for navigation, footer, forms, and cards

Include environment variable setup (.env.example)

Ready for deployment on Vercel + Firebase

Output Expected:

Source code with clear folder structure

README.md with setup steps

Sample .env.example

Optional seed data for learning content