import { LINKS, TAGLINE } from "../menuData";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__links">
        <a href={LINKS.orderOnline}>Order online (Square)</a>
        <a href={LINKS.website}>Full website</a>
        <a href={LINKS.locations}>Locations</a>
        <a href={LINKS.ourStory}>Our story</a>
        <a href={LINKS.facebook}>Facebook</a>
        <a href={LINKS.instagram}>Instagram</a>
      </div>
      <p>
        <strong>Burger Buds</strong> — {TAGLINE}
      </p>
      <p>
        Menu and hours reflect{" "}
        <a href="https://www.burgerbudspnw.com/">burgerbudspnw.com</a> as of
        this build. Update <code>src/menuData.ts</code> when prices or items
        change.
      </p>
    </footer>
  );
}
