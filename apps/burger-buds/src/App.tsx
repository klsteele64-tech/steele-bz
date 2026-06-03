import "./index.css";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { HoursAndLocations } from "./components/HoursAndLocations";
import { MenuSection } from "./components/MenuSection";
import { LINKS, MENU_CATEGORIES, NAV_LABELS } from "./menuData";

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to menu
      </a>
      <header className="site-header">
        <div className="site-header__inner">
          <a className="brand" href="#top">
            Burger Buds
          </a>
          <div className="header-actions">
            <a
              className="btn btn--primary"
              href={LINKS.orderOnline}
              rel="noopener noreferrer"
              target="_blank"
            >
              Order online
            </a>
            <a
              className="btn btn--ghost"
              href={LINKS.website}
              rel="noopener noreferrer"
              target="_blank"
            >
              Full site
            </a>
          </div>
          <nav className="category-nav" aria-label="Menu sections">
            {MENU_CATEGORIES.map((c) => (
              <a key={c.id} href={`#${c.id}`}>
                {NAV_LABELS[c.id] ?? c.title}
              </a>
            ))}
            <a href="#hours">Hours</a>
          </nav>
        </div>
      </header>

      <main id="main" className="shell" tabIndex={-1}>
        <Hero />
        {MENU_CATEGORIES.map((category) => (
          <MenuSection key={category.id} category={category} />
        ))}
        <HoursAndLocations />
        <Footer />
      </main>
    </>
  );
}
