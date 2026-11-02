import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ewo · Vêtements personnalisés",
    short_name: "Ewo",
    description: "Vêtements personnalisés et collections, imprimés à la demande.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#e8680c",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
