import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import {
  CITY_PAGES,
  PHONE_DISPLAY,
  PHONE_E164,
  SERVICE_PILLARS,
  SITE_NAME,
  SUPPORT_PAGES,
  absoluteUrl,
  linkLabel,
  pageListLabel,
  toPath,
} from "@/lib/site-data";
import { breadcrumbSchema } from "@/lib/schema";

const homeFaqs = [
  {
    q: "What if I'm not sure which service I need?",
    a: "No problem. Just describe what's happening when you call — we will ask a few questions to figure out the right service for your situation.",
  },
  {
    q: "What happens after I call?",
    a: "We confirm what changed, check what matters first, and give you a clear next step. No runaround — just practical guidance.",
  },
  {
    q: "Do you cover my city?",
    a: "We serve cities across Canada. Browse our locations or call us to confirm coverage and get matched with help in your area.",
  },
];

const steps = [
  {
    title: "Tell us what changed",
    text: "Share the symptom, when it started, and whether the area is safe to use. That gives the call a clear starting point.",
  },
  {
    title: "Check the access",
    text: "The first visit looks at the open paths, panels, shutoffs, or surfaces that matter before anyone commits to a larger fix.",
  },
  {
    title: "Choose the next move",
    text: "You get a straightforward explanation of what should happen now and what can wait, so the decision feels manageable.",
  },
  {
    title: "Keep the record clean",
    text: "Notes and follow-up details stay simple enough for owners, managers, tenants, or insurers to understand later.",
  },
];

function ServiceIcon({ slug }: { slug: string }) {
  const s = slug.toLowerCase();
  const base = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (s.includes("flood") || s.includes("water-damage") || s.includes("restor")) {
    return (
      <svg {...base}>
        <path d="M2 14c.5 0 1-.5 1.5-1s1-1 1.5-1 1 .5 1.5 1 1 1 1.5 1 1-.5 1.5-1 1-1 1.5-1 1 .5 1.5 1 1 1 1.5 1 1-.5 1.5-1 1-1 1.5-1" />
        <path d="M2 18c.5 0 1-.5 1.5-1s1-1 1.5-1 1 .5 1.5 1 1 1 1.5 1 1-.5 1.5-1 1-1 1.5-1 1 .5 1.5 1 1 1 1.5 1 1-.5 1.5-1 1-1 1.5-1" />
        <path d="M12 2v8M9 5l3-3 3 3" />
      </svg>
    );
  }
  if (s.includes("plumb")) {
    return (
      <svg {...base}>
        <path d="M12 2C6 8 4 11 4 14a8 8 0 0016 0c0-3-2-6-8-12z" />
      </svg>
    );
  }
  if (s.includes("electric")) {
    return (
      <svg {...base}>
        <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    );
  }
  if (s.includes("property") || s.includes("manag")) {
    return (
      <svg {...base}>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 9h6M9 13h6M9 17h6" />
      </svg>
    );
  }
  if (s.includes("hvac") || s.includes("furnace") || s.includes("heat") || s.includes("cool")) {
    return (
      <svg {...base}>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12" />
      </svg>
    );
  }
  if (s.includes("tree") || s.includes("arborist") || s.includes("stump") || s.includes("trimm")) {
    return (
      <svg {...base}>
        <path d="M17 14l-5-9-5 9" />
        <path d="M15 10l-3-5-3 5" />
        <line x1="12" y1="22" x2="12" y2="14" />
      </svg>
    );
  }
  if (s.includes("paint")) {
    return (
      <svg {...base}>
        <path d="M18.37 2.63 14 7l-1.59-1.59a2 2 0 00-2.82 0L8 7l9 9 1.59-1.59a2 2 0 000-2.82L17 10l4.37-4.37a2.12 2.12 0 00-3-3z" />
        <path d="M9 8c-2 2.5-5 7.5-5 10a4 4 0 008 0c0-2.5-3-7.5-3-10z" />
      </svg>
    );
  }
  if (s.includes("floor")) {
    return (
      <svg {...base}>
        <rect x="2" y="3" width="20" height="5" rx="1" />
        <rect x="2" y="10" width="20" height="5" rx="1" />
        <rect x="2" y="17" width="20" height="5" rx="1" />
      </svg>
    );
  }
  return (
    <svg {...base}>
      <path d="m3 9 9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

export const metadata: Metadata = {
  title: `${SITE_NAME} | Home and Property Help`,
  description:
    "Canada-wide help for urgent repairs, exterior care, finish work, flooring, and trusted next steps.",
  alternates: { canonical: "/" },
  openGraph: {
    title: `${SITE_NAME} | Home and Property Help`,
    description: "Home and property help written for quick decisions and clear next steps.",
    url: absoluteUrl("/"),
    type: "website",
    siteName: SITE_NAME,
  },
};

export default function HomePage() {
  const featuredServices = SERVICE_PILLARS.slice(0, 6);
  const featuredSupport = SUPPORT_PAGES.slice(0, 6);
  const featuredCities = CITY_PAGES.slice(0, 12);

  return (
    <main className="rescue-main">
      <JsonLd
        data={[
          breadcrumbSchema([{ name: "Home", path: "/" }]),
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: homeFaqs.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: { "@type": "Answer", text: faq.a },
            })),
          },
        ]}
      />

      {/* ── Hero ── */}
      <section className="hero-stage">
        <div className="hero-stage-orb hero-stage-orb-left" />
        <div className="hero-stage-orb hero-stage-orb-right" />
        <Image
          src="/home-services-hero-photo.png"
          alt=""
          fill
          priority
          className="hero-stage-image"
          sizes="100vw"
          aria-hidden="true"
        />
        <div className="hero-stage-shade" />
        <div className="rescue-wrap hero-stage-grid">
          <div className="hero-copy">
            <p className="rescue-kicker">Property help, simplified</p>
            <h1>Clear next steps for urgent home and property problems.</h1>
            <p className="home-hero-lead">
              We help you understand the problem, figure out the first move, and connect with the right kind of
              help — fast and without the confusion.
            </p>

            <div className="hero-stats">
              <div className="hero-stat">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="2 8 6 12 14 4" />
                </svg>
                Canada-wide
              </div>
              <div className="hero-stat">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="12" height="12" rx="1.5" />
                  <path d="M5 2v2M11 2v2M2 7h12" />
                </svg>
                Urgent repairs
              </div>
              <div className="hero-stat">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="8" cy="6" r="2.5" />
                  <path d="M3 14c0-2.5 2.2-4 5-4s5 1.5 5 4" />
                </svg>
                Home services
              </div>
            </div>

            <div className="rescue-actions">
              <a className="rescue-call rescue-call-large" href={`tel:${PHONE_E164}`}>
                Call {PHONE_DISPLAY}
              </a>
              <Link className="rescue-secondary hero-secondary" href="/services">
                Browse Services
              </Link>
            </div>

            <div className="hero-proof-grid" aria-label="Key benefits">
              <div>
                <strong>Fast answer</strong>
                <span>Start from the issue and move toward the right help faster.</span>
              </div>
              <div>
                <strong>Clear guidance</strong>
                <span>Understand what matters first before the day gets more stressful.</span>
              </div>
              <div>
                <strong>Broad coverage</strong>
                <span>Urgent repairs, exterior care, finish work, and more.</span>
              </div>
            </div>
          </div>

          <aside className="hero-rail" aria-label="Service overview">
            <div className="hero-visual-shell">
              <article className="hero-floating-note">
                <span className="hero-floating-label">Start here</span>
                <strong>Get clear guidance on what to do first, so you can move forward with confidence.</strong>
                <p>We make the first step simple — no confusing options, no wasted calls.</p>
              </article>

              <article className="hero-floating-badge">
                <span>Common needs</span>
                <strong>Emergency repairs, flood cleanup, and trusted contractors.</strong>
              </article>
            </div>

            <article className="hero-rail-card">
              <div className="hero-rail-top">
                <h3>Popular services</h3>
                <span>Start here</span>
              </div>
              <div className="hero-chip-grid">
                {SERVICE_PILLARS.slice(0, 4).map((page) => (
                  <Link className="hero-mini-chip" href={toPath(page.pageSlug)} key={page.pageSlug}>
                    {pageListLabel(page)}
                  </Link>
                ))}
              </div>
            </article>
            <article className="hero-rail-card">
              <div className="hero-rail-top">
                <h3>Helpful city pages</h3>
                <span>Browse local</span>
              </div>
              <div className="hero-chip-grid hero-chip-grid-tight">
                {CITY_PAGES.slice(0, 6).map((page) => (
                  <Link className="hero-mini-chip" href={toPath(page.pageSlug)} key={page.pageSlug}>
                    {linkLabel(page)}
                  </Link>
                ))}
              </div>
            </article>
          </aside>
        </div>
      </section>

      {/* ── Service Atlas ── */}
      <section className="rescue-section">
        <div className="rescue-wrap">
          <div className="section-head">
            <p className="rescue-kicker">Services</p>
            <h2>Expert help for whatever your home needs.</h2>
          </div>
          <div className="rescue-grid rescue-grid-3">
            {featuredServices.map((page) => (
              <Link className="rescue-card rescue-card-link" href={toPath(page.pageSlug)} key={page.pageSlug}>
                <div className="rescue-card-icon">
                  <ServiceIcon slug={page.pageSlug} />
                </div>
                <span>Service</span>
                <h3>{pageListLabel(page)}</h3>
                <p>Get expert help with a clear plan — from the first call through to completion.</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process Steps ── */}
      <section className="rescue-section rescue-soft">
        <div className="rescue-wrap">
          <div className="section-head">
            <p className="rescue-kicker">What usually comes next</p>
            <h2>Simple steps, without the extra script.</h2>
          </div>
          <div className="rescue-timeline">
            {steps.map((step, index) => (
              <article className="rescue-step" key={step.title}>
                <div className="rescue-step-num">{String(index + 1).padStart(2, "0")}</div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quick Links ── */}
      <section className="rescue-section">
        <div className="rescue-wrap">
          <div className="section-head">
            <p className="rescue-kicker">Common needs</p>
            <h2>Help for the problems homeowners run into most.</h2>
          </div>
          <div className="rescue-grid rescue-grid-3">
            {featuredSupport.map((page) => (
              <Link className="rescue-card rescue-card-link rescue-card-compact" href={toPath(page.pageSlug)} key={page.pageSlug}>
                <span>Service</span>
                <h3>{pageListLabel(page)}</h3>
                <p>Get a fast response and a clear plan for tackling this problem today.</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── City Coverage ── */}
      <section className="rescue-section rescue-band">
        <div className="rescue-wrap">
          <div className="section-head">
            <p className="rescue-kicker">Locations</p>
            <h2>We serve cities across Canada.</h2>
          </div>
          <div className="rescue-grid rescue-grid-4">
            {featuredCities.map((page) => (
              <Link className="rescue-chip" href={toPath(page.pageSlug)} key={page.pageSlug}>
                {linkLabel(page)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="rescue-section">
        <div className="rescue-wrap">
          <div className="section-head">
            <p className="rescue-kicker">Common questions</p>
            <h2>Answers to the questions people ask first.</h2>
          </div>
          <div className="rescue-grid rescue-grid-3">
            {homeFaqs.map((faq) => (
              <article className="rescue-card" key={faq.q}>
                <div className="rescue-faq-mark" aria-hidden="true">&ldquo;</div>
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
