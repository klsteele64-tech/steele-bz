import type { MenuCategory } from "../menuData";

type Props = { category: MenuCategory };

export function MenuSection({ category }: Props) {
  return (
    <section
      className="menu-section"
      id={category.id}
      aria-labelledby={`${category.id}-heading`}
    >
      <h2 id={`${category.id}-heading`}>{category.title}</h2>
      {category.intro ? (
        <p className="menu-section__intro">{category.intro}</p>
      ) : null}
      {category.items.map((item) => (
        <article
          key={`${category.id}-${item.name}-${item.price}`}
          className="menu-item"
        >
          <div className="menu-item__row">
            <h3 className="menu-item__name">{item.name}</h3>
            {item.price ? (
              <span className="menu-item__price">{item.price}</span>
            ) : null}
          </div>
          {item.description ? (
            <p className="menu-item__desc">{item.description}</p>
          ) : null}
        </article>
      ))}
    </section>
  );
}
