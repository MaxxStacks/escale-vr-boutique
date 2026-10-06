# Escale VR Boutique — Shopify theme (boutique.escalevr.ca)

## Deployment path: GitHub only

- This repo is `MaxxStacks/escale-vr-boutique`. Its `main` branch is connected to the Shopify store through
  the Shopify GitHub integration. **A push to `main` is a deploy.** Shopify syncs the theme within about a minute.
- **Never use the Shopify connector / MCP tools (`mcp__claude_ai_Shopify__*`)** for this project. The owner
  manages two Shopify stores and the connector only points at one, so it may target the wrong store.
  It is denied in `.claude/settings.json`. All theme changes go through git.
- Do not edit the theme through the Shopify CLI (`shopify theme push`) either. Git is the single source of truth.

## Workflow for every change

1. `git pull --rebase origin main` before starting. Shopify commits theme-editor changes back to `main`
   as `shopify[bot]`, so the remote often has commits you don't have locally.
2. Edit the theme files.
3. `git add` the specific files, then `git commit`. The local `post-commit` hook pushes to `origin main` automatically.
4. If the push is rejected (Shopify committed in the meantime): `git pull --rebase origin main`, then `git push origin main`.
5. After pushing, confirm with `git status` that the branch is in sync with `origin/main`, and report the commit hash.

## Rules

- `config/settings_data.json` holds the merchant's theme-editor settings and Shopify rewrites it. Edit it only
  when the task requires it, and always on top of the latest pulled version.
- Shopify rejects invalid `{% schema %}` JSON or bad setting defaults, and the sync fails silently on the
  store side. Check schema JSON before committing.
- French (fr-CA) is the default locale. Any new user-facing string goes in both `locales/fr.default.json` and `locales/en.json`.
