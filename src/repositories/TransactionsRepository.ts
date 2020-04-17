import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const balance = {
      income: 0,
      outcome: 0,
      total: 0,
    };
    balance.income = this.transactions.reduce(
      (totalIncome = 0, currentTransaction) => {
        return currentTransaction.type === 'income'
          ? totalIncome + currentTransaction.value
          : totalIncome;
      },
      0,
    );

    balance.outcome = this.transactions.reduce(
      (totalOutcome = 0, currentTransaction) => {
        return currentTransaction.type === 'outcome'
          ? totalOutcome + currentTransaction.value
          : totalOutcome;
      },
      0,
    );

    balance.total = balance.income - balance.outcome;

    return balance;
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    if (type === 'outcome' && this.getBalance().total < value) {
      throw Error('The value of outcome is greater than the total balance');
    }

    const transaction = new Transaction({ title, value, type });
    this.transactions.push(transaction);
    return transaction;
  }
}

export default TransactionsRepository;
