import { Badge } from "@/components/ui/badge";

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-2xl">
      {eyebrow ? <Badge variant="accent">{eyebrow}</Badge> : null}
      <h2 className="mt-3 font-heading text-2xl font-bold tracking-normal text-[#1B4332] sm:text-3xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-sm leading-7 text-zinc-600 sm:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}
