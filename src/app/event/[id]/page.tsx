import Tag from "@/src/components/tag";
import { createClient } from "@/utils/supabase/server";

export default async function EventDescription({
    params 
}: {
    params: Promise<{id: number}>
}) {
    const { id } = await params;
    const supabase = await createClient();
    const { data: eventData } = await supabase.from("events").select().eq("id", id).single();
    const { data: clubData } = await supabase.from("host_events").select("clubs(*)").eq("event_id", id);

    const clubNames = clubData?.map((record: any) => {
        return record.clubs.name;
    })

    return (
        <div>
            <img src={eventData.image} className="w-full h-[300px] object-cover rounded-xl mb-3"/>
            <div className="flex flex-row my-2">
                {eventData.tags?.map((tag: String, index: number) => <Tag key={index} text={tag}/>)}
            </div>
            <h1 className="text-2xl font-bold">{eventData.name}</h1>
            <p className="text-xl font-bold">Hosted by {clubNames?.join(", ")}</p>

            <div className="mt-3">
                <p>🗓️: {new Date(Date.parse(eventData.datetime)).toLocaleString()}</p>
                <p>📍: {eventData.location}</p>
            </div>

            <a href={eventData.ticket_link}>
                <button className="bg-purple-700 my-5 p-4 rounded-3xl w-full">Get Tickets</button>
            </a>

            <p>{eventData.description}</p>
        </div>
    );
}