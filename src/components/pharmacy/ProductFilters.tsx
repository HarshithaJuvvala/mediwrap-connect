
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProductFiltersProps {
  filterType: string;
  setFilterType: (type: string) => void;
}

const ProductFilters = ({ filterType, setFilterType }: ProductFiltersProps) => {
  return (
    <Tabs defaultValue={filterType} className="">
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
  );
};

export default ProductFilters;
