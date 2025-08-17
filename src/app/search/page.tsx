'use client'

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import EventCard from "@/src/components/event_card";
import Image from "next/image";

export default function Search() {
  const [field, setField] = useState("name");
  const [value, setValue] = useState("");
  const [events, setEvents] = useState<any[]>([]);

  async function search() {
    const supabase = createClient();
    if (field == "name") {
      const results = await supabase.from("events")
        .select("*, clubs:host_events(clubs(name))")
        .ilike("name", `%${value}%`)
        .or(`datetime.gte.${new Date().toISOString()},datetime.is.NULL`)
        .order("datetime", {ascending: true});

      if (results.error == null) {
        setEvents(results.data);
      }
    } else if (field == "tags") {
      const results = await supabase
        .from("events")
        .select("*, clubs:host_events(clubs(name))")
        .overlaps("tags", value.split(", "))
        .or(`datetime.gte.${new Date().toISOString()},datetime.is.NULL`)
        .order("datetime", {ascending: true});

      if (results.error == null) {
        setEvents(results.data);
      } 
    }
  }

  return (
    <div>
      <h1 className="text-4xl font-bold">Search</h1>
      <div className="flex flex-col justify-between my-3 md:flex-row">
        <div className="flex flex-col sm:flex-row flex-1">
          <select onChange={(e) => setField(e.target.value)} value={field} name="field" className="border-purple-700 border-2 rounded-2xl p-2 py-3 my-3 sm:py-0 sm:m-0">
            <option value="name">Name</option>
            <option value="tags">Tags</option>
          </select>
          <div className="border-purple-700 border-2 rounded-2xl p-2 sm:mx-2 flex-1 flex flex-row">
            <Image src="/search.svg" width={30} height={30} alt="search icon" className="mr-2"/>
            <input 
              type="text" onChange={(e) => setValue(e.target.value)} value={value} name="value" placeholder="Search"
              className="text-xl"
            />
          </div>
        </div>
        <button 
          onClick={search}
          className="bg-purple-700 p-3 my-3 md:my-0 rounded-2xl text-lg"
        >
          Search
        </button>
      </div>
      <div className="flex flex-col md:flex-row md:flex-wrap">
        {events?.map((event) => {
          return (
            <div className="my-6 md:w-75 md:mx-5" key={event.id}>
              <EventCard event={event}/>
            </div>
          );
        })}
      </div>
    </div>
  );
}