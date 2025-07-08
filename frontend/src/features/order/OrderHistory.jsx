import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchOrders } from './orderSlice'
import { Loader2, CheckCircle2, Clock, XCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function OrderHistory() {
  
  const dispatch = useDispatch();
  const {
    items,
    status,
    error,
  } = useSelector(state => state.order);

  useEffect(() => {
    dispatch(fetchOrders(1));
  }, [dispatch]);

  const grouped = {
    pending: items.filter(o => o.status === 'pending'),
    success: items.filter(o => o.status === 'success' || o.status === 'completed' || o.status === 'confirmed'),
    failed: items.filter(o => o.status === 'failed'),
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-64 text-white">
        <Loader2 className="animate-spin w-8 h-8 mr-2" /> Loading orders…
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="text-red-400 text-center py-8">
        {error || 'Failed to load orders'}
      </div>
    );
  }

  const sectionVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: i => ({ opacity: 1, y: 0, transition: { delay: i * 0.15 } })
  }

  const cardVariant = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 }
  }

  const renderSection = (key, title, Icon, iconClass) => {
    const list = grouped[key];
    if (!list.length) return null;
    return (
      <motion.div
        custom={key === 'pending' ? 0 : key === 'success' ? 1 : 2}
        initial="hidden"
        animate="visible"
        variants={sectionVariant}
        className="space-y-4"
      >
        <h2 className="text-2xl text-amber-400 flex items-center gap-2">
          <Icon className={iconClass} /> {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {list.map(order => (
              <motion.div
                key={order.id}
                variants={cardVariant}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="bg-gray-800/60 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-gray-700 hover:scale-105 transition-transform"
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold text-white">Order #{order.id}</span>
                  <span className="text-sm text-gray-400">
                    {new Date(order.created_at).toLocaleString()}
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  {order.items.map(line => (
                    <div key={line.id} className="flex justify-between text-gray-200">
                      <span>{line.item_name}</span>
                      <span>× {line.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold">₹{parseFloat(order.total_amount).toLocaleString()}</span>
                  <span className="text-sm uppercase text-gray-400">{order.status}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-12 px-4 md:px-8 border-2 rounded border-b-cyan-900">
      <div className="max-w-7xl mx-auto space-y-12">
        {renderSection('pending', 'Pending Orders', Clock, 'w-6 h-6 text-yellow-400')}
        {renderSection('success', 'Confirmed Orders', CheckCircle2, 'w-6 h-6 text-green-400')}
        {renderSection('failed', 'Failed Orders', XCircle, 'w-6 h-6 text-red-400')}
        {!items.length && (
          <div className="text-gray-500 text-center py-16 text-xl">
            You have no orders yet.
          </div>
        )}
      </div>
    </div>
  );
}
