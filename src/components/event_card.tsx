import { Tables } from '../../database';

export default function EventCard({ event }: {event: Tables<"events">}) {
    return (
        <div>
            <h2 className="text-xl font-bold">{event.name}</h2>
            <p className="text-md">{}</p>
            <p>{event.description?.slice(0, event.description.length > 250 ? 250 : event.description.length)}</p>
        </div>
    );
}