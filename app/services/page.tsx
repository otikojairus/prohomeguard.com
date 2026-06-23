import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import {
  CITY_PAGES,
  SEO_PAGES,
  SERVICE_PILLARS,
  SITE_NAME,
  SUPPORT_PAGES,
  absoluteUrl,
  linkLabel,
  pageListLabel,
  toPath,
} from "@/lib/site-data";
import { breadcrumbSchema } from "@/lib/schema";

const serviceFaqs = [
  {
    q: "How do I find the right service?",
    a: "Start with the service that matches your problem. If you need help in a specific city, use the city service pages to find local coverage.",
  },
  {
    q: "Why are there different service categories?",
    a: "We group services by what you need — emergency repairs, home improvements, and local coverage — so you can find the right help faster.",
  },
  {
    q: "Do you cover my city?",
    a: "We serve cities across Canada. Browse the locations section below or call us to confirm coverage in your area.",
  },
];

export const metadata: Metadata = {
  title: `${SITE_NAME} | Service Directory`,
  description:
    "Browse the full ProHomeGuard set of pages for urgent repairs, city coverage, and finish work.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: `${SITE_NAME} Service Directory`,
    description: "Full page index for ProHomeGuard across Canada.",
    url: absoluteUrl("/services"),
  },
};

export default function ServicesPage() {
  return (
    <main className="rescue-main rescue-page">
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: serviceFaqs.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: { "@type": "Answer", text: faq.a },
            })),
          },
        ]}
      />

      <section className="rescue-wrap rescue-page-head">
        <p className="rescue-kicker">All services</p>
        <h1>Our Services</h1>
        <p>
          Browse everything we offer — from emergency repairs and flood cleanup to home improvements and local city coverage.
          Find the service you need, or call us and we will point you in the right direction.
        </p>
      </section>

      <section className="rescue-section">
        <div className="rescue-wrap">
          <div className="section-head">
            <p className="rescue-kicker">Home services</p>
            <h2>What we offer</h2>
          </div>
          <div className="rescue-grid rescue-grid-3">
            {SERVICE_PILLARS.map((page) => (
              <Link className="rescue-card rescue-card-link" href={toPath(page.pageSlug)} key={page.pageSlug}>
                <span>Service</span>
                <h3>{pageListLabel(page)}</h3>
                <p>Expert help with a clear plan — from the first call through to completion.</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="rescue-section rescue-soft">
        <div className="rescue-wrap">
          <div className="section-head">
            <p className="rescue-kicker">Specialized help</p>
            <h2>Fast-response & targeted services</h2>
          </div>
          <div className="rescue-grid rescue-grid-4">
            {SUPPORT_PAGES.map((page) => (
              <Link className="rescue-chip" href={toPath(page.pageSlug)} key={page.pageSlug}>
                {pageListLabel(page)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="rescue-section">
        <div className="rescue-wrap">
          <div className="section-head">
            <p className="rescue-kicker">Locations</p>
            <h2>Areas we serve across Canada</h2>
          </div>
          <div className="rescue-grid rescue-grid-4">
            {CITY_PAGES.map((page) => (
              <Link className="rescue-chip" href={toPath(page.pageSlug)} key={page.pageSlug}>
                {linkLabel(page)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="rescue-section rescue-band">
        <div className="rescue-wrap">
          <div className="section-head">
            <p className="rescue-kicker">Full directory</p>
            <h2>Browse all services & locations</h2>
          </div>
          <div className="rescue-index-list">
            {SEO_PAGES.map((page) => (
              <Link href={toPath(page.pageSlug)} key={page.pageSlug} aria-label={pageListLabel(page)}>
                {pageListLabel(page)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="rescue-section">
        <div className="rescue-wrap">
          <div className="section-head">
            <p className="rescue-kicker">Common questions</p>
            <h2>Frequently asked questions</h2>
          </div>
          <div className="rescue-grid rescue-grid-3">
            {serviceFaqs.map((faq) => (
              <article className="rescue-card" key={faq.q}>
                <h3>{faq.q}</h3>
                <p>{faq.a}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
