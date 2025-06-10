import React, { useState } from 'react';
import { 
  CreditCard, Receipt, DollarSign,
  Plus, Trash2, Edit3, X, Eye, EyeOff,
  Shield, Clock, CheckCircle, RefreshCw,
  ArrowUpRight, ArrowDownRight, Download
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const PaymentsPage = () => {
  // Payment methods state
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: 'credit',
      brand: 'visa',
      last4: '1234',
      expiryMonth: '12',
      expiryYear: '26',
      holderName: 'Alex Johnson',
      isDefault: true,
      nickname: 'Personal Card'
    },
    {
      id: 2,
      type: 'credit',
      brand: 'mastercard',
      last4: '5678',
      expiryMonth: '09',
      expiryYear: '27',
      holderName: 'Alex Johnson',
      isDefault: false,
      nickname: 'Business Card'
    },
    {
      id: 3,
      type: 'digital',
      brand: 'paypal',
      email: 'alex.johnson@email.com',
      isDefault: false,
      nickname: 'PayPal Account'
    }
  ]);

  // Transaction history
  const [transactions] = useState([
    { id: 'TXN-2025-001', type: 'purchase', amount: 189.99, date: '2025-06-10', status: 'completed', merchant: 'TechStore Pro', paymentMethod: 'Visa ****1234', orderId: 'ORD-2025-001' },
    { id: 'TXN-2025-002', type: 'purchase', amount: 549.98, date: '2025-06-08', status: 'completed', merchant: 'Electronics Hub', paymentMethod: 'Mastercard ****5678', orderId: 'ORD-2025-002' },
    { id: 'TXN-2025-003', type: 'refund',   amount: 129.99, date: '2025-06-05', status: 'processing', merchant: 'Camera World', paymentMethod: 'Visa ****1234', orderId: 'ORD-2025-004' },
    { id: 'TXN-2025-004', type: 'purchase', amount: 89.99,   date: '2025-06-03', status: 'pending',    merchant: 'Gaming Gear', paymentMethod: 'PayPal',            orderId: 'ORD-2025-003' }
  ]);

  const [activeTab, setActiveTab] = useState('methods');
  const [showAddCard, setShowAddCard] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [showCardDetails, setShowCardDetails] = useState({});
  const [newCard, setNewCard] = useState({ cardNumber: '', expiryMonth: '', expiryYear: '', cvv: '', holderName: '', nickname: '', setAsDefault: false });

  const transactionConfig = {
    completed: { color: 'text-green-400', bg: 'bg-green-500/20', icon: CheckCircle, label: 'Completed' },
    pending:   { color: 'text-yellow-400', bg: 'bg-yellow-500/20', icon: Clock,       label: 'Pending' },
    processing:{ color: 'text-blue-400',   bg: 'bg-blue-500/20', icon: RefreshCw,   label: 'Processing' },
    failed:    { color: 'text-red-400',    bg: 'bg-red-500/20', icon: RefreshCw,   label: 'Failed' }
  };

  const cardBrands = {
    visa:       { name: 'Visa',       color: 'bg-blue-600',   textColor: 'text-white' },
    mastercard: { name: 'Mastercard', color: 'bg-red-600',    textColor: 'text-white' },
    amex:       { name: 'Amex',       color: 'bg-green-600',  textColor: 'text-white' },
    paypal:     { name: 'PayPal',     color: 'bg-blue-500',   textColor: 'text-white' }
  };

  const handleAddCard = () => {
    if (newCard.cardNumber && newCard.expiryMonth && newCard.expiryYear && newCard.cvv && newCard.holderName) {
      const card = { id: Date.now(), type: 'credit', brand: 'visa', last4: newCard.cardNumber.slice(-4), expiryMonth: newCard.expiryMonth, expiryYear: newCard.expiryYear, holderName: newCard.holderName, nickname: newCard.nickname || 'New Card', isDefault: newCard.setAsDefault };
      if (newCard.setAsDefault) setPaymentMethods(pm => pm.map(m => ({ ...m, isDefault: false })));
      setPaymentMethods(pm => [...pm, card]);
      setNewCard({ cardNumber: '', expiryMonth: '', expiryYear: '', cvv: '', holderName: '', nickname: '', setAsDefault: false });
      setShowAddCard(false);
      toast.success('Payment method added');
    }
  };

  const handleDeleteCard = id => setPaymentMethods(pm => pm.filter(m => m.id !== id));
  const handleSetDefault = id => setPaymentMethods(pm => pm.map(m => ({ ...m, isDefault: m.id === id })));  
  const toggleCardDetails = id => setShowCardDetails(prev => ({ ...prev, [id]: !prev[id] }));
  const handleViewTransaction = id => console.log('View', id);
  const handleDownloadReceipt = id => console.log('Download', id);

  // Tab contents
  const PaymentMethodsTab = () => (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex justify-between items-center">
        <div><h3 className="text-2xl font-bold text-white">Payment Methods</h3><p className="text-gray-400">Manage your cards and payment options</p></div>
        <button onClick={() => setShowAddCard(true)} className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl"><Plus className="w-5 h-5"/>Add Payment Method</button>
      </div>
      {/* Methods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paymentMethods.map(method => {
          const CardIcon = method.type === 'digital' ? Shield : CreditCard;
          return (
            <div key={method.id} className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 relative">
              {method.isDefault && <div className="absolute top-4 right-4 bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-medium">Default</div>}
              <div className={`w-full h-32 rounded-xl mb-4 p-4 flex flex-col justify-between ${method.type==='digital'? 'bg-gradient-to-r from-blue-500 to-purple-600':'bg-gradient-to-r from-gray-700 to-gray-800'}`}>
                <div className="flex justify-between items-start">
                  <div className={`px-2 py-1 rounded text-xs font-bold ${cardBrands[method.brand]?.color} ${cardBrands[method.brand]?.textColor}`}>{cardBrands[method.brand]?.name}</div>
                  <button onClick={() => toggleCardDetails(method.id)} className="text-white/70 hover:text-white">{showCardDetails[method.id]?<EyeOff className="w-4 h-4"/>:<Eye className="w-4 h-4"/>}</button>
                </div>
                <div className="text-white">
                  {method.type==='digital'? <div className="text-sm">{method.email}</div> : <>
                    <div className="text-lg font-mono tracking-wider mb-1">{showCardDetails[method.id]? `**** **** **** ${method.last4}`: `•••• •••• •••• ${method.last4}`}</div>
                    <div className="text-sm opacity-80">{showCardDetails[method.id]? `${method.expiryMonth}/${method.expiryYear}`:'••/••'}</div>
                  </>}
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="text-white font-medium">{method.nickname}</h4>
                <p className="text-gray-400 text-sm">{method.holderName}</p>
                <div className="flex gap-2">
                  {!method.isDefault && <button onClick={() => handleSetDefault(method.id)} className="flex-1 bg-blue-500/20 text-blue-400 px-3 py-2 rounded-lg text-sm">Set Default</button>}
                  <button onClick={() => setEditingCard(method)} className="bg-gray-600/50 text-gray-300 px-3 py-2 rounded-lg"><Edit3 className="w-4 h-4"/></button>
                  <button onClick={() => handleDeleteCard(method.id)} className="bg-red-500/20 text-red-400 px-3 py-2 rounded-lg"><Trash2 className="w-4 h-4"/></button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Security Notice */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 flex items-start gap-4">
        <Shield className="w-6 h-6 text-blue-400 mt-1"/>
        <div>
          <h4 className="text-blue-400 font-medium mb-2">Your payments are secure</h4>
          <p className="text-gray-300 text-sm">All payment information is encrypted and stored securely. We use industry-standard security measures to protect your financial data.</p>
        </div>
      </div>
      {/* Add Card Modal */}
      {showAddCard && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-md border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Add Payment Method</h3>
              <button onClick={() => setShowAddCard(false)} className="text-gray-400 hover:text-white"><X className="w-6 h-6"/></button>
            </div>
            {/* Form Fields ...similar to original...*/}
            <div className="flex gap-3 mt-6"><button onClick={() => setShowAddCard(false)} className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg">Cancel</button><button onClick={handleAddCard} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg">Add Card</button></div>
          </div>
        </div>
      )}
    </div>
  );

  const TransactionsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h3 className="text-2xl font-bold text-white">Transaction History</h3><p className="text-gray-400">View all your payment transactions</p></div>
        <div className="text-sm text-gray-400">{transactions.length} transactions</div>
      </div>
      <div className="space-y-4">
        {transactions.map(tx => {
          const cfg = transactionConfig[tx.status];
          const isRefund = tx.type === 'refund';
          return (
            <div key={tx.id} className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4"><div className={`p-3 rounded-full ${isRefund? 'bg-green-500/20':'bg-blue-500/20'}`}>{isRefund?<ArrowDownRight className="w-6 h-6 text-green-400"/>:<ArrowUpRight className="w-6 h-6 text-blue-400"/>}</div><div><h4 className="text-white font-semibold">{tx.merchant}</h4><div className="flex items-center gap-4 text-sm text-gray-400"><span>#{tx.id}</span><span>{new Date(tx.date).toLocaleDateString()}</span><span>{tx.paymentMethod}</span></div></div></div>
                <div className="flex items-center gap-6"><div className={`flex items-center gap-2 px-3 py-2 rounded-full ${cfg.bg}`}><cfg.icon className={`w-4 h-4 ${cfg.color}`}/><span className={`${cfg.color} text-sm font-medium`}>{cfg.label}</span></div><div className="text-right"><div className={`${isRefund? 'text-green-400':'text-white'} font-bold text-lg`}>{isRefund? `+ $${tx.amount.toFixed(2)}`:`- $${tx.amount.toFixed(2)}`}</div><div className="text-gray-400 text-sm">{isRefund? 'Refund':'Purchase'}</div></div></div>
              </div>
              <div className="flex gap-3 mt-4 pt-4 border-t border-gray-700/50">
                <button onClick={() => handleViewTransaction(tx.id)} className="flex items-center gap-2 bg-blue-500/20 text-blue-400 px-4 py-2 rounded-lg"><Eye className="w-4 h-4"/>View</button>
                {tx.status==='completed' && <button onClick={() => handleDownloadReceipt(tx.id)} className="flex items-center gap-2 bg-purple-500/20 text-purple-400 px-4 py-2 rounded-lg"><Download className="w-4 h-4"/>Receipt</button>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const BillingTab = () => (
    <div className="space-y-6">
      <div><h3 className="text-2xl font-bold text-white">Billing & Invoices</h3><p className="text-gray-400">Manage billing info and invoices</p></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">[...]</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-8">
      <Toaster position="bottom-center" />
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12"><h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Payments & Billing</h1><p className="text-gray-400 text-lg">Manage your payment methods, view transactions, and handle billing</p></div>
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {['methods','transactions','billing'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl font-semibold transition-colors ${
                activeTab === tab
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {tab === 'methods' && 'Payment Methods'}
              {tab === 'transactions' && 'Transactions'}
              {tab === 'billing' && 'Billing'}
            </button>
          ))}
        </div>
        {activeTab==='methods' && <PaymentMethodsTab />}
        {activeTab==='transactions' && <TransactionsTab />}
        {activeTab==='billing' && <BillingTab />}
      </div>
    </div>
  );
};

export default PaymentsPage;
