export function PageHeader({
  overline,
  title,
  description,
}: {
  overline: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-10">
      <p className="eyebrow mb-3">
        {overline}
      </p>
      <h1 className="text-4xl md:text-5xl font-black tracking-h1 text-ink leading-[1.1] mb-4">
        {title}
      </h1>
      {description && (
        <p className="text-lg text-muted max-w-2xl">{description}</p>
      )}
    </div>
  );
}
