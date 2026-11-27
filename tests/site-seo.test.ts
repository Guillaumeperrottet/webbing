import assert from "node:assert/strict";
import test from "node:test";
import { existsSync } from "node:fs";
import path from "node:path";
import sitemap from "../src/app/sitemap";
import { siteUrl, publicContentUpdatedAt } from "../src/data/site-meta";
import { studioStructuredData } from "../src/lib/site-seo";

test("the one-page sitemap contains only its canonical URL and nine real public images", () => {
  const entries = sitemap();
  assert.equal(entries.length, 1);
  assert.equal(entries[0].url, siteUrl);
  assert.equal(entries[0].lastModified, publicContentUpdatedAt);
  assert.deepEqual(sitemap(), entries);
  assert.equal(entries[0].images?.length, 9);
  for (const image of entries[0].images ?? []) {
    const url = new URL(image);
    assert.equal(url.origin, new URL(siteUrl).origin);
    assert.equal(url.hash, "");
    assert.ok(existsSync(path.join(process.cwd(), "public", url.pathname)));
  }
});
test("the studio graph links services and projects to one identity without unsupported business claims", () => {
  const graph = studioStructuredData["@graph"];
  const studio = graph.find(node => node["@id"] === `${siteUrl}#studio`);
  assert.ok(studio);
  const services = graph.filter(node => node["@type"] === "Service");
  assert.equal(services.length, 2);
  for (const service of services) assert.equal(service.provider?.["@id"], studio["@id"]);
  const portfolio = graph.find(node => node["@type"] === "ItemList");
  assert.equal(portfolio?.numberOfItems, 9);
  const json = JSON.stringify(studioStructuredData);
  assert.ok(json.includes("Conception : Pierre & Théo"));
  for (const unsupported of ["openingHours", "priceRange", '"geo"']) assert.ok(!json.includes(unsupported));
});
