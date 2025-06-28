import TimerBar from "./TimeBar";

export default function OrderCard({ order }) {
  const { status, total_amount, created_at, items } = order;
  const statusStyles = {
    pending: 'text-yellow-400',
    on_delivery: 'text-blue-400',
    delivered: 'text-green-400',
    success: 'text-green-400',
  };

  let displayStatus = status;
  if (status === 'success') displayStatus = 'on_delivery';

  return (
    <div className="bg-gray-800 p-4 rounded-2xl shadow-md mb-4">
      <div className="flex justify-between items-center">
        <span className={`font-semibold ${statusStyles[displayStatus]}`}>
          {displayStatus.replace('_', ' ').toUpperCase()}
        </span>
        <span className="text-gray-300">₹{total_amount}</span>
      </div>
      <ul className="mt-2 text-gray-200">
        {items.map(i => (
          <li key={i.id} className="text-sm">
            {i.quantity}× {i.item_name} ({i.manufacturer})
          </li>
        ))}
      </ul>
      {status === 'success' && <TimerBar createdAt={created_at} />}
    </div>
  );
}
