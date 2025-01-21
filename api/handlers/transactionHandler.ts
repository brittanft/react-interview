import { query } from "../utils/db";
import { addDailyWithdrawal, getAccount, getDailyWithdrawalAmount } from "./accountHandler";

const WITHDRAWAL_LIMIT = 200;
const DAILY_WITHDRAWAL_LIMIT = 400;

export const withdrawal = async (accountID: string, amount: number) => {
  // A customer can withdraw no more than $200 in a single transaction.
  if (amount > WITHDRAWAL_LIMIT) {
    throw new Error(`Amount must be less than or equal to $${WITHDRAWAL_LIMIT}`);
  }

  // A customer can withdraw any amount that can be dispensed in $5 bills.
  if (amount % 5 !== 0) {
    throw new Error("Amount must be divisible by 5");
  }

  const account = await getAccount(accountID);

  // The customer cannot withdraw more than they have in their account, unless it is a credit account.
  // If it is a credit account, they cannot withdraw more than their credit limit.
  if (
    account.type !== "credit" && account.amount < amount || 
    account.type === "credit" && account.credit_limit + account.amount < amount
  ) {
    throw new Error("Insufficient funds");
  }

  // A customer can withdraw no more than $400 in a single day. 
  const dailyWithdrawalAmount = await getDailyWithdrawalAmount(accountID);
  if (dailyWithdrawalAmount + amount > DAILY_WITHDRAWAL_LIMIT) {
    throw new Error(`Daily withdrawal limit exceeded. You can only withdraw $${DAILY_WITHDRAWAL_LIMIT} per day`);
  }

  account.amount -= amount;

  const res = await query(`
    UPDATE accounts
    SET amount = $1 
    WHERE account_number = $2`,
    [account.amount, accountID]
  );

  if (res.rowCount === 0) {
    throw new Error("Transaction failed");
  }

  addDailyWithdrawal(accountID, amount);
  // TODO add transaction record

  return account;
}

const DEPOSIT_LIMIT = 1000;

export const deposit = async (accountID: string, amount: number) => {
  // A customer cannot deposit more than $1000 in a single transaction.
  if (amount > DEPOSIT_LIMIT) {
    throw new Error(`Amount must be less than or equal to $${DEPOSIT_LIMIT}`);
  }

  const account = await getAccount(accountID);

  // If this is a credit account, the customer cannot deposit more in their account than is needed to 0 out the account.
  if (account.type === "credit" && account.amount + amount > 0) {
    throw new Error("Cannot deposit more than needed to zero out the account");
  }

  account.amount += amount;

  const res = await query(`
    UPDATE accounts
    SET amount = $1 
    WHERE account_number = $2`,
    [account.amount, accountID]
  );

  if (res.rowCount === 0) {
    throw new Error("Transaction failed");
  }

  // TODO add transaction record

  return account;
}