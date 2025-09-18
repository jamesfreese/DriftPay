
import { Generated } from 'kysely';

export interface JournalEntriesTable {
  id: Generated<number>;
  user_id: string;
  text: string;
  theme: string | null;
  poetic_line: string | null;
  tokens_earned: number | null;
  clarity_earned: number | null; // This can be removed in a future migration if no longer needed
  timestamp: string;
}

export interface UsersTable {
  user_id: string;
  email: string;
  password_hash: string;
  created_at: string;
  last_login: string | null;
}

export interface SleepLogsTable {
  log_id: string;
  user_id: string;
  start_time: string;
  end_time: string;
  duration: number;
  token_rewarded: boolean;
}

export interface TokenLedgerTable {
  entry_id: string;
  user_id: string;
  timestamp: string;
  source: string;
  amount: number;
  note: string | null;
}

export interface DB {
  journal_entries: JournalEntriesTable;
  users: UsersTable;
  sleep_logs: SleepLogsTable;
  token_ledger: TokenLedgerTable;
}
