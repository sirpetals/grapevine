import { createClientServer } from "@/utils/supabase/server";
import EventCard from "@/src/components/event_card";

export default async function Events() {
  const supabase = await createClientServer();
  const { data } = await supabase
    .from("events")
    .select("*, clubs:host_events(clubs(name))")
    .or(`datetime.gte.${new Date().toISOString()},datetime.is.NULL`)
    .order("datetime", {ascending: true});

  return (
    <div>
      <h1 className="text-4xl font-bold">Events</h1>
      <div className="flex flex-col md:flex-row md:flex-wrap">
        {data?.map(event => {
          return (
            <div key={event.id} className="my-6 md:w-75 md:mx-5">
              <EventCard event={event}/>
            </div>
          );
        })}
      </div>
    </div>
  );
}
