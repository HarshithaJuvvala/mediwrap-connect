
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import PrescriptionUpload from "@/components/pharmacy/PrescriptionUpload";

interface PharmacyHeroProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleSearch: (e: React.FormEvent) => void;
}

const PharmacyHero = ({ searchTerm, setSearchTerm, handleSearch }: PharmacyHeroProps) => {
  return (
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
  );
};

export default PharmacyHero;
