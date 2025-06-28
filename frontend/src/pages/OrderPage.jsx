import OrderHistory from '../features/order/OrderHistory';

export default function OrderPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* You can add a header or breadcrumbs here if you like */}
      <header className="p-6 border-b border-gray-700">
        <h1 className="text-3xl font-bold">My Orders</h1>
      </header>

      <main className="p-6">
        <OrderHistory />
      </main>
    </div>
  );
}
