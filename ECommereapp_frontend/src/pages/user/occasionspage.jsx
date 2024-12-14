import { useState } from 'react';
import { Search, Cake, Heart, Gift, Sparkles, Music, Utensils, GraduationCap } from 'lucide-react';
import Navbar from '../../components/user/navbar/navbar';
import { Helmet } from "react-helmet";

const occasions = [
  { id: 1, title: 'Birthdays', Icon: Cake },
  { id: 2, title: 'Weddings', Icon: Heart },
  { id: 3, title: 'Holidays', Icon: Gift },
  { id: 4, title: 'Anniversaries', Icon: Sparkles },
  { id: 5, title: 'Parties', Icon: Music },
  { id: 6, title: 'Dinner Events', Icon: Utensils },
  { id: 7, title: 'Graduations', Icon: GraduationCap },
  { id: 8, title: 'Other Occasions', Icon: Gift },
];

export default function OccasionsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOccasions = occasions.filter((occasion) =>
    occasion.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
    <Helmet>
      <title>Occasions | Mera Bestie</title>
    </Helmet>
      <Navbar />
      <div className="min-h-screen bg-pink-50 py-12 px-4 sm:px-6 lg:px-8 animate-fadeIn">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-8 animate-bounceIn">
            Shop by Occasion
          </h1>

          <div className="flex justify-center mb-8">
            <SearchInput value={searchTerm} onChange={setSearchTerm} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredOccasions.map((occasion) => (
              <OccasionCard
                key={occasion.id}
                title={occasion.title}
                Icon={occasion.Icon}
                className="transform transition duration-500 hover:scale-105 hover:shadow-2xl animate-float"
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function SearchInput({ value, onChange }) {
  return (
    <div className="relative animate-slideDown">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-pink-500 focus:outline-none"
        placeholder="Search occasions..."
      />
      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
    </div>
  );
}

function OccasionCard({ title, Icon, className }) {
  return (
    <div
      className={`bg-white p-6 rounded-lg shadow-md text-center ${className}`}
    >
      <Icon className="w-12 h-12 text-pink-500 mx-auto mb-4 animate-pulse" />
      <h3 className="text-lg font-semibold text-gray-700 animate-flipIn">{title}</h3>
    </div>
  );
}
