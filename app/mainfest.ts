import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "위드또잉",
    short_name: "위드또잉",
    description: "푸꾸옥 가족여행 일정/체크리스트",
    start_url: "/",
    display: "standalone",
    background_color: "#F4FBFF",
    theme_color: "#0EA5E9",
    icons: [
      {
        src: "/public/ddoing.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/public/ddoing.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}