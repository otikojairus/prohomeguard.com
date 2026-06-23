import Link from "next/link";
import Image from "next/image";
import {
  CITY_PAGES,
  PHONE_DISPLAY,
  PHONE_E164,
  SERVICE_PILLARS,
  SITE_NAME,
  SUPPORT_PAGES,
  pageListLabel,
  toPath,
} from "@/lib/site-data";

export function SiteFooter() {
  return (
    <footer className="rescue-footer">
      <div className="rescue-wrap rescue-footer-grid">
        <div>
          <div className="rescue-footer-brand">
            <Image src="/logo.svg" alt="ProHomeGuard logo" width={34} height={34} />
            <p>{SITE_NAME}</p>
          </div>
          <p className="rescue-footer-copy">
            Straightforward help for home and property problems across Canada, including urgent repairs, finish work,
            exterior care, and local contractor services.
          </p>
          <a className="rescue-call rescue-footer-call" href={`tel:${PHONE_E164}`}>
            Call {PHONE_DISPLAY}
          </a>
        </div>

        <div>
          <h2>Services</h2>
          <nav className="rescue-footer-links" aria-label="Footer service hubs">
            {SERVICE_PILLARS.map((page) => (
              <Link key={page.pageSlug} href={toPath(page.pageSlug)}>
                {pageListLabel(page)}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <h2>Popular Help</h2>
          <nav className="rescue-footer-links" aria-label="Footer support pages">
            {SUPPORT_PAGES.slice(0, 7).map((page) => (
              <Link key={page.pageSlug} href={toPath(page.pageSlug)}>
                {pageListLabel(page)}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <h2>Locations</h2>
          <nav className="rescue-footer-links rescue-footer-cities" aria-label="Footer city pages">
            {CITY_PAGES.slice(0, 14).map((page) => (
              <Link key={page.pageSlug} href={toPath(page.pageSlug)} aria-label={pageListLabel(page)}>
                {pageListLabel(page)}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
