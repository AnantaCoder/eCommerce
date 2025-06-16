import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { useSelector } from 'react-redux';











const ProfileCard = () => {
  const {user,isAuthenticated} = useSelector(state=>state.auth)
  return (
    <div className="max-w-md mx-auto bg-blue-50 rounded-xl shadow-lg p-6 m-4">
      <div className="text-center justify-center items-center flex">
         <img
          src="https://qph.cf2.quoracdn.net/main-qimg-4075b658494bd13d528f4bfc935d1add-lq"
          alt="Profile"
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover mb-4 border-2 border-blue-200"
        />
        </div>
        <div className='text-center'>
          <h2 className="text-2xl font-bold text-blue-800">{user.first_name} {user.last_name}</h2>
        <p className="text-blue-600 mt-1">{user.email}</p>
      
        </div>
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between bg-blue-100 p-3 rounded-lg">
          <span className="text-blue-700 font-medium">Email Verified:</span>
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <CheckCircle className="text-blue-500" size={20} />
                <span className="text-blue-500">Yes</span>
              </>
            ) : (
              <>
                <XCircle className="text-red-500" size={20} />
                <span className="text-red-500">No</span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between bg-blue-100 p-3 rounded-lg">
          <span className="text-blue-700 font-medium">Seller Account:</span>
          <span className={user.is_seller ? 'text-blue-500' : 'text-blue-600'}>
            {user.is_seller ? 'Yes' : 'No'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;