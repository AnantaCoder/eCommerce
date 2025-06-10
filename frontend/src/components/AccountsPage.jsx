import React, { useState } from 'react';
import { 
  User, 
  Camera, 
  Edit3, 
  Save, 
  X, 
  MapPin, 
  Mail, 
  Phone, 
  Calendar,
  Package,
  Star,
  Eye,
  Download,
  RefreshCw,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Settings,
  Shield,
  CreditCard,
  Bell,
  Heart,
  ShoppingBag
} from 'lucide-react';

const AccountsComponent = () => {
  // User profile state
  const [userProfile, setUserProfile] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    phone: "+1 (555) 123-4567",
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    joinDate: "March 2023",
    address: {
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "United States"
    }
  });

  // Shopping history
  const [shoppingHistory] = useState([
    {
      id: "ORD-2025-001",
      date: "2025-05-15",
      status: "delivered",
      total: 189.99,
      items: [
        {
          name: "Ultra Pro Gaming Headset",
          price: 189.99,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1599669454699-248893623440?w=100&h=100&fit=crop"
        }
      ]
    },
    {
      id: "ORD-2025-002",
      date: "2025-05-10",
      status: "shipped",
      total: 549.98,
      items: [
        {
          name: "Smartwatch Pro Max",
          price: 399.99,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=100&h=100&fit=crop"
        },
        {
          name: "Wireless Earbuds Elite",
          price: 149.99,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=100&h=100&fit=crop"
        }
      ]
    },
    {
      id: "ORD-2025-003",
      date: "2025-04-28",
      status: "processing",
      total: 89.99,
      items: [
        {
          name: "Mechanical Keyboard RGB",
          price: 89.99,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=100&h=100&fit=crop"
        }
      ]
    },
    {
      id: "ORD-2025-004",
      date: "2025-04-15",
      status: "cancelled",
      total: 129.99,
      items: [
        {
          name: "4K Webcam Pro",
          price: 129.99,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=100&h=100&fit=crop"
        }
      ]
    }
  ]);

  // Component states
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(userProfile);

  // Status configurations
  const statusConfig = {
    delivered: {
      color: 'text-green-400',
      bg: 'bg-green-500/20',
      icon: CheckCircle,
      label: 'Delivered'
    },
    shipped: {
      color: 'text-blue-400',
      bg: 'bg-blue-500/20',
      icon: Truck,
      label: 'Shipped'
    },
    processing: {
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/20',
      icon: Clock,
      label: 'Processing'
    },
    cancelled: {
      color: 'text-red-400',
      bg: 'bg-red-500/20',
      icon: AlertCircle,
      label: 'Cancelled'
    }
  };

  // Handlers
  const handleEdit = () => {
    setIsEditing(true);
    setEditForm(userProfile);
  };

  const handleSave = () => {
    setUserProfile(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm(userProfile);
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setEditForm(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setEditForm(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleImageUpload = () => {
    console.log("Image upload functionality would be implemented here");
  };

  const handleViewOrder = (orderId) => {
    console.log(`View order: ${orderId}`);
  };

  const handleReorder = (orderId) => {
    console.log(`Reorder: ${orderId}`);
  };

  const handleDownloadInvoice = (orderId) => {
    console.log(`Download invoice: ${orderId}`);
  };

  // Tab content components
  const ProfileTab = () => (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700/50">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Profile Image */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500/30 shadow-lg">
              <img
                src={isEditing ? editForm.profileImage : userProfile.profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            {isEditing && (
              <button
                onClick={handleImageUpload}
                className="absolute bottom-0 right-0 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
              >
                <Camera className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-bold text-white mb-2">
              {userProfile.name}
            </h2>
            <p className="text-gray-400 mb-2">{userProfile.email}</p>
            <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              Member since {userProfile.joinDate}
            </div>
          </div>

          {/* Edit Button */}
          <div className="flex gap-2">
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-xl transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-xl transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <User className="w-5 h-5" />
          Personal Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Full Name</label>
            {isEditing ? (
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
            ) : (
              <p className="text-white bg-gray-700/50 rounded-lg px-4 py-3">{userProfile.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Email Address</label>
            {isEditing ? (
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
            ) : (
              <p className="text-white bg-gray-700/50 rounded-lg px-4 py-3 flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                {userProfile.email}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Phone Number</label>
            {isEditing ? (
              <input
                type="tel"
                value={editForm.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
            ) : (
              <p className="text-white bg-gray-700/50 rounded-lg px-4 py-3 flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                {userProfile.phone}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Address Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Street */}
          <div className="md:col-span-2">
            <label className="block text-gray-300 text-sm font-medium mb-2">Street Address</label>
            {isEditing ? (
              <input
                type="text"
                value={editForm.address.street}
                onChange={(e) => handleInputChange('address.street', e.target.value)}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
            ) : (
              <p className="text-white bg-gray-700/50 rounded-lg px-4 py-3">{userProfile.address.street}</p>
            )}
          </div>

          {/* City */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">City</label>
            {isEditing ? (
              <input
                type="text"
                value={editForm.address.city}
                onChange={(e) => handleInputChange('address.city', e.target.value)}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
            ) : (
              <p className="text-white bg-gray-700/50 rounded-lg px-4 py-3">{userProfile.address.city}</p>
            )}
          </div>

          {/* State */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">State</label>
            {isEditing ? (
              <input
                type="text"
                value={editForm.address.state}
                onChange={(e) => handleInputChange('address.state', e.target.value)}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
            ) : (
              <p className="text-white bg-gray-700/50 rounded-lg px-4 py-3">{userProfile.address.state}</p>
            )}
          </div>

          {/* Zip Code */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Zip Code</label>
            {isEditing ? (
              <input
                type="text"
                value={editForm.address.zipCode}
                onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
            ) : (
              <p className="text-white bg-gray-700/50 rounded-lg px-4 py-3">{userProfile.address.zipCode}</p>
            )}
          </div>

          {/* Country */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Country</label>
            {isEditing ? (
              <input
                type="text"
                value={editForm.address.country}
                onChange={(e) => handleInputChange('address.country', e.target.value)}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
            ) : (
              <p className="text-white bg-gray-700/50 rounded-lg px-4 py-3">{userProfile.address.country}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const OrdersTab = () => (
    <div className="space-y-6">
      {/* Orders Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-white">Order History</h3>
        <div className="text-sm text-gray-400">
          {shoppingHistory.length} orders found
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {shoppingHistory.map((order) => {
          const StatusIcon = statusConfig[order.status].icon;
          return (
            <div key={order.id} className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
              {/* Order Header */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4 gap-4">
                <div className="flex items-center gap-4">
                  <div>
                    <h4 className="text-white font-semibold text-lg">Order #{order.id}</h4>
                    <p className="text-gray-400 text-sm">
                      Placed on {new Date(order.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Status Badge */}
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-full ${statusConfig[order.status].bg}`}>
                    <StatusIcon className={`w-4 h-4 ${statusConfig[order.status].color}`} />
                    <span className={`text-sm font-medium ${statusConfig[order.status].color}`}>
                      {statusConfig[order.status].label}
                    </span>
                  </div>

                  {/* Total Price */}
                  <div className="text-right">
                    <div className="text-white font-bold text-lg">${order.total.toFixed(2)}</div>
                    <div className="text-gray-400 text-sm">{order.items.length} item{order.items.length > 1 ? 's' : ''}</div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3 mb-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-gray-700/30 rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h5 className="text-white font-medium">{item.name}</h5>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>Quantity: {item.quantity}</span>
                        <span className="text-white font-medium">${item.price.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Actions */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-700/50">
                <button
                  onClick={() => handleViewOrder(order.id)}
                  className="flex items-center gap-2 bg-blue-500/20 text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-500/30 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
                
                {order.status === 'delivered' && (
                  <>
                    <button
                      onClick={() => handleReorder(order.id)}
                      className="flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-lg hover:bg-green-500/30 transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Reorder
                    </button>
                    <button
                      onClick={() => handleDownloadInvoice(order.id)}
                      className="flex items-center gap-2 bg-purple-500/20 text-purple-400 px-4 py-2 rounded-lg hover:bg-purple-500/30 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Invoice
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const SettingsTab = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-white">Account Settings</h3>
      
      <div className="grid gap-6">
        {/* Security Settings */}
        <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security & Privacy
          </h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
              <div>
                <h5 className="text-white font-medium">Two-Factor Authentication</h5>
                <p className="text-gray-400 text-sm">Add an extra layer of security to your account</p>
              </div>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
                Enable
              </button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
              <div>
                <h5 className="text-white font-medium">Change Password</h5>
                <p className="text-gray-400 text-sm">Update your account password</p>
              </div>
              <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">
                Change
              </button>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
              <div>
                <h5 className="text-white font-medium">Order Updates</h5>
                <p className="text-gray-400 text-sm">Get notified about your order status</p>
              </div>
              <div className="w-12 h-6 bg-blue-500 rounded-full p-1 cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
              <div>
                <h5 className="text-white font-medium">Promotional Emails</h5>
                <p className="text-gray-400 text-sm">Receive offers and product updates</p>
              </div>
              <div className="w-12 h-6 bg-gray-600 rounded-full p-1 cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment Methods
          </h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-6 bg-blue-500 rounded text-white text-xs flex items-center justify-center font-bold">
                  VISA
                </div>
                <div>
                  <h5 className="text-white font-medium">**** **** **** 1234</h5>
                  <p className="text-gray-400 text-sm">Expires 12/26</p>
                </div>
              </div>
              <button className="text-red-400 hover:text-red-300 text-sm">Remove</button>
            </div>
            
            <button className="w-full p-4 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:text-white hover:border-gray-500 transition-colors">
              + Add New Payment Method
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            My Account
          </h1>
          <p className="text-gray-400 text-lg">
            Manage your profile, orders, and account settings
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {[
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'orders', label: 'Orders', icon: Package },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50 border border-gray-700/50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && <ProfileTab />}
        {activeTab === 'orders' && <OrdersTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </div>
    </div>
  );
};

export default AccountsComponent;