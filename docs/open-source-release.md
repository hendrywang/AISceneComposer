# Open-Source Release Guide

This document captures the recommended release posture for publishing AI Scene Composer on GitHub.

## License Choice

Recommendation: **Apache License 2.0** for repository code.

Why:

- It is permissive like MIT: users can use, modify, distribute, and use the code commercially.
- It includes an explicit patent grant from contributors.
- It has a patent termination clause if someone starts patent litigation over the work.
- It keeps trademark rights separate.
- It is compatible with accepting outside contributions without a separate CLA for most small projects, because
  inbound contributions are licensed under the same terms unless explicitly stated otherwise.

MIT is simpler and shorter. It is a good default for small libraries, but it does not include the same explicit patent
language. For an AI/3D generation tool that may grow into a commercial product or receive outside contributions,
Apache-2.0 is the more defensive default.

This is an engineering recommendation, not legal advice.

## Asset Licensing

The code license does not automatically cover model assets.

Rules:

- Repository code: Apache-2.0.
- Primitive models created in this repository: Apache-2.0 unless otherwise noted.
- Third-party glTF/GLB assets: license declared in `models/<id>/meta.json`.
- Generated attribution summary: `packages/resource-library/CREDITS.md`.

Do not accept a model contribution unless redistribution rights are clear.

## Before Making the Repository Public

Required:

- [ ] `LICENSE` exists and GitHub detects Apache-2.0.
- [ ] `NOTICE` explains the code/asset license boundary.
- [ ] `README.md` explains status, setup, commands, and license.
- [ ] `CONTRIBUTING.md` explains asset contribution and license rules.
- [ ] `SECURITY.md` has a private reporting path.
- [ ] `CODE_OF_CONDUCT.md` exists.
- [ ] GitHub Actions CI passes.
- [ ] `pnpm check` passes locally.
- [ ] Generated resource files are up to date after `pnpm gen`.
- [ ] No secrets or private assets are committed.

Recommended GitHub settings:

- Enable branch protection for `main`.
- Require the CI workflow before merge.
- Enable Dependabot security updates.
- Add topics: `threejs`, `expo`, `react-native-web`, `gltf`, `ai-image-generation`, `scene-composer`.
- Start with Issues enabled; enable Discussions later only if there is enough community traffic.

## First Release

Use an alpha tag until cloud persistence and production generation are stable:

```bash
git tag v0.1.0-alpha
git push origin v0.1.0-alpha
```

Call out that APIs, scene snapshot format, and resource metadata may change before `1.0.0`.
