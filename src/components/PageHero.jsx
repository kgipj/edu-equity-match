export function PageHero({ eyebrow, title, description, aside }) {
  return (
    <section className="page-hero">
      <div className="container page-hero-grid">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="lead">{description}</p>
        </div>
        {aside && <div className="page-hero-aside">{aside}</div>}
      </div>
    </section>
  )
}
