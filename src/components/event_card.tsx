import Link from "next/link";
import Tag from "./tag";
import LikeButton from "./like_button";

export default function EventCard({ event }: { event: any }) {
    const hostClubs = event.clubs.map((club: any) => {
        return club.clubs.name;
    });
    const trimmedDescription = event.description?.slice(0, event.description.length > 250 ? 250 : event.description.length);

    return (
        <Link href={`/event/${event.id}`}>
            <div className="rounded-2xl p-3 bg-(--background) shadow-[0px_0px_12px_3px_#808080]">
                <img src={event.image} alt={`Cover image for ${event.name}`} className="w-full h-[200px] object-cover rounded-xl mb-3" />
                <h2 className="text-xl font-bold">{event.name}</h2>
                <p className="text-md font-bold">Hosted by {hostClubs.join(", ")}</p>

                <div className="my-3 font-bold">
                    {event.datetime != null ? (<p>🗓️: {new Date(Date.parse(event.datetime)).toLocaleString("en-AU", {timeZone: "Australia/Brisbane"})}</p>) : null}
                    <p>📍: {event.location}</p>
                </div>

                <p className="mb-3 whitespace-pre-line">{ event.description != null ? (trimmedDescription + (trimmedDescription == event.description ? "" : "...")) : ""}</p>
                <div className="flex flex-row">
                    {event.tags?.map((tag: String, index: number) => <Tag key={index} text={tag}/>)}
                </div>
            </div>
        </Link>
    );
}