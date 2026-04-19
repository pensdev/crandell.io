/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static HTML/CSS/JS in `out/` — suitable for nginx `root` (no Node server).
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
