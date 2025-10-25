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