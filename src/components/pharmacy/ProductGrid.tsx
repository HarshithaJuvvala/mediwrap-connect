
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Star } from "lucide-react";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  prescription: boolean;
}

interface ProductGridProps {
  products: Product[];
  handleAddToCart: (product: Product) => void;
}

const ProductGrid = ({ products, handleAddToCart }: ProductGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.length > 0 ? (
        products.map((product) => (
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
  );
};

export default ProductGrid;
