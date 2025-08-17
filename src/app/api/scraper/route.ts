import { createServiceClient } from "@/utils/supabase/server";
import axios from "axios";
import * as cheerio from "cheerio";
import { Tables } from "../../../../database";

type Event = {
  name: string | undefined;
  description: string;
  image: string | undefined;
  location: string;
  datetime: Date | null;
  tags: string[];
  ticket_link: string | undefined;
};

async function getLumaEvents(url: string) {
  const { data } = await axios.get(url);
  const document = cheerio.load(data);
  const clubName = await document("div.zm-container").find("a").text();
  const elements = await document("div.schedule").find(".event-link.content-link")
  const info = await Promise.all(
    elements.map(async (i, x) => {
      const eventInfo = await readLumaEvent(document, x, clubName.trim());
      return eventInfo;
    }
  ));
  
  return info;
}

async function readLumaEvent(document: cheerio.CheerioAPI, elem: any, clubName: string) {
  const eventPage = document(elem).attr("href");

  const url = `https://lu.ma${eventPage}`;
  const { data } = await axios.get(url);
  const page = cheerio.load(data);

  const title = page("h1.title").text();
  const location = page("div.location-row").find("div.title").text() + ", " + page("div.location-row").find("div.desc").text();

  const description = page("div.event-about-card").find(".content").find(".spark-content").children().map((i, x) => document(x).text()).toArray().join("\n");
  const image = page("div.cover-image").find("img").attr("src");

  return {name: title, description: description, image: image, location: location, datetime: null, tags: [clubName], ticket_link: url};
}

async function getHumanitixEvents(url: string, clubName: string) {
  const { data } = await axios.get(url);
  const document = cheerio.load(data);

  const cards = document(".EventList").find("a.EventCard");

  const info = await Promise.all(
    cards.map(async (i, x) => {
      const eventInfo = await readHumanitixEvent(document, x, clubName);
      return eventInfo;
    })
  );

  return info;
}

async function readHumanitixEvent(document: cheerio.CheerioAPI, elem: any, clubName: string) {
  const title = document(elem).attr("aria-label");
  const timestamp = document(elem).find("span.date_next").text();
  const location = document(elem).find("div.location").text();

  // Parse timestamp string e.g. Sun, 24 Aug, 10:30am - 5:30pm AEST to JS date object
  let builtString = "";
  const [startTime, endTime] = timestamp.split(" - ");
  const afternoon = startTime.includes("pm");
  const includesMinutes = startTime.includes(":");

  builtString = startTime.slice(0, startTime.length - 2);
  if (!includesMinutes) {
    builtString += ":00";
  }

  const time = new Date(Date.parse(builtString));
  if (afternoon && time.getHours() < 12) {
    time.setHours(time.getHours() + 12);
  }
  time.setFullYear(2025);

  let imageSrc: string | undefined = undefined;
  const picture = document(elem).find("div.banner").find("picture");
  if (picture.length) {
    imageSrc = picture.find("img").attr("src");
  }

  const eventPage = document(elem).attr("href");

  const { data } = await axios.get(eventPage!);
  const page = cheerio.load(data);

  const description = page("div.EventDescription").text();

  return {name: title, description: description, image: imageSrc, location: location, datetime: time, tags: [clubName], ticket_link: eventPage};
}

async function updateDatabase(data: Event[], clubName: string): Promise<{success: boolean, error: any}> {
  const supabase = await createServiceClient();
  const {data: clubId, error: clubError} = await supabase.from("clubs").select("id").eq("name", clubName).single();

  if (clubId) {
    const {data: existingRecords} = await supabase.from("events").select();
    const existingEvents = existingRecords?.map((r: Tables<"events">) => r.name);
    const filteredEvents = data.filter((r) => !existingEvents?.includes(r.name!));

    const {data: records, error} = await supabase.from("events").insert(filteredEvents).select();

    if (!error) {
      records.forEach(async (record: Tables<"events">) => {
        const {error: hostError} = await supabase.from("host_events").insert({club_id: clubId.id, event_id: record.id});
        console.log(hostError);
      });

      return {success: true, error: null};
    }

    return {success: false, error: error};
  }

  return {success: false, error: clubError};
}

export async function GET(request: Request) {
  const supabase = await createServiceClient();

  // UQIES - Luma
  const uqiesData = await getLumaEvents("https://lu.ma/uqies25");
  let result = await updateDatabase(uqiesData, "UQIES");

  if (result.error) {
    return Response.json({
      status: 400,
      error: result.error
    });
  }

  // Cosy Gamers
  const cozyGamersData = await getHumanitixEvents("https://events.humanitix.com/host/lee-president", "Cosy Gamers Club");
  result = await updateDatabase(cozyGamersData, "Cozy Gamers Club");

  if (result.error) {
    return Response.json({
      status: 400,
      error: result.error
    });
  }

  // UQCS
  const uqcsData = await getHumanitixEvents("https://events.humanitix.com/host/60ec12652dec10000a6e79df", "UQCS");
  result = await updateDatabase(uqcsData, "UQCS");

  if (result.error) {
    return Response.json({
      status: 400,
      error: result.error
    });
  }

  return Response.json({
    status: 200
  });
}