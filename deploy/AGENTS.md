# AGENTS.md — déploiement

[← Instructions racine](../AGENTS.md) · [README déploiement](./README.md)

## Contexte

**Docker Compose** + **Caddy** (HTTPS) + frontend statique (Nginx) + backend NestJS sur instance type **Scaleway DEV1-S**.

## Fichiers utiles

- [README.md](./README.md) — procédure complète (SSH, secrets, domaine).
- Scripts racine : `pnpm deploy:v2`, `pnpm deploy:scw` (voir `scripts/` à la racine).

## Précautions

- Ne pas committer de secrets ; utiliser les mécanismes documentés (`envmap`, fichiers `.env` non versionnés).
- Après changement d’infra, mettre à jour **ce dossier** et le [README.md](./README.md) associé.
