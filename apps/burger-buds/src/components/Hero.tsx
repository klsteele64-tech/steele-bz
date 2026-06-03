import { HERO_COPY, LINKS } from "../menuData";

export function Hero() {
  return (
    <header className="hero" id="top">
      <h1>{HERO_COPY.title}</h1>
      <p className="hero__tagline">{HERO_COPY.subtitle}</p>
      <p className="hero__body">{HERO_COPY.body}</p>
      <p style={{ marginTop: "1.25rem" }}>
        <a className="btn btn--ghost" href={LINKS.ourStory}>
          Our story
        </a>
      </p>
    </header>
  );
}
