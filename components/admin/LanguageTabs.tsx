"use client";

export function LanguageTabs({
  active,
  onChange,
}: {
  active: "en" | "sv";
  onChange: (lang: "en" | "sv") => void;
}) {
  return (
    <div className="flex gap-2 mb-4">
      <button
        onClick={() => onChange("en")}
        className={`px-3 py-1 rounded-md text-sm ${
          active === "en"
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        }`}
      >
        English
      </button>
      <button
        onClick={() => onChange("sv")}
        className={`px-3 py-1 rounded-md text-sm ${
          active === "sv"
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        }`}
      >
        Svenska
      </button>
    </div>
  );
}
