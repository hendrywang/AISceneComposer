# Contributing

Thanks for contributing to AI Scene Composer. The project is in alpha, so small focused pull requests are easiest to
review.

## Development Setup

```bash
corepack enable
corepack prepare pnpm@9.15.3 --activate
pnpm install
pnpm web
```

Before opening a pull request, run:

```bash
pnpm check
```

If that is too broad for a focused change, run the relevant subset and explain what you skipped in the PR.

## Common Contribution: Add a 3D Model

The model library lives in [`packages/resource-library`](packages/resource-library/README.md).

Pattern:

1. Create `packages/resource-library/models/<your-id>/`.
2. Add `meta.json` using one of the templates in `models/_template/`.
3. For real glTF assets, add one self-contained `.glb` with embedded textures.
4. Run:

```bash
pnpm gen
pnpm --filter @asc/resource-library typecheck
pnpm --filter @asc/resource-library check
```

Commit both your source files and the generated files:

- `packages/resource-library/src/generated/catalog.ts`
- `packages/resource-library/CREDITS.md`

## Asset License Rules

Asset licensing is stricter than code licensing.

- Prefer CC0 assets.
- CC-BY assets must include author/source/attribution in `meta.json`.
- Do not submit assets with unclear provenance or redistribution restrictions.
- Do not submit user-uploaded local models from your own scene file unless you have redistribution rights.
- Use `.glb` with embedded textures, not `.gltf` plus loose texture paths.

The repository code is Apache-2.0, but model assets keep their own licenses.

## Pull Request Guidelines

- Keep one topic per PR.
- Include screenshots or exported scene files for visual/editor changes.
- Update docs for user-facing or contributor-facing changes.
- Add tests for pure logic, data transformations, and resource checks.
- Do not commit secrets, local `.env` files, generated `apps/client/public/models`, or private assets.

## Code Style

- TypeScript is strict.
- Formatting is handled by Prettier.
- Linting is handled by ESLint.
- Tests use the Node test runner with `tsx`.

Useful commands:

```bash
pnpm format
pnpm lint
pnpm test
pnpm typecheck
```
