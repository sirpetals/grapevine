import { createServiceClient } from "@/utils/supabase/server";
import axios from "axios";
import * as cheerio from "cheerio";
import { Tables } from "../../../../database";

async function getEvents(url: string) {
  const { data } = await axios.get(url);
  const document = cheerio.load(data);
  const clubName = await document("div.zm-container").find("a").text();
  const elements = await document("div.schedule").find(".event-link.content-link")
  const info = await Promise.all(
    elements.map(async (i, x) => {
      const eventInfo = await readEvent(document, x, url);
      return eventInfo;
    }
  ));
  
  return {clubName: clubName.trim(), records: info};
}

async function readEvent(document: cheerio.CheerioAPI, elem: any, baseUrl: string) {
  const eventPage = document(elem).attr("href");
  const { data } = await axios.get(`https://lu.ma${eventPage}`);
  const page = cheerio.load(data);

  const title = page("h1.title").text();
  const location = page("div.location-row").find("div.title").text() + ", " + page("div.location-row").find("div.desc").text();

  const description = page("div.event-about-card").find(".content").find(".spark-content").children().map((i, x) => document(x).text()).toArray().join("\n");
  const image = page("div.cover-image").find("img").attr("src");

  return {name: title, description: description, image: image, location: location, tags: ["UQIES"]};
}

export async function POST(request: Request) {
  const supabase = await createServiceClient();

  const body = JSON.parse(await request.text());
  const data = await getEvents(body.url);
  const {data: clubId} = await supabase.from("clubs").select("id").eq("name", data.clubName).single();

  if (clubId == null) {
    return Response.json({
      status: 404,
      error: "We don't have this club in our database"
    });
  } 

  const {data: existingRecords} = await supabase.from("events").select();
  const existingEvents = existingRecords?.map((r: Tables<"events">) => r.name);
  const filteredEvents = data.records.filter((r) => !existingEvents?.includes(r.name));

  const {data: records, error} = await supabase.from("events").insert(filteredEvents).select();

  if (error == null) {
    records!.forEach(async (record: Tables<"events">) => {
      await supabase.from("host_events").insert({club_id: clubId.id, event_id: record.id});
    });
  } else {
    return Response.json({
      status: 400,
      error: error
    })
  }
  
  return Response.json({
    status: 200
  });
}