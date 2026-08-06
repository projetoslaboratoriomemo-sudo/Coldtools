import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Coldtools — Ferramentas técnicas",
    short_name: "Coldtools",
    description:
      "Cálculos elétricos, refrigeração, vazão e medições para técnicos em campo.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#171b1e",
    theme_color: "#11171a",
    orientation: "any",
    lang: "pt-BR",
    categories: ["utilities", "productivity"],
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
