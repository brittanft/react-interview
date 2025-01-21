import { query } from "../utils/db";

export const getAccount = async (accountID: string) => {
  const res = await query(`
    SELECT account_number, name, amount, type, credit_limit 
    FROM accounts 
    WHERE account_number = $1`,
    [accountID]
  );

  if (res.rowCount === 0) {
    throw new Error("Account not found");
  }

  return res.rows[0];
};

const dailyWithdrawals: Record<string, Record<string, number>> = {};

// Naive implementation of daily withdrawal tracking in-memory, based on daily "buckets"
export const addDailyWithdrawal = (accountID: string, amount: number) => {
  const today = new Date().toISOString().split("T")[0];
  if (!dailyWithdrawals[today]) {
    dailyWithdrawals[today] = {};
  }

  if (!dailyWithdrawals[today][accountID]) {
    dailyWithdrawals[today][accountID] = 0;
  }

  dailyWithdrawals[today][accountID] += amount;
};

export const getDailyWithdrawalAmount = async (accountID: string): Promise<number> => {
  // TODO implement query against the transaction table

  const today = new Date().toISOString().split("T")[0];
  return dailyWithdrawals?.[today]?.[accountID] || 0;
}