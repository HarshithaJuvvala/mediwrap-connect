
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/useCart";
import { useNavigate } from "react-router-dom";

// Import pharmacy components
import PharmacyHero from "@/components/pharmacy/PharmacyHero";
import ProductFilters from "@/components/pharmacy/ProductFilters";
import ProductGrid from "@/components/pharmacy/ProductGrid";
import CartButton from "@/components/pharmacy/CartButton";
import CartSidebar from "@/components/pharmacy/CartSidebar";

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

  return (
    <Layout>
      {/* Hero section with search and upload */}
      <PharmacyHero 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        handleSearch={handleSearch} 
      />
      
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <ProductFilters filterType={filterType} setFilterType={setFilterType} />
          <CartButton totalItems={totalItems} onClick={() => setShowCart(!showCart)} />
        </div>
        
        {/* Product Grid */}
        <ProductGrid products={searchResults} handleAddToCart={handleAddToCart} />
        
        {/* Shopping Cart Sidebar */}
        <CartSidebar
          showCart={showCart}
          setShowCart={setShowCart}
          cartItems={cartItems}
          subtotal={subtotal}
          totalItems={totalItems}
          handleRemoveFromCart={handleRemoveFromCart}
          addToCart={addToCart}
        />
      </div>
    </Layout>
  );
};

export default Pharmacy;
