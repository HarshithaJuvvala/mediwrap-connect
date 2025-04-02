
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const SearchBar = ({ searchTerm, setSearchTerm }: SearchBarProps) => {
  return (
    <div className="mt-8 max-w-3xl mx-auto">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-grow">
          <Input
            type="text"
            placeholder="Search by doctor name, specialty, or hospital"
            className="w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button className="bg-mediwrap-blue hover:bg-mediwrap-blue-light text-white">
          Search
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
