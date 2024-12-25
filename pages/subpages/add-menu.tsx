// pages/add-menu.tsx
import { useState } from 'react';
import { supabase } from '@/supabase_config/supabase_config';
import { useRouter } from 'next/router';

export default function AddMenu() {
  const router = useRouter();
  const [newRestaurant, setNewRestaurant] = useState({
    name: '',
    best_sell_item: '',
    top_five_items: ['', '', '', '', ''], // Initialize with five empty strings
    email: '',
    phone: ''
  });

  const addRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase
      .from('Menu')
      .insert([{ 
        name: newRestaurant.name, 
        best_sell_item: newRestaurant.best_sell_item, 
        top_five_item: newRestaurant.top_five_items, // Directly use the array
        email: newRestaurant.email, 
        phone: newRestaurant.phone 
      }]);

    if (error) {
      console.error('Error adding restaurant:', error);
    } else {
      router.push('/');
    }
  };

  const handleTopFiveChange = (index: number, value: string) => {
    const updatedTopFive = [...newRestaurant.top_five_items];
    updatedTopFive[index] = { name: value, price: "10" }; // Update the specific item as an object
    setNewRestaurant({ ...newRestaurant, top_five_items: updatedTopFive });
};


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">Add a New Restaurant Menu</h1>
      <form onSubmit={addRestaurant} className="space-y-4">
      <h2 className="font-semibold">Basic Details:</h2>
        <input
          type="text"
          placeholder="Restaurant Name"
          value={newRestaurant.name}
          onChange={(e) => setNewRestaurant({ ...newRestaurant, name: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg"
          required
        />
        <input
          type="text"
          placeholder="Best Selling Item"
          value={newRestaurant.best_sell_item}
          onChange={(e) => setNewRestaurant({ ...newRestaurant, best_sell_item: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg"
          required
        />
        <h2 className="font-semibold">Top 5 Items:</h2>
        {newRestaurant.top_five_items.map((item, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Item ${index + 1}`}
            value={item.name}
            onChange={(e) => handleTopFiveChange(index, e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        ))}
        <h2 className="font-semibold">Contact Details:</h2>
        <input
          type="email"
          placeholder="Email"
          value={newRestaurant.email}
          onChange={(e) => setNewRestaurant({ ...newRestaurant, email: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg"
          required
        />
        <input
          type="tel"
          placeholder="Phone"
          value={newRestaurant.phone}
          onChange={(e) => setNewRestaurant({ ...newRestaurant, phone: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
