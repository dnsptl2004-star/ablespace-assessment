#!/bin/bash
set -e

echo "==> Installing all dependencies (including dev)..."
npm install --include=dev

echo "==> Generating Prisma Client..."
npx prisma generate

echo "==> Building NestJS application..."
npx nest build

echo "==> Build completed successfully!"
ls -la dist/
