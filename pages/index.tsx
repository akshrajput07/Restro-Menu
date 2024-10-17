import { useEffect, useState } from 'react';
import { supabase } from '@/supabase_config/supabase_config';
import Link from 'next/link';

interface Restaurant {
  id: string;
  created_at: string;
  name: string;
  best_sell_item: string;
  top_five_item: string[];
  email: string;
  phone: string;
}

export default function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRestaurants = async () => {
    setLoading(true);
    setError(null); // Reset error state before fetching
    const { data, error } = await supabase
      .from('Menu')
      .select('*')
      .order('created_at', { ascending: false });

    setLoading(false); // Set loading to false after fetching

    if (error) {
      console.error('Error fetching restaurants:', error);
      setError('Failed to fetch restaurant menus. Please try again.'); // Set error message
    } else {
      setRestaurants(data);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  // Circular loading indicator
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-16 w-16 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Error handling
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-lg text-red-500 mb-4">{error}</p>
        <button 
          onClick={fetchRestaurants}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">Restaurant Menus</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {restaurants.map((restaurant) => {
          // Array of soft colors
          const colors = [
            'bg-red-100',
            'bg-blue-100',
            'bg-green-100',
            'bg-yellow-100',
            'bg-purple-100',
            'bg-pink-100',
          ];
          
          // Pick a random color
          const randomColor = colors[Math.floor(Math.random() * colors.length)];

          return (
            <div
              key={restaurant.id}
              className={`p-4 rounded-lg shadow-md ${randomColor}`} // Added shadow-md for better visibility
            >
              <h2 className="text-xl font-semibold">{restaurant.name}</h2>
              <p className="text-lg">Best Selling: {restaurant.best_sell_item}</p>
              <p className="text-md font-semibold">Our Top 5:</p>
              <ul className="list-disc list-inside mb-2 text-sm">
                {restaurant.top_five_item.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              <p className="text-md">Contact Details:</p>
              <p className="text-md">Phone: {restaurant.phone}</p>
              <p className="text-md">Email: {restaurant.email}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex justify-center">
        <Link href="/subpages/add-menu" className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600">
          Add Your Menu
        </Link>
      </div>
    </div>
  );
}
