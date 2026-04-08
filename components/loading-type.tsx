import { TextType } from "@/components/text-type";

export function LoadingType({ label = "Loading" }: { label?: string }) {
  return (
    <p className="text-sm text-muted">
      <TextType
        texts={[`${label}...`, `${label}..`, `${label}.`, `${label}...`]}
        typingSpeed={40}
        deletingSpeed={22}
        pauseDuration={450}
        className="text-muted"
      />
    </p>
  );
}

