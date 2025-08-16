import { createClient } from "@/utils/supabase/server";
import EventCard from "@/src/components/event_card";

export default async function Events() {
  const supabase = await createClient();
  const { data } = await supabase.from("events").select("*, clubs:host_events(clubs(name))").gte("datetime", new Date().toISOString());
  console.log(data);

  return (
    <div>
      <h1 className="text-4xl font-bold">Events</h1>
      <ul>
        {data?.map(event => {
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
