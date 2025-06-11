import React from 'react'
import Store from '../features/store/Store'


function StorePage() {
  return (
    <div>
      <h1 className="text-4xl text-center p-2 pb-4 font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-orange-500">
        Our Shop 🛒
      </h1>
      <Store/>
    </div>
  )
}

export default StorePage
