FROM oven/bun:latest AS base

# ---------------------------
# Prune
# ---------------------------
FROM base AS prune
WORKDIR /app
COPY . .
RUN bunx turbo prune --scope=server --docker

# ---------------------------
# Installer
# ---------------------------
FROM base AS installer
WORKDIR /app

# First install dependencies
COPY --from=prune /app/out/json/ .
COPY --from=prune /app/out/bun.lock .
RUN bun install --frozen-lockfile

# Build the project
COPY --from=prune /app/out/full/ .

# Generate Prisma Client
RUN bunx turbo db:generate

# Build server
RUN bunx turbo build --filter=server...

# ---------------------------
# Runner
# ---------------------------
FROM base AS runner
WORKDIR /app

# Don't run as root
# USER bun

COPY --from=installer /app/ .

EXPOSE 3000

CMD ["bun", "apps/server/dist/index.mjs"]