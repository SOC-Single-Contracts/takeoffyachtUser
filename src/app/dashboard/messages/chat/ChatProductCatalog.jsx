import { Eye } from "lucide-react"

const ChatProductCatalog = ({product}) => {

    const handleViewClick = () => {
        if (product?.productUrl) {
            // Open in a new tab
            window.open(product.productUrl, '_blank');
        }
    }
    
  return (
    <div className="w-[280px] bg-white rounded-lg shadow-lg overflow-hidden relative font-sans">

      {/* Product Image */}
      <div className="w-full h-[200px] bg-gray-50 flex items-center justify-center p-5 relative">
        <img
          src={product?.imageUrl}
          alt="Artisan Bread"
          className="w-full h-full object-contain rounded"
        />
      </div>

      {/* Product Info */}
      <div className="px-5 pt-4 pb-5">
        <h3 className="text-base font-medium text-gray-800 mb-2 t">{product?.name}</h3>

        {/* Price Section */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base font-semibold text-gray-800">${product?.price}</span>
        </div>

        {/* View Button */}
        <div className="flex justify-center">
        <button className="bg-blue-500 border-0 text-white text-sm font-medium cursor-pointer px-4 py-2 rounded-md  transition-all duration-200 flex items-center gap-1.5 hover:bg-blue-600 hover:-translate-y-0.5"
        onClick={handleViewClick}
        >
          <Eye size={16} />
          <span>View</span>
        </button>
        </div>
      </div>
    </div>
  )
}

export default ChatProductCatalog