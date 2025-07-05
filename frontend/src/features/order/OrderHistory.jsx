import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from './orderSlice';
import OrderCard from './OrderCard';

export default function OrderHistory() {
  const dispatch = useDispatch();
  const { items, status, currentPage, totalPages } = useSelector(state => state.order);

  useEffect(() => {
    dispatch(fetchOrders(1)); // Fetch the first page initially
  }, [dispatch]);

  const pending = items.filter(o => o.status === 'pending');
  const onDelivery = items.filter(o => o.status === 'success');
  const delivered = items.filter(o => o.status === 'delivered');

  const Section = ({ title, list }) => (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-100 mb-2">{title}</h2>
      {list.length ? (
        list.map(o => <OrderCard key={o.id} order={o} />)
      ) : (
        <p className="text-gray-400">No orders here.</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <h1 className="text-2xl text-white mb-6">Your Orders</h1>
      {status === 'loading' && <p className="text-gray-400">Loading…</p>}
      {status === 'failed' && <p className="text-red-500">Failed to load orders.</p>}
      {status === 'succeeded' && (
        <>
          <Section title="Pending" list={pending} />
          <Section title="On Delivery" list={onDelivery} />
          <Section title="Delivered" list={delivered} />
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => dispatch(fetchOrders(currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-gray-300">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => dispatch(fetchOrders(currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}