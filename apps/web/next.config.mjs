/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static HTML/CSS/JS in `out/` — suitable for nginx `root` (no Node server).
  output: "export",
  // Emit `/methodology/index.html` so `/methodology/` resolves on static hosts; avoids 404 when
  // the server only maps directories to index.html (flat `methodology.html` needs extra nginx rules).
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
