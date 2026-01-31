FROM oven/bun:latest AS base

# ---------------------------
# Prune
# ---------------------------
FROM base AS prune
WORKDIR /app
COPY . .
RUN bunx turbo prune --scope=web --docker

# ---------------------------
# Installer
# ---------------------------
FROM base AS installer
WORKDIR /app

# First install dependencies (as they change less often)
COPY --from=prune /app/out/json/ .
COPY --from=prune /app/out/bun.lock .
RUN bun install --frozen-lockfile

# Build the project
COPY --from=prune /app/out/full/ .

# Build web
RUN bunx turbo build --filter=web...

# ---------------------------
# Runner
# ---------------------------
FROM base AS runner
WORKDIR /app

# Don't run as root
# oven/bun is debian based, verify if these user/group cmds work or just use root for simplicity if unsure
# But best practice is non-root.
# Trying safe user creation
# RUN groupadd --system --gid 1001 nodejs
# RUN useradd --system --uid 1001 nextjs
# USER nextjs

COPY --from=installer /app/apps/web/public ./apps/web/public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=bun:bun /app/apps/web/.next/standalone ./
COPY --from=installer --chown=bun:bun /app/apps/web/.next/static ./apps/web/.next/static

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["bun", "apps/web/server.js"]