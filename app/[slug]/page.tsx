import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import {
  PHONE_DISPLAY,
  PHONE_E164,
  SEO_PAGES,
  SITE_NAME,
  bySlug,
  buildH1,
  buildMetaDescription,
  buildMetaTitle,
  cityFactsFor,
  cityFromTargetArea,
  cityPagesForPillar,
  faqsFor,
  isCityPage,
  linkLabel,
  pageListLabel,
  pageLocation,
  pillarFor,
  sameCityPages,
  serviceTopicLabel,
  supportCityLinks,
  toPath,
} from "@/lib/site-data";
import { cityServiceSchema, faqSchema, pageBreadcrumb } from "@/lib/schema";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 86400;

export async function generateStaticParams() {
  return SEO_PAGES.map((page) => ({ slug: page.pageSlug.replace(/^\//, "") }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = bySlug(slug);
  if (!page) return { title: "Page Not Found" };

  return {
    title: buildMetaTitle(page),
    description: buildMetaDescription(page),
    alternates: { canonical: toPath(page.pageSlug) },
    openGraph: {
      title: buildMetaTitle(page),
      description: buildMetaDescription(page),
      url: toPath(page.pageSlug),
      type: "article",
      siteName: SITE_NAME,
      locale: "en_CA",
    },
  };
}

function introText(page: NonNullable<ReturnType<typeof bySlug>>) {
  const location = pageLocation(page);
  if (isCityPage(page)) {
    const facts = cityFactsFor(page);
    if (facts) {
      return `If you are trying to make sense of a problem in ${location}, the first question is usually whether the issue is urgent, visible, and safe to leave alone for another day. Local access, weather, and building type can change the best next step.`;
    }
    return `If you are trying to make sense of a problem in ${location}, the first question is usually whether the issue is urgent, visible, and safe to leave alone for another day.`;
  }

  return "When a home or property problem appears, people usually want a straight answer before the cost grows. This page gives the next step, the visit sequence, and the kind of follow-up that makes the job easier to manage.";
}

function planningText(page: NonNullable<ReturnType<typeof bySlug>>) {
  const location = pageLocation(page);
  if (isCityPage(page)) {
    return `The first visit in ${location} is usually about narrowing the problem, checking access, and deciding whether the right move is repair, cleanup, replacement, or a second visit with more detail.`;
  }
  return `The best first visit focuses on safety, access, and scope. Once those are clear, the team can decide whether the answer is a quick repair, a cleanup step, a larger replacement, or a follow-up appointment.`;
}

function processSteps(page: NonNullable<ReturnType<typeof bySlug>>) {
  const location = pageLocation(page);
  return [
    {
      title: "Start the call",
      text: `Share the problem, the property type, and any access limits so the visit starts with the right context for ${location}.`,
    },
    {
      title: "Inspect the path",
      text: "The first look should cover the part of the home or property that changes the decision, not every possible detail at once.",
    },
    {
      title: "Set the next move",
      text: "You should leave with a clear explanation of what happens now, what can wait, and what the work is meant to solve.",
    },
    {
      title: "Keep the follow-up simple",
      text: "Useful notes and next-step guidance help the job stay organized after the initial visit is over.",
    },
  ];
}

function PageLinks({ page }: { page: NonNullable<ReturnType<typeof bySlug>> }) {
  const pillar = pillarFor(page);
  const cityLinks = cityPagesForPillar(pillar);
  const siblingLinks = sameCityPages(page);
  const supportLinks = supportCityLinks(page, 5);

  if (page.pageType === "Service Pillar") {
    const links = cityLinks.length ? cityLinks : supportLinks;
    return (
      <section className="rescue-detail">
        <div className="section-head">
          <p className="rescue-kicker">Related city pages</p>
          <h2>Local pages that connect to this service</h2>
        </div>
        <p>
          We provide this service in the following cities across Canada.
        </p>
        <div className="rescue-grid rescue-grid-4">
          {links.map((item) => (
            <Link className="rescue-chip" key={item.pageSlug} href={toPath(item.pageSlug)}>
              {linkLabel(item)}
            </Link>
          ))}
        </div>
      </section>
    );
  }

  if (isCityPage(page)) {
    return (
      <section className="rescue-detail">
        <div className="section-head">
          <p className="rescue-kicker">Helpful pages</p>
          <h2>More services in your area</h2>
        </div>
        <div className="rescue-link-panels">
          <Link className="rescue-card rescue-card-link" href={toPath(pillar.pageSlug)}>
            <span>Main service</span>
            <h3>{pageListLabel(pillar)}</h3>
            <p>See everything we offer for this type of work.</p>
          </Link>
          {siblingLinks.slice(0, 4).map((item) => (
            <Link className="rescue-card rescue-card-link" key={item.pageSlug} href={toPath(item.pageSlug)}>
              <span>Same city</span>
              <h3>{pageListLabel(item)}</h3>
              <p>Also serving {cityFromTargetArea(item.targetArea)} — see what else is available.</p>
            </Link>
          ))}
          {siblingLinks.length === 0 &&
            supportLinks.slice(0, 2).map((item) => (
              <Link className="rescue-card rescue-card-link" key={item.pageSlug} href={toPath(item.pageSlug)}>
                <span>Nearby page</span>
                <h3>{pageListLabel(item)}</h3>
                <p>Related service available in your area.</p>
              </Link>
            ))}
        </div>
      </section>
    );
  }

  return (
    <section className="rescue-detail">
      <div className="section-head">
        <p className="rescue-kicker">Related services</p>
        <h2>Related services you may need</h2>
      </div>
      <div className="rescue-link-panels">
        <Link className="rescue-card rescue-card-link" href={toPath(pillar.pageSlug)}>
          <span>Main service</span>
          <h3>{pageListLabel(pillar)}</h3>
          <p>See everything we offer for this type of work.</p>
        </Link>
        {supportLinks.slice(0, 4).map((item) => (
          <Link className="rescue-card rescue-card-link" key={item.pageSlug} href={toPath(item.pageSlug)}>
            <span>Related service</span>
            <h3>{pageListLabel(item)}</h3>
            <p>Another service that may be relevant to your situation.</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default async function DynamicSeoPage({ params }: Props) {
  const { slug } = await params;
  const page = bySlug(slug);
  if (!page) notFound();

  const faqs = faqsFor(page);
  const serviceSchema = cityServiceSchema(page);
  const schema = serviceSchema ? [pageBreadcrumb(page), faqSchema(page), ...serviceSchema] : [pageBreadcrumb(page), faqSchema(page)];
  const facts = cityFactsFor(page);
  const titleLabel = serviceTopicLabel(page);

  return (
    <main className="rescue-main rescue-page">
      <JsonLd data={schema} />

      <section className="rescue-wrap rescue-page-head page-hero">
        <div className="page-hero-copy">
          <p className="rescue-kicker">
            {isCityPage(page) ? `${cityFromTargetArea(page.targetArea)} Services` : "Home & Property Services"}
          </p>
          <h1>{buildH1(page)}</h1>
          <p>{introText(page)}</p>
          <div className="rescue-actions">
            <a className="rescue-call rescue-call-large" href={`tel:${PHONE_E164}`}>
              Call {PHONE_DISPLAY}
            </a>
            <Link className="rescue-secondary rescue-secondary-dark" href="/services">
              All Services
            </Link>
          </div>
        </div>
        <aside className="page-info-card">
          <div className="page-info-image">
            <Image
              src="/service-consultation-photo.png"
              alt="Homeowner reviewing a repair plan with a contractor"
              fill
              sizes="(max-width: 1100px) 100vw, 28vw"
            />
          </div>
          <p className="rescue-kicker">Service details</p>
          <div className="page-info-row">
            <span>Location</span>
            <strong>{pageLocation(page)}</strong>
          </div>
          <div className="page-info-row">
            <span>Service</span>
            <strong>{titleLabel}</strong>
          </div>
          <div className="page-info-row">
            <span>Available</span>
            <strong>24 / 7</strong>
          </div>
          <div className="page-info-row">
            <span>Phone</span>
            <strong>
              <a href={`tel:${PHONE_E164}`} style={{ color: "inherit" }}>{PHONE_DISPLAY}</a>
            </strong>
          </div>
        </aside>
      </section>

      <section className="rescue-section">
        <div className="rescue-wrap rescue-split">
          <div>
            <p className="rescue-kicker">How it works</p>
            <h2>Understanding your situation first</h2>
          </div>
          <p>{planningText(page)}</p>
        </div>
      </section>

      <section className="rescue-section rescue-soft">
        <div className="rescue-wrap">
          <div className="section-head">
            <p className="rescue-kicker">What to expect</p>
            <h2>Key questions we will address on your visit</h2>
          </div>
          <div className="rescue-grid rescue-grid-3">
            <article className="rescue-card">
              <h3>What is changing right now?</h3>
              <p>That could be a leak, a surface issue, a failed fixture, or a problem that is getting worse by the hour.</p>
            </article>
            <article className="rescue-card">
              <h3>What access matters first?</h3>
              <p>Shutoffs, panels, flooring edges, exterior access, or a tight interior space can change the order of work.</p>
            </article>
            <article className="rescue-card">
              <h3>What is the practical next move?</h3>
              <p>The best answer is usually the one that protects your property and gives you a clear plan going forward.</p>
            </article>
          </div>
        </div>
      </section>

      {facts && (
        <section className="rescue-section">
          <div className="rescue-wrap">
            <div className="section-head">
              <p className="rescue-kicker">Local notes</p>
              <h2>{pageLocation(page)} context that may matter</h2>
            </div>
            <div className="rescue-grid rescue-grid-3">
              <article className="rescue-card">
                <h3>Nearby access</h3>
                <p>
                  Service planning may account for homes and parks around {facts.neighborhoods[0]} and{" "}
                  {facts.neighborhoods[1]} when parking or access changes the visit.
                </p>
              </article>
              <article className="rescue-card">
                <h3>Weather pattern</h3>
                <p>Local conditions include {facts.climate}, which can affect drying, movement, or repeated stress.</p>
              </article>
              <article className="rescue-card">
                <h3>Nearby landmarks</h3>
                <p>
                  Calls near {facts.landmarks[0]} or {facts.landmarks[1]} often need different travel timing and
                  planning.
                </p>
              </article>
            </div>
          </div>
        </section>
      )}

      <section className="rescue-section rescue-band">
        <div className="rescue-wrap">
          <div className="section-head">
            <p className="rescue-kicker">How the visit moves</p>
            <h2>Clear steps without the noise</h2>
          </div>
          <div className="rescue-timeline">
            {processSteps(page).map((step, index) => (
              <article className="rescue-step" key={step.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div className="rescue-wrap">
        <PageLinks page={page} />
      </div>

      <section className="rescue-section">
        <div className="rescue-wrap">
          <div className="section-head">
            <p className="rescue-kicker">Common questions</p>
            <h2>Frequently asked questions</h2>
          </div>
          <div className="rescue-grid rescue-grid-3">
            {faqs.map((faq) => (
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
