import { C } from '@nuogz/pangu';
import Postgres from './PostgreSQL.js';



export const DB = process.env.WM_GLOBAL_DB !== 'NONE' ? await new Postgres(C.db) : null;
