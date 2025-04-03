
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";

interface ProductFiltersProps {
  filterType: string;
  setFilterType: (type: string) => void;
}

const ProductFilters = ({ filterType, setFilterType }: ProductFiltersProps) => {
  const [activeFilter, setActiveFilter] = useState(filterType);

  useEffect(() => {
    setActiveFilter(filterType);
  }, [filterType]);

  const handleFilterChange = (value: string) => {
    setActiveFilter(value);
    setFilterType(value);
  };

  return (
    <div className="w-full overflow-x-auto">
      <Tabs defaultValue={filterType} value={activeFilter} className="w-full">
        <TabsList className="w-full justify-start md:justify-center mb-4">
          <TabsTrigger 
            value="all" 
            onClick={() => handleFilterChange("all")}
            className="data-[state=active]:bg-mediwrap-blue data-[state=active]:text-white"
          >
            All Products
          </TabsTrigger>
          <TabsTrigger 
            value="otc" 
            onClick={() => handleFilterChange("otc")}
            className="data-[state=active]:bg-mediwrap-blue data-[state=active]:text-white"
          >
            Over The Counter
          </TabsTrigger>
          <TabsTrigger 
            value="prescription" 
            onClick={() => handleFilterChange("prescription")}
            className="data-[state=active]:bg-mediwrap-blue data-[state=active]:text-white"
          >
            Prescription Only
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default ProductFilters;
