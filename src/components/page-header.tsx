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
      <p className="text-xs font-medium uppercase tracking-widest text-amber-400 mb-3">
        {overline}
      </p>
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1] mb-4">
        {title}
      </h1>
      {description && (
        <p className="text-lg text-zinc-400 max-w-2xl">{description}</p>
      )}
    </div>
  );
}
