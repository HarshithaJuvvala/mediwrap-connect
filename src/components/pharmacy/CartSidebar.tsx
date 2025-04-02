
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CartItem {
  id: number | string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartSidebarProps {
  showCart: boolean;
  setShowCart: (show: boolean) => void;
  cartItems: CartItem[];
  subtotal: number;
  totalItems: number;
  handleRemoveFromCart: (productId: number | string) => void;
  addToCart: (item: CartItem) => void;
}

const CartSidebar = ({ 
  showCart, 
  setShowCart, 
  cartItems, 
  subtotal, 
  totalItems, 
  handleRemoveFromCart, 
  addToCart 
}: CartSidebarProps) => {
  const navigate = useNavigate();

  const calculateTotal = () => {
    return subtotal + 50; // Add ₹50 for shipping
  };

  if (!showCart) return null;

  return (
    <div className="fixed inset-0 bg-black/20 dark:bg-black/50 z-40 flex justify-end">
      <div className="bg-white dark:bg-gray-900 w-full max-w-md animate-fade-in overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
          <h3 className="text-xl font-semibold">Your Cart</h3>
          <Button variant="ghost" size="sm" onClick={() => setShowCart(false)}>
            &times;
          </Button>
        </div>
        
        <div className="p-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-4 text-gray-600 dark:text-gray-400">Your cart is empty</p>
            </div>
          ) : (
            <div>
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center py-4 border-b border-gray-200 dark:border-gray-800">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="ml-4 flex-grow">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-gray-600 dark:text-gray-400">₹{item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => handleRemoveFromCart(item.id)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="mx-2">{item.quantity}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => addToCart({...item, quantity: 1})}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              <div className="mt-6 py-4 border-t border-gray-200 dark:border-gray-800">
                <div className="flex justify-between mb-4">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-gray-600 dark:text-gray-400">Delivery:</span>
                  <span className="font-medium">₹50.00</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>₹{calculateTotal().toFixed(2)}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <Button 
                    variant="outline"
                    onClick={() => navigate("/cart")}
                  >
                    View Cart
                  </Button>
                  <Button 
                    className="bg-mediwrap-blue hover:bg-mediwrap-blue-light text-white"
                    onClick={() => {
                      navigate("/cart");
                      setShowCart(false);
                    }}
                  >
                    Checkout
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;
