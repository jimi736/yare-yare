import axios from "axios";
import { redis } from "@/lib/rediscache";
import { NextResponse } from "next/server";

axios.interceptors.request.use((config) => {
  config.timeout = 9000;
  return config;
});

async function fetchRecent(id) {
  try {
    const { data } = await axios.get(
      `https://anime-api-five-woad.vercel.app/api/stream?id=${id}`
    );
    return data;
  } catch (error) {
    return []
  }
}

export async function GET(req, { params }) {
  let cached;
  if (redis) {
    console.log("using redis");
    cached = await redis.get(`zoroBro-${params.id}`);
  }
  if (cached && JSON.parse(cached) && JSON.parse(cached).length > 0) {
    return NextResponse.json(JSON.parse(cached));
  } if (cached && JSON.parse(cached) && JSON.parse(cached).length < 1 || !cached) {
    const data = await fetchRecent(params.id);
    if (data) {
      if (redis) {
        await redis.set(
          `zoroBro-${params.id}`,
          JSON.stringify(data),
          "EX",
          8
        );
      }
      return NextResponse.json(data);
    } else {
      return NextResponse.json({ message: "Recent Episodes not found" });
    }
  }
}
