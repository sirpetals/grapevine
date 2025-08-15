import { createClient } from "../../utils/supabase/server";
import EventCard from "@/components/event_card";

export default async function Events() {
  const supabase = await createClient();
  const { data: events } = await supabase.from("events").select();

  return (
    <div>
      <h1 className="text-4xl font-bold">Events</h1>
      <ul>
        {events?.map(event => <EventCard event={event} key={event.id}/>)}
      </ul>
    </div>
  );
}
