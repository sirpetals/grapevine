import LikeButton from "@/src/components/like_button";
import Tag from "@/src/components/tag";
import { createClientServer } from "@/utils/supabase/server";

export default async function EventDescription({
    params 
}: {
    params: Promise<{id: number}>
}) {
    const { id } = await params;
    const supabase = await createClientServer();
    const { data: eventData } = await supabase.from("events").select().eq("id", id).single();
    const { data: clubData } = await supabase.from("host_events").select("clubs(*)").eq("event_id", id);

    const clubNames = clubData?.map((record: any) => {
        return record.clubs.name;
    })

    return (
        <div>
            {eventData.image ? (<img src={eventData.image} className="w-full h-[300px] object-cover rounded-xl mb-3"/>) : null}
            <div className="flex flex-row items-center justify-between">
                <h1 className="text-2xl font-bold">{eventData.name}</h1>
                <LikeButton eventId={eventData.id}/>
            </div>
            <p className="text-xl font-bold">Hosted by {clubNames?.join(", ")}</p>

            <div className="flex flex-row my-2">
                {eventData.tags?.map((tag: String, index: number) => <Tag key={index} text={tag}/>)}
            </div>
            
            <div className="mt-3 font-bold">
                {eventData.datetime != null ? (<p>🗓️: {new Date(Date.parse(eventData.datetime)).toLocaleString("en-AU", {timeZone: "Australia/Brisbane"})}</p>) : null}
                <p>📍: {eventData.location}</p>
            </div>

            <a href={eventData.ticket_link}>
                <button className="bg-purple-700 my-5 p-4 rounded-3xl w-full">Get Tickets</button>
            </a>

            <p>{eventData.description}</p>
        </div>
    );
}