import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../App';
import api from '../services/api';

export function MerchantWallet() {
  const { navigateTo } = useContext(AppContext);
  const [data, setData] = useState<any>({ walletBalance: 0, recentTransactions: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.users.getWallet().then((res) => setData(res.data || {})).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <button onClick={() => navigateTo('payments-main')} className="mb-4 text-sm text-[#3D8A75]">Back</button>
      <div className="bg-white rounded-2xl p-5 mb-4">
        <p className="text-sm text-gray-500">Wallet Balance</p>
        <p className="text-3xl text-[#102542]">PKR {(data.walletBalance || 0).toLocaleString()}</p>
      </div>
      <div className="bg-white rounded-2xl p-5">
        <p className="text-[#102542] mb-3">Recent Transactions</p>
        {loading ? <p className="text-sm text-gray-500">Loading...</p> : (
          <div className="space-y-2">
            {(data.recentTransactions || []).map((tx: any) => (
              <div key={tx._id} className="border rounded-lg p-3">
                <p className="text-sm text-[#102542]">{tx.description}</p>
                <p className="text-xs text-gray-500">{new Date(tx.createdAt || tx.transactionDate).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
