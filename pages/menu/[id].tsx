import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '@/supabase_config/supabase_config';
import Link from 'next/link';
import Image from 'next/image';

interface Restaurant {
  id: string;
  name: string;
  best_sell_item: string;
  top_five_item: Array<{ name: string; price: number }>;
}

interface MenuImage {
  id: string;
  menu_id: string;
  image_url: string;
  description?: string;
  created_at?: string;
}

export default function RestaurantDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [images, setImages] = useState<MenuImage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRestaurantDetails = async (restaurantId: string): Promise<Restaurant | null> => {
    console.log('Fetching details for ID:', restaurantId);
    const { data, error } = await supabase
      .from('Menu')
      .select('*')
      .eq('id', restaurantId)
      .single();

    if (error) {
      console.error('Error fetching restaurant:', error);
      return null;
    }
    
    console.log('Restaurant data:', data);
    return data;
  };

  const fetchMenuImages = async (menuId: string): Promise<MenuImage[]> => {
    console.log('Fetching images for menu_id:', menuId);
    const { data, error } = await supabase
      .from('menuimages')
      .select('*')
      .eq('menu_id', menuId);

    console.log('Images data:', data);
    console.log('Images error:', error);

    if (error) {
      console.error('Error fetching images:', error);
      return [];
    }
    
    return data || [];
  };

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      setLoading(true);
      
      const restaurantId = Array.isArray(id) ? id[0] : id;
      const restaurantData = await fetchRestaurantDetails(restaurantId);
      
      if (restaurantData) {
        setRestaurant(restaurantData);
        const imagesData = await fetchMenuImages(restaurantData.id);
        setImages(imagesData);
      }
      
      setLoading(false);
    };

    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-16 w-16 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-lg text-red-500 mb-4">Restaurant not found</p>
        <Link href="/" className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Link href="/" className="inline-block mb-6 text-blue-500 hover:text-blue-600">
        ← Back to Restaurants
      </Link>
      <h1 className="text-3xl font-bold mb-4">{restaurant.name}</h1>
      <p className="text-lg">Best Selling Item: {restaurant.best_sell_item}</p>
      <h2 className="font-semibold mt-4">Top 5 Items:</h2>
      <ul className="list-disc list-inside">
        {restaurant.top_five_item.map((item, index) => (
          <li key={index}>
            {item.name} - ₹{item.price}
          </li>
        ))}
      </ul>
      <h2 className="font-semibold mt-4">Images:</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {images.map((image) => (
          <div key={image.id} className="p-2 border rounded-lg shadow-md">
            <div className="relative w-full h-48">
              <Image 
                src={image.image_url} 
                alt={image.description || 'Menu image'} 
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            </div>
            {image.description && <p className="text-sm mt-2">{image.description}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
