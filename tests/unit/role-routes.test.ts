import { describe, expect, it } from "vitest";
import * as roleRoute from "@/app/services/[slug]/page";
import * as industryRoute from "@/app/industries/[slug]/page";
import * as servicesHub from "@/app/services/page";
import { AI_EMPLOYEES, VERTICALS, getAIEmployeeBySlug } from "@/lib/data";
// The industry body copy moved to a server-only module (it was shipping in the
// client bundle through the footer); generateMetadata builds its description
// from the tagline plus this.
import { VERTICAL_DETAILS } from "@/lib/vertical-details";

// ── Why this file exists ──────────────────────────────────────────────────────
// Both dynamic segments now set `dynamicParams = false`, which means
// generateStaticParams is not a hint — it is the complete list of URLs that will
// exist. A role missing from it 404s in production and prerenders fine in dev.
//
// generateMetadata is the other half: it is the only place a role page states
// its own title, description and og:url, and it has a `return {}` branch for a
// slug it cannot resolve. That branch is unreachable through routing today
// (dynamicParams closes it off), so nothing else exercises it — and if it ever
// stopped returning early it would interpolate `undefined` into a shared title.

const params = (slug: string) => ({ params: Promise.resolve({ slug }) });

describe("/services/[slug] prerendering", () => {
  it("prerenders exactly one URL per AI employee", () => {
    expect(roleRoute.generateStaticParams()).toEqual(
      AI_EMPLOYEES.map((role) => ({ slug: role.slug }))
    );
    // `dynamicParams = false` is what makes the list above exhaustive rather
    // than advisory: without it an unknown slug is rendered on demand and the
    // 404 body arrives only in the RSC payload, so first paint is blank.
    expect(
      roleRoute.dynamicParams,
      "an unknown role slug no longer 404s at the routing layer"
    ).toBe(false);
  });

  it("gives each role its own price, workload and og:url", async () => {
    for (const role of AI_EMPLOYEES) {
      const meta = await roleRoute.generateMetadata(params(role.slug));
      expect(meta.title, `${role.slug} title`).toContain(role.name);
      expect(meta.title).toContain(`from ${role.priceFrom}`);
      expect(meta.description, `${role.slug} description`).toContain(role.tagline);
      expect(meta.description).toContain(role.workload);
      expect(meta.description).toContain(`from ${role.priceFrom}`);
      // No other role's name may leak into a role's own metadata — the five
      // strings are built from one template, so a wrong lookup is invisible.
      for (const other of AI_EMPLOYEES) {
        if (other.slug === role.slug) continue;
        expect(
          meta.title,
          `${role.slug} title names ${other.slug}`
        ).not.toContain(other.name);
      }
      // openGraph is inherited wholesale from the root layout otherwise, which
      // pins og:url to "/" — every role share would then attribute to the
      // homepage. Relative on purpose: it must follow the canonical host rather
      // than hardcode one. Restating openGraph also drops the layout's images
      // unless they are restated too, which is how a preview goes blank.
      expect(meta.openGraph?.url, `${role.slug} og:url`).toBe(
        `/services/${role.slug}`
      );
      expect(
        JSON.stringify(meta.openGraph?.images),
        `${role.slug} lost its social preview image`
      ).toContain("/og-image.png");
      expect(meta.openGraph?.siteName).toBe("Rumi AI");
      // `alternates` is inherited from the root layout wholesale, and the
      // layout's canonical is "/" — so a role page without its own tells
      // Google it IS the homepage and gets consolidated away. Relative for the
      // same reason og:url is: the sibling site ships these exact slugs.
      expect(meta.alternates?.canonical, `${role.slug} canonical`).toBe(
        `/services/${role.slug}`
      );
    }
  });

  it("returns empty metadata for a slug it cannot resolve", async () => {
    for (const junk of [
      "not-a-real-role",
      "",
      "AI-Receptionist",
      "persian-leads",
      "real-estate",
    ]) {
      expect(getAIEmployeeBySlug(junk)).toBeUndefined();
      expect(
        await roleRoute.generateMetadata(params(junk)),
        `"${junk}" produced metadata for a page that does not exist`
      ).toEqual({});
    }
  });
});

describe("/services hub metadata", () => {
  // The five role pages get all of this asserted above, per role. The hub they
  // all link back to — the page that carries the offer and the pricing, and the
  // one the nav's first item and the FA homepage CTA both point at — restates
  // openGraph for exactly the same reason and had nothing checking it. The root
  // layout's openGraph is inherited wholesale, so a dropped `url` silently
  // attributes every /services share to "/", and restating openGraph at all
  // drops the layout's images unless they are restated too.
  const meta = servicesHub.metadata;

  it("attributes shares to itself rather than to the homepage", () => {
    // Relative on purpose: it resolves through metadataBase and follows the
    // canonical host, rather than hardcoding a domain a sibling site also ships.
    expect(meta.openGraph?.url, "/services og:url").toBe("/services");
  });

  it("keeps the site name and the social preview image", () => {
    expect(meta.openGraph?.siteName).toBe("Rumi AI");
    expect(
      JSON.stringify(meta.openGraph?.images),
      "the hub lost its social preview image"
    ).toContain("/og-image.png");
  });
});

describe("/industries/[slug] prerendering", () => {
  it("prerenders one URL per vertical and resolves metadata for those only", async () => {
    expect(industryRoute.generateStaticParams()).toEqual(
      VERTICALS.map((vertical) => ({ slug: vertical.slug }))
    );
    expect(
      industryRoute.dynamicParams,
      "an unknown industry slug no longer 404s at the routing layer"
    ).toBe(false);

    for (const vertical of VERTICALS) {
      const meta = await industryRoute.generateMetadata(params(vertical.slug));
      expect(meta.title, `${vertical.slug} title`).toContain(vertical.name);
      expect(meta.description).toContain(vertical.tagline);
      expect(meta.description).toContain(
        VERTICAL_DETAILS[vertical.slug].description
      );
      // Without its own, the page inherits the root layout's canonical ("/")
      // and declares itself the homepage.
      expect(meta.alternates?.canonical, `${vertical.slug} canonical`).toBe(
        `/industries/${vertical.slug}`
      );
      // And openGraph is inherited wholesale in exactly the same way, pinning
      // og:url to "/" — so every industry share attributed to the homepage
      // while the canonical beside it said otherwise. Relative for the same
      // reason the canonical is; restating openGraph drops the layout's images
      // unless they are restated too.
      expect(meta.openGraph?.url, `${vertical.slug} og:url`).toBe(
        `/industries/${vertical.slug}`
      );
      expect(
        JSON.stringify(meta.openGraph?.images),
        `${vertical.slug} lost its social preview image`
      ).toContain("/og-image.png");
      expect(meta.openGraph?.siteName).toBe("Rumi AI");
    }
    // The five slugs vercel.json redirects into role pages — healthcare, legal,
    // restaurants, accounting, construction — are deliberately NOT verticals.
    // If one is ever added as a real page the edge rule shadows it, which
    // routing.test.ts catches; here we pin that they resolve to nothing today.
    for (const junk of [
      "healthcare",
      "legal",
      "restaurants",
      "accounting",
      "construction",
      "ai-receptionist",
    ]) {
      expect(
        await industryRoute.generateMetadata(params(junk)),
        `"${junk}" produced metadata for a page that does not exist`
      ).toEqual({});
    }
  });
});
