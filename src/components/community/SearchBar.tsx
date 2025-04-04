
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onNewPost: () => void;
}

const SearchBar = ({ searchTerm, onSearchChange, onNewPost }: SearchBarProps) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
      <div className="w-full md:w-auto flex-grow relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search discussions..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Button
        className="w-full md:w-auto bg-mediwrap-blue hover:bg-mediwrap-blue-light text-white"
        onClick={onNewPost}
      >
        <MessageSquare className="mr-2 h-4 w-4" />
        Start New Discussion
      </Button>
    </div>
  );
};

export default SearchBar;
