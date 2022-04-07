#!/bin/sh

set -ex
npx prisma migrate deploy
npx prisma db seed
npm run start
