import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { ensureSeeded } from './autoSeed';

let prismaInstance: PrismaClient | undefined;

function getPrismaClient(): PrismaClient {
  if (prismaInstance) return prismaInstance;

  const isProduction = process.env.VERCEL || process.env.NODE_ENV === 'production';

  if (isProduction) {
    const tmpDbPath = '/tmp/dev.db';

    // Ensure /tmp directory exists
    try {
      if (!fs.existsSync('/tmp')) {
        fs.mkdirSync('/tmp', { recursive: true });
      }
    } catch (e) {
      console.error('[Prisma] Failed creating /tmp directory:', e);
    }

    let needsCopy = true;
    if (fs.existsSync(tmpDbPath)) {
      try {
        const stats = fs.statSync(tmpDbPath);
        if (stats.size > 1000) {
          needsCopy = false;
        }
      } catch (e) {
        needsCopy = true;
      }
    }

    if (needsCopy) {
      const candidates = [
        path.join(process.cwd(), 'prisma', 'dev.db'),
        path.join(process.cwd(), 'dev.db'),
        path.resolve('./prisma/dev.db'),
        path.resolve('./dev.db'),
      ];

      for (const src of candidates) {
        if (fs.existsSync(src)) {
          try {
            fs.copyFileSync(src, tmpDbPath);
            console.log(`[Prisma] Copied database from ${src} to ${tmpDbPath}`);
            needsCopy = false;
            break;
          } catch (err) {
            console.error(`[Prisma] Error copying database from ${src}:`, err);
          }
        }
      }
    }

    prismaInstance = new PrismaClient({
      datasources: {
        db: {
          url: `file:${tmpDbPath}`,
        },
      },
    });
  } else {
    prismaInstance = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  }

  // Trigger auto-seed check to guarantee products on empty database
  ensureSeeded(prismaInstance).catch((e) => {
    console.error('[Prisma] AutoSeed execution error:', e);
  });

  return prismaInstance;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? getPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
