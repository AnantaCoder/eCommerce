import Store from '../features/store/Store'
import {  useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { Crown, Sparkles, ShoppingBag } from 'lucide-react'

function StorePage() {
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const categoryId = params.get("category")
  
  const categories = useSelector((state)=>state.categories.categories)
  const category = categories?.find(cat => String(cat.id) === String(categoryId))

  

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="absolute inset-0 bg-black/20"></div>
      
      <div className="relative z-10">
        <div className="container mx-auto px-2 py-24">
          <div className="text-center mb-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-gold-200 to-gold-400 rounded-full mb-8 shadow-lg shadow-gold-200/30">
              <Crown className="w-10 h-10 text-white" />
            </div>
            
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-gold-200 via-rose-300 to-rose-400 rounded-lg blur opacity-20 transition-all duration-500"></div>
              <h1 className="relative text-5xl md:text-6xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-500 to-rose-400 tracking-tight mb-6">
                ELEGANT EMPORIUM
              </h1>
            </div>
            
            <div className="flex items-center justify-center gap-3 mb-10">
              <Sparkles className="w-5 h-5 text-gold-400" />
              <p className="text-lg text-gray-300 font-serif font-light tracking-wider">
                Refined Style • Exceptional Quality • Curated Luxury
              </p>
              <Sparkles className="w-5 h-5 text-gold-400" />
            </div>

            {categoryId && (
              <div className="mt-12">
                <div className="inline-flex items-center gap-4 bg-gray-800/80 backdrop-blur-md rounded-full px-2 py-3 border border-gold-200/50 shadow-md">
                  <ShoppingBag className="w-6 h-6 text-gold-400" />
                  <span className="text-xl font-serif font-medium text-white">
                    {category ? category.name : "Curating Your Selection..."}
                  </span>
                </div>
              </div>
            )}
          </div>
              
          <div className="relative max-w-6xl mx-auto">
            <Store selectedCategory={category} searchQuery={""}/>
          </div>
        </div>

        <div className="absolute top-20 left-20 w-32 h-32 bg-gold-200/10 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-rose-300/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-1/3 w-36 h-36 bg-rose-400/10 rounded-full blur-xl"></div>
      </div>
    </div>
  )
}

export default StorePage