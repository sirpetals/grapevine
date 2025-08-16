'use client'

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import EventCard from "@/src/components/event_card";

export default function Search() {
  const [field, setField] = useState("name");
  const [value, setValue] = useState("");
  const [events, setEvents] = useState<any[]>([]);

  async function search() {
    const supabase = createClient();
    if (field == "name") {
      const results = await supabase.from("events").select("*, clubs:host_events(clubs(name))").ilike("name", `%${value}%`).gt("datetime", new Date().toISOString());

      if (results.error == null) {
        setEvents(results.data);
      }
    } else if (field == "tags") {
      const results = await supabase.from("events").select("*, clubs:host_events(clubs(name))").overlaps("tags", value.split(", ")).gt("datetime", new Date().toISOString());

      if (results.error == null) {
        setEvents(results.data);
      } 
    }
  }

  return (
    <div>
      <h1 className="text-4xl font-bold">Search</h1>
      <div className="flex flex-row justify-between my-3">
        <div className="flex flex-row">
          <select onChange={(e) => setField(e.target.value)} value={field} className="border-purple-700 border-2 rounded-2xl p-2">
            <option value="name">Name</option>
            <option value="tags">Tags</option>
          </select>
          <input 
            type="text" onChange={(e) => setValue(e.target.value)} value={value}
            className="border-purple-700 border-2 rounded-2xl p-2 mx-2"
          />
        </div>
        <button 
          onClick={search}
          className="bg-purple-700 p-3 rounded-2xl text-lg"
        >
          Search
        </button>
      </div>
      {events?.map((event) => {
        return (
          <div className="my-6" key={event.id}>
            <EventCard event={event}/>
          </div>
        );
      })}
    </div>
  );
}