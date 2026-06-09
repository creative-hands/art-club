import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");
const client = path.join(dist, "client");
const server = path.join(dist, "server");

const htmlFiles = (await readdir(root)).filter((file) => file.endsWith(".html"));

const textAssets = [
  ...htmlFiles.map((file) => ({
    route: `/${file}`,
    file,
    type: "text/html; charset=utf-8"
  })),
  { route: "/styles.css", file: "styles.css", type: "text/css; charset=utf-8" },
  { route: "/script.js", file: "script.js", type: "application/javascript; charset=utf-8" }
];

const binaryAssets = [
  { route: "/assets/studio-hero.png", file: "assets/studio-hero.png", type: "image/png" }
];

await rm(dist, { recursive: true, force: true });
await mkdir(client, { recursive: true });
await mkdir(server, { recursive: true });
await mkdir(path.join(dist, ".openai"), { recursive: true });

for (const file of htmlFiles) {
  await cp(path.join(root, file), path.join(client, file));
}

await cp(path.join(root, "styles.css"), path.join(client, "styles.css"));
await cp(path.join(root, "script.js"), path.join(client, "script.js"));
await cp(path.join(root, "assets"), path.join(client, "assets"), { recursive: true });
await cp(path.join(root, ".openai", "hosting.json"), path.join(dist, ".openai", "hosting.json"));

const assets = [];

for (const asset of textAssets) {
  assets.push({
    ...asset,
    body: await readFile(path.join(root, asset.file), "utf8")
  });
}

for (const asset of binaryAssets) {
  assets.push({
    ...asset,
    base64: await readFile(path.join(root, asset.file), "base64")
  });
}

const serverCode = `const assets = new Map(${JSON.stringify(
  assets.map((asset) => [asset.route, asset])
)});

function binaryResponse(asset) {
  const raw = atob(asset.base64);
  const bytes = new Uint8Array(raw.length);
  for (let index = 0; index < raw.length; index += 1) {
    bytes[index] = raw.charCodeAt(index);
  }
  return new Response(bytes, { headers: { "content-type": asset.type, "cache-control": "public, max-age=31536000, immutable" } });
}

function textResponse(asset) {
  return new Response(asset.body, { headers: { "content-type": asset.type, "cache-control": "public, max-age=300" } });
}

function responseFor(asset) {
  return asset.base64 ? binaryResponse(asset) : textResponse(asset);
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const pathname = url.pathname === "/" ? "/index.html" : url.pathname;
    const asset = assets.get(pathname);

    if (asset) {
      return responseFor(asset);
    }

    if (!pathname.includes(".")) {
      return responseFor(assets.get("/index.html"));
    }

    return new Response("Not found", { status: 404 });
  }
};
`;

await writeFile(path.join(server, "index.js"), serverCode);
