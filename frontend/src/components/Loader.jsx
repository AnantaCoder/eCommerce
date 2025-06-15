const Loader = () => {
    return (
        <div className="fixed inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center animate-fade-in">
            <div className="relative flex flex-col items-center justify-center w-full h-full">
                {/* Animated Spinner */}
                <div className="relative mb-8 flex items-center justify-center">
                    <div className="w-20 h-20 border-4 border-gray-700 rounded-full animate-spin border-t-white"></div>
                    <div className="absolute inset-0 w-20 h-20 border-4 border-transparent rounded-full animate-ping border-t-emerald-400/30"></div>
                </div>
                
                {/* Loading Text */}
                <div className="space-y-2 flex flex-col items-center">
                    <h2 className="text-2xl font-bold text-white animate-pulse text-center">
                        Loading Products
                    </h2>
                    <div className="flex items-center justify-center space-x-1">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                </div>
                
                {/* Progress Bar
                <div className="mt-6 w-64 bg-gray-800 rounded-full h-2 overflow-hidden flex items-center justify-center">
                    <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full animate-pulse w-full"></div>
                </div> */}
            </div>
            
            {/* Background Animation */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/10 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
            </div>
        </div>
    );
};
export default Loader