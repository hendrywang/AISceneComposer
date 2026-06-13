# Changelog

All notable changes to this project will be documented here.

This project follows a lightweight pre-1.0 changelog. Breaking changes may occur
before `1.0.0`; they should still be called out clearly.

## Unreleased

- Close the generation loop: capture the framed preview, POST it to the API, and display/download the AI image in the editor.
- Harden the API: helmet, CORS, per-route rate limiting, image MIME-type validation, and a production guard that ignores `SKIP_AUTH` when `NODE_ENV=production`.
- Fix: forward the uploaded image's real MIME type to the model instead of a hardcoded `image/webp`.
- Add Firebase deploy artifacts (`firebase.json`, `.firebaserc`, `firestore.rules`, `storage.rules`) and a deployment guide.
- Add API route and auth-middleware tests.
- Pin Node to 20 across CI, `.nvmrc`, `.node-version`, and the Docker runtime.
- Prepare repository for open-source release.
- Add file-based resource library, scene save/load, glTF import, and model split support.
