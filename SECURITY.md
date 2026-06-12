# Security Policy

## Supported Versions

AI Scene Composer is currently pre-1.0 alpha software. Security fixes target the
latest `main` branch unless a maintained release branch is explicitly announced.

## Reporting a Vulnerability

Please do not open a public issue for a suspected vulnerability.

Report privately by emailing `hendry@innofun.digital` with:

- A short description of the issue and affected area.
- Reproduction steps or proof-of-concept details.
- Any known impact, affected versions, and suggested mitigation.

We aim to acknowledge reports within 7 days. Public disclosure should wait until
a fix or mitigation is available.

## Scope

In scope:

- API authentication, secret handling, and upload handling.
- Stored scene files and imported glTF/GLB handling.
- Firebase or Cloud Run deployment guidance in this repository.

Out of scope:

- Vulnerabilities in third-party services or model providers.
- User-provided assets whose original source, license, or content is outside
  this repository.
