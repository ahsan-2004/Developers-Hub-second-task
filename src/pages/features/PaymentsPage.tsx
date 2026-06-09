import React, { useMemo, useState } from 'react';
import { CreditCard, ArrowUpRight, ArrowDownRight, ArrowRight, Wallet } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { useRoleView } from '../../context/RoleViewContext';

interface Transaction {
  id: string;
  amount: string;
  sender: string;
  receiver: string;
  status: 'Completed' | 'Pending' | 'Failed';
  date: string;
}

export const PaymentsPage: React.FC = () => {
  const { user } = useAuth();
  const { viewMode, setViewMode } = useRoleView();
  const [balance, setBalance] = useState(18420);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [recipient, setRecipient] = useState(viewMode === 'investor' ? 'Emerald Ventures' : 'Apex Startup');
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 'tx-1', amount: '$5,000', sender: 'Investor wallet', receiver: 'Seed round', status: 'Completed', date: 'Jun 5' },
    { id: 'tx-2', amount: '$1,200', sender: 'Platform fee', receiver: 'Business Nexus', status: 'Completed', date: 'Jun 4' },
    { id: 'tx-3', amount: '$3,600', sender: 'Investor wallet', receiver: 'Growth round', status: 'Pending', date: 'Jun 2' },
  ]);

  const positiveBalance = balance >= 0;

  const formattedFundFlow = useMemo(() => {
    return viewMode === 'investor'
      ? 'Investor wallet → Entrepreneur equity pool'
      : 'Entrepreneur account ← Investor funding stream';
  }, [viewMode]);

  const pushTransaction = (transaction: Transaction) => {
    setTransactions(prev => [transaction, ...prev]);
  };

  const handleDeposit = () => {
    const amount = Math.max(0, Number(depositAmount));
    if (!amount) return;
    setBalance(prev => prev + amount);
    pushTransaction({
      id: `tx-${Date.now()}`,
      amount: `$${amount.toLocaleString()}`,
      sender: 'Bank transfer',
      receiver: `${user?.role === 'investor' ? 'Investor wallet' : 'Startup wallet'}`,
      status: 'Completed',
      date: 'Today',
    });
    setDepositAmount('');
  };

  const handleWithdraw = () => {
    const amount = Math.max(0, Number(withdrawAmount));
    if (!amount || amount > balance) return;
    setBalance(prev => prev - amount);
    pushTransaction({
      id: `tx-${Date.now()}`,
      amount: `-$${amount.toLocaleString()}`,
      sender: `${user?.role === 'investor' ? 'Investor wallet' : 'Startup wallet'}`,
      receiver: 'Bank transfer',
      status: 'Completed',
      date: 'Today',
    });
    setWithdrawAmount('');
  };

  const handleTransfer = () => {
    const amount = Math.max(0, Number(transferAmount));
    if (!amount || amount > balance) return;
    setBalance(prev => prev - amount);
    pushTransaction({
      id: `tx-${Date.now()}`,
      amount: `-$${amount.toLocaleString()}`,
      sender: `${user?.name}`,
      receiver: recipient,
      status: 'Pending',
      date: 'Today',
    });
    setTransferAmount('');
  };

  const handleFundingCycle = () => {
    const amount = 9500;
    setBalance(prev => prev - amount);
    pushTransaction({
      id: `tx-${Date.now()}`,
      amount: `-$${amount.toLocaleString()}`,
      sender: viewMode === 'investor' ? 'Investor wallet' : user?.name,
      receiver: viewMode === 'investor' ? 'Entrepreneur account' : 'Investor account',
      status: 'Completed',
      date: 'Today',
    });
  };

  if (!user) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-success-100 px-3 py-1 text-sm font-medium text-success-700">
            <CreditCard size={18} /> Wallet & Payments
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-3">Premium Financial Wallet Interface</h1>
          <p className="text-gray-600">Simulate deposits, withdrawals, transfers, and deal funding flows in a clean fintech layout.</p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <Badge variant="success">View mode: {viewMode}</Badge>
          <Button variant="outline" size="sm" onClick={() => {
            const next = viewMode === 'investor' ? 'entrepreneur' : 'investor';
            setViewMode(next);
            setRecipient(next === 'investor' ? 'Emerald Ventures' : 'Apex Startup');
          }}>
            Switch to {viewMode === 'investor' ? 'Entrepreneur' : 'Investor'} View
          </Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Wallet balance</h2>
              <p className="text-sm text-gray-600">Track available funds and recent activity for your current role.</p>
            </div>
            <Badge variant={positiveBalance ? 'success' : 'error'}>
              {positiveBalance ? 'Healthy balance' : 'Low funds'}
            </Badge>
          </CardHeader>
          <CardBody className="grid gap-6">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500">Available balance</p>
                  <p className="text-4xl font-semibold text-gray-900">${balance.toLocaleString()}</p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700">
                  <Wallet size={18} /> {viewMode === 'investor' ? 'Investor Wallet' : 'Startup Wallet'}
                </div>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
                <p className="text-sm font-semibold text-gray-900">Deposit</p>
                <div className="mt-3 flex gap-2">
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={e => setDepositAmount(e.target.value)}
                    placeholder="Amount"
                    className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                  />
                </div>
                <Button className="mt-4" fullWidth onClick={handleDeposit}>Deposit</Button>
              </div>
              <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
                <p className="text-sm font-semibold text-gray-900">Withdraw</p>
                <div className="mt-3 flex gap-2">
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={e => setWithdrawAmount(e.target.value)}
                    placeholder="Amount"
                    className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                  />
                </div>
                <Button className="mt-4" variant="outline" fullWidth onClick={handleWithdraw} disabled={!withdrawAmount || Number(withdrawAmount) > balance}>Withdraw</Button>
              </div>
              <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
                <p className="text-sm font-semibold text-gray-900">Transfer</p>
                <div className="mt-3 space-y-3">
                  <input
                    type="number"
                    value={transferAmount}
                    onChange={e => setTransferAmount(e.target.value)}
                    placeholder="Amount"
                    className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                  />
                  <input
                    type="text"
                    value={recipient}
                    onChange={e => setRecipient(e.target.value)}
                    placeholder="Recipient"
                    className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                  />
                </div>
                <Button className="mt-4" fullWidth onClick={handleTransfer} disabled={!transferAmount || Number(transferAmount) > balance}>Transfer</Button>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-slate-50 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Funding deal flow</h3>
                  <p className="mt-2 text-sm text-gray-600">Simulate a direct move from investor funds into entrepreneur growth capital.</p>
                </div>
                <Button variant="secondary" size="sm" leftIcon={<ArrowRight size={16} />} onClick={handleFundingCycle}>
                  Launch funding flow
                </Button>
              </div>
              <div className="mt-4 space-y-2 rounded-3xl bg-white p-4 text-sm text-gray-600">
                <p>{formattedFundFlow}</p>
                <p className="text-sm text-gray-500">This demo models a deal transfer from one role view into the other.</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Transaction history</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {transactions.length === 0 ? (
                <p className="text-gray-600">No transactions yet. Perform a deposit or transfer to populate the ledger.</p>
              ) : (
                <div className="space-y-4">
                  {transactions.slice(0, 5).map(transaction => (
                    <div key={transaction.id} className="rounded-3xl border border-gray-200 bg-white p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{transaction.amount}</p>
                          <p className="mt-1 text-xs uppercase tracking-wide text-gray-500">{transaction.date}</p>
                        </div>
                        <Badge variant={transaction.status === 'Completed' ? 'success' : transaction.status === 'Pending' ? 'warning' : 'error'}>
                          {transaction.status}
                        </Badge>
                      </div>
                      <p className="mt-3 text-sm text-gray-600">{transaction.sender} → {transaction.receiver}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
