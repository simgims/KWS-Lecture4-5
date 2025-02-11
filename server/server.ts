import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import pg from "pg";

const connectionString = process.env.DATABASE_URL;

const postgresql = connectionString
  ? new pg.Pool({ connectionString, ssl: { rejectUnauthorized: false } })
  : new pg.Pool({ user: "postgres" });

const app = new Hono();

app.get("/api/skoler", async (c) => {
  console.log("Laster inn skoler");
  const result = await postgresql.query(
    `select
         skolenavn, eierforhold, besoksadresse_besoksadresse_adressenavn, besoksadresse_besoksadresse_postnummer, besoksadresse_besoksadresse_poststed,
         st_transform(posisjon, 4326)::json as posisjon
    from grunnskoler_3697913259634315b061b324a3f2cf59.grunnskole s
        inner join fylker_ba7aea2735714391a98b1a585644e98a.fylke f on st_contains(f.omrade, s.posisjon)
        inner join fylker_ba7aea2735714391a98b1a585644e98a.administrativenhetnavn n on f.objid = n.fylke_fk
    where
        n.navn = 'Viken'
    `,
  );

  return c.json({
    type: "FeatureCollection",
    crs: {
      type: "name",
      properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
    },
    features: result.rows.map(
      ({ posisjon: { coordinates }, ...properties }) => ({
        type: "Feature",
        properties,
        geometry: { type: "Point", coordinates },
      }),
    ),
  });
});

app.use("*", serveStatic({ root: "../dist/" }));

serve({
  fetch: app.fetch,
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
});
