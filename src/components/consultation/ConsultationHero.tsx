
import SearchBar from "./SearchBar";

interface ConsultationHeroProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const ConsultationHero = ({ searchTerm, setSearchTerm }: ConsultationHeroProps) => {
  return (
    <div className="bg-gradient-to-br from-mediwrap-blue/10 to-mediwrap-green/10 dark:from-mediwrap-blue/5 dark:to-mediwrap-green/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
            Find and Book Doctor Appointments
          </h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Connect with top healthcare professionals for online or in-person consultations
          </p>
        </div>
        
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>
    </div>
  );
};

export default ConsultationHero;
