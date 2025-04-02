
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { FormEvent } from "react";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onSearch?: (e: FormEvent) => void;
  placeholder?: string;
}

const SearchBar = ({ 
  searchTerm, 
  setSearchTerm, 
  onSearch, 
  placeholder = "Search by doctor name, specialty, or hospital" 
}: SearchBarProps) => {
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(e);
  };

  return (
    <div className="mt-8 max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
        <div className="flex-grow">
          <Input
            type="text"
            placeholder={placeholder}
            className="w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button type="submit" className="bg-mediwrap-blue hover:bg-mediwrap-blue-light text-white">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </form>
    </div>
  );
};

export default SearchBar;
