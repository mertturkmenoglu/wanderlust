import { implement } from '@orpc/server';
import { Health } from '@wanderlust/contract';
import type { Context } from '@/lib/context';

export const os = implement(Health.Contract).$context<Context>();
