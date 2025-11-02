## Quick orientation for AI coding agents

This repository is a minimal learning platform scaffold (frontend + backend) intended for containerized deployment to Kubernetes. The single authoritative summary is the top-level `README.md` — read that first.

Key things an agent should know and do first:

- Project shape: README states there is a Node.js + Express backend (TypeScript) and a React + Vite frontend (TypeScript), plus Dockerfiles and Kubernetes manifests. If you need details, search the repo for `Dockerfile`, `k8s`, `kubernetes`, `deployment`, `Ingress`, or `package.json` to find concrete locations.

- Priorities when making code changes:
  - Keep Dockerfiles non-root and small; follow the existing security comments in `README.md`.
  - Preserve the in-memory store patterns used as placeholders (README notes: replace with real DB/object store in production). When adding persistence, add config toggles and clear migration paths.
  - CI/CD is driven by GitHub Actions (README). Any change that affects builds should consider workflows and secrets mentioned in the README (DOCKER_REGISTRY, KUBE_CONFIG, etc.).

- Build/test/run hints (discoverable patterns):
  - Backend: assume standard Node flows (install, build, start) using `package.json` scripts where present. Look for `package.json` files to confirm exact commands.
  - Frontend: Vite + React — expect `npm run dev` / `npm run build` / `npm run preview` if `package.json` exists.
  - Docker/K8s: Dockerfiles and manifests are present per README — prefer building locally with `docker build` and testing images before proposing CI changes.

- Conventions and project-specific notes (from README):
  - No secrets in repo. Use GitHub Secrets for CI and Kubernetes Secrets at runtime. Do not add default credentials.
  - Security and smallest-possible images are priorities: follow existing Dockerfile user/non-root patterns.
  - The repo uses placeholder/stub implementations for ads and auth — modifications should preserve stubs until real integrations are added and documented.

- Integration points to watch for:
  - CI/CD workflows (search `.github/workflows`) — changing build outputs or image names requires updating workflows and possibly README instructions.
  - Kubernetes manifests (search for `deployment`, `service`, `ingress`, `securityContext`) — these declare runtime expectations (ports, image names, security settings).

Examples of useful concrete actions an agent can take
- When adding a new backend endpoint: update backend TypeScript sources, add a matching unit test, and update any API surface docs or README sections. Leave API keys and secrets out of code; instead add notes about required GitHub Secrets.
- When changing Dockerfiles: ensure non-root user and minimal base image are preserved; run a local docker build and smoke-test container start in the README or PR description.

If you can't find a specific file mentioned in README.md:
- Re-scan the repo for `package.json`, `Dockerfile`, or `k8s` manifests. If they don't exist, flag this in the PR and update the README to reflect reality.

Files to check first (in order):
1. `README.md` (project overview and security notes)
2. any `package.json` files (backend and frontend scripts)
3. `Dockerfile`(s) and `docker-compose` if present
4. Kubernetes manifests (deployments/services/ingress)
5. `.github/workflows/*` for CI/CD expectations

When submitting changes:
- Keep PR descriptions focused: what changed, why (security/deployment implications), and what secrets/workflow updates are required.
- Include minimal manual verification steps in the PR (how to run locally, smoke tests), and add/update tests if runtime behavior changed.

If anything in this file is unclear or you want the agent to be more prescriptive (for example: exact commands to run locally, or file paths to use for backend/frontend), tell me which area to expand and I'll update this guidance.
