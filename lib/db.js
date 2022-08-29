import { C, G } from '@nuogz/pangu';
import Postgres from '@nuogz/postgresql';



export const DB = process.env.WM_GLOBAL_DB !== 'NONE' ? await new Postgres(C.db, { logger: G }) : null;
