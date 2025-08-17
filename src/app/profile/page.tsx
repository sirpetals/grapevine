'use client'

import EventCard from "@/src/components/event_card";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function Favourites() {
  const supabase = createClient();
  const router = useRouter();

  const [user, setUser] = useState<any>();
  const [favourites, setFavourites] = useState<any[]>([]);
  
  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      
      if (data.user == null) {
        router.push("/login")
      } else {
        const { data: userData } = await supabase.from("students").select("*").eq("id", data.user.id).single();
        setUser(userData);

        const { data: favouriteEvents } = await supabase.from("events").select("*, clubs:host_events(clubs(name))").in("id", userData.favourites).or(`datetime.gte.${new Date().toISOString()},datetime.is.NULL`);
        if (favouriteEvents) {
          setFavourites(favouriteEvents);
        }
      }
    }

    loadUser();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div>
      <h1 className="text-4xl font-bold">Profile</h1>
      <div className="flex flex-row justify-between items-center my-3">
        <div className="flex flex-col">
          <h2 className="text-md">Name:</h2>
          <p className="text-2xl">{user?.name}</p>
        </div>
        <button className="bg-purple-700 p-3 md:my-0 rounded-2xl text-md font-bold" onClick={signOut}>Sign Out</button>
      </div>
      <h2 className="text-2xl font-bold">Favourites</h2><hr></hr>
      <ul>
      {favourites?.map(event => {
        return (
          <div key={event.id} className="my-6">
            <EventCard event={event}/>
          </div>
        );
      })}
      </ul>
    </div>
  );
}