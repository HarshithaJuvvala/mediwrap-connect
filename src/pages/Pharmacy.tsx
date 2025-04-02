
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Search, ShoppingCart, Upload, Star, Plus, Minus } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useNavigate } from "react-router-dom";
import PrescriptionUpload from "@/components/pharmacy/PrescriptionUpload";

// Mock data for products - with Indian names for medications
const products = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    category: "Pain Relief",
    price: 59.99,
    rating: 4.8,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
    description: "Relieves mild to moderate pain and reduces fever",
    prescription: false
  },
  {
    id: 2,
    name: "Amoxicillin 250mg",
    category: "Antibiotics",
    price: 125.50,
    rating: 4.5,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
    description: "Treats bacterial infections",
    prescription: true
  },
  {
    id: 3,
    name: "Digital Thermometer",
    category: "Medical Devices",
    price: 159.99,
    rating: 4.7,
    reviews: 203,
    image: "https://images.unsplash.com/photo-1588776814546-daab30f310ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
    description: "Accurate digital thermometer for temperature readings",
    prescription: false
  },
  {
    id: 4,
    name: "Vitamin D 1000 IU",
    category: "Vitamins & Supplements",
    price: 99.99,
    rating: 4.9,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1577969177570-0f77a7c879c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
    description: "Supports bone health and immune function",
    prescription: false
  },
  {
    id: 5,
    name: "BP Monitor",
    category: "Medical Devices",
    price: 459.99,
    rating: 4.6,
    reviews: 78,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
    description: "Home blood pressure monitor for daily readings",
    prescription: false
  },
  {
    id: 6,
    name: "Insulin 100 IU/ml",
    category: "Diabetes Care",
    price: 650.00,
    rating: 4.9,
    reviews: 112,
    image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
    description: "For treatment of diabetes mellitus",
    prescription: true
  },
  {
    id: 7,
    name: "First Aid Kit",
    category: "Medical Supplies",
    price: 249.99,
    rating: 4.8,
    reviews: 245,
    image: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
    description: "Complete kit for emergency first aid",
    prescription: false
  },
  {
    id: 8,
    name: "Face Masks (Pack of 50)",
    category: "Personal Protection",
    price: 189.99,
    rating: 4.7,
    reviews: 320,
    image: "https://images.unsplash.com/photo-1605845328642-7d277d6cfea3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
    description: "Disposable face masks for daily protection",
    prescription: false
  }
];

const Pharmacy = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showCart, setShowCart] = useState(false);
  const [searchResults, setSearchResults] = useState(products);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { cartItems, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, subtotal } = useCart();

  // Update search results whenever search term or filter type changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      // If search term is empty, just apply the filter
      const filtered = filterProducts(products, filterType);
      setSearchResults(filtered);
    } else {
      // Apply both search term and filter
      const filtered = filterProducts(products, filterType).filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filtered);
    }
  }, [searchTerm, filterType]);

  // Filter products based on filter type
  const filterProducts = (productsToFilter, filter) => {
    if (filter === "all") return productsToFilter;
    if (filter === "otc") return productsToFilter.filter(product => !product.prescription);
    if (filter === "prescription") return productsToFilter.filter(product => product.prescription);
    return productsToFilter;
  };

  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleRemoveFromCart = (productId) => {
    removeFromCart(productId);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // The search is already handled by the useEffect
    // This is just to handle the form submission
    
    toast({
      title: "Search results",
      description: `Found ${searchResults.length} products matching "${searchTerm}"`,
    });
  };

  const calculateTotal = () => {
    return subtotal + 50; // Add ₹50 for shipping
  };

  return (
    <Layout>
      {/* Hero section */}
      <div className="bg-gradient-to-br from-mediwrap-blue/10 to-mediwrap-green/10 dark:from-mediwrap-blue/5 dark:to-mediwrap-green/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
              Online Pharmacy & Medicine Delivery
            </h1>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Order prescription medicines and healthcare products for delivery to your doorstep
            </p>
          </div>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            <div className="bg-white dark:bg-card rounded-lg shadow-md p-6 flex flex-col items-center justify-center hover:shadow-lg transition-shadow">
              <PrescriptionUpload />
            </div>
            <div className="bg-white dark:bg-card rounded-lg shadow-md p-6 flex flex-col items-center justify-center hover:shadow-lg transition-shadow">
              <div className="w-full">
                <h3 className="text-lg font-medium mb-4">Search Products</h3>
                <form onSubmit={handleSearch} className="flex">
                  <Input
                    type="text"
                    placeholder="Search medicines and health products"
                    className="w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button type="submit" className="ml-2 bg-mediwrap-blue hover:bg-mediwrap-blue-light text-white">
                    <Search className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <Tabs defaultValue="all" className="">
            <TabsList>
              <TabsTrigger 
                value="all" 
                onClick={() => setFilterType("all")}
              >
                All Products
              </TabsTrigger>
              <TabsTrigger 
                value="otc" 
                onClick={() => setFilterType("otc")}
              >
                Over The Counter
              </TabsTrigger>
              <TabsTrigger 
                value="prescription" 
                onClick={() => setFilterType("prescription")}
              >
                Prescription Only
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Button
            variant="outline"
            className="relative flex items-center border-mediwrap-blue text-mediwrap-blue hover:bg-mediwrap-blue/10"
            onClick={() => setShowCart(!showCart)}
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            View Cart
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-mediwrap-red text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
          </Button>
        </div>
        
        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {searchResults.length > 0 ? (
            searchResults.map((product) => (
              <Card key={product.id} className="overflow-hidden flex flex-col h-full">
                <div className="relative h-48 bg-gray-100 dark:bg-gray-800">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {product.prescription && (
                    <div className="absolute top-2 left-2 bg-mediwrap-blue text-white text-xs px-2 py-1 rounded">
                      Prescription Required
                    </div>
                  )}
                </div>
                <CardContent className="p-4 flex-grow">
                  <div className="mb-2 flex items-center">
                    <span className="text-sm text-mediwrap-green font-medium">{product.category}</span>
                    <div className="ml-auto flex items-center">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span className="ml-1 text-xs text-gray-600 dark:text-gray-400">{product.rating} ({product.reviews})</span>
                    </div>
                  </div>
                  <h3 className="font-medium text-lg mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{product.description}</p>
                  <p className="text-lg font-bold text-mediwrap-blue dark:text-mediwrap-blue-light">₹{product.price.toFixed(2)}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button 
                    className="w-full bg-mediwrap-blue hover:bg-mediwrap-blue-light text-white"
                    onClick={() => handleAddToCart(product)}
                    disabled={product.prescription}
                  >
                    {product.prescription ? "Prescription Required" : "Add to Cart"}
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No products found matching your search criteria.</p>
            </div>
          )}
        </div>
        
        {/* Shopping Cart Sidebar */}
        {showCart && (
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
        )}
      </div>
    </Layout>
  );
};

export default Pharmacy;
