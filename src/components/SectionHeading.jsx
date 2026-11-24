export default function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="mb-14 text-center">
      <p className="section-kicker">{eyebrow}</p>
      <h2 className="section-title">{title}</h2>
      <div className="section-line" />
      {description && <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-500 dark:text-slate-400">{description}</p>}
    </div>
  );
}