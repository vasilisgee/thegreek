"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { RiLayoutTopLine, RiImageLine } from "react-icons/ri";
import { TfiLayoutSlider } from "react-icons/tfi";
import { HiOutlineUserGroup } from "react-icons/hi";
import { HiOutlineEnvelope } from "react-icons/hi2";
import { ChevronDown } from "lucide-react";
import { ComponentType } from "react";
import { useWebsiteTexts } from "@/hooks/use-website-texts";

export default function AdminTextsPage() {
  const {
    texts,
    activeLang,
    setActiveLang,
    updateField,
    saveTexts,
    loading,
    isLoading,
  } = useWebsiteTexts();

  return (
    <div className="p-7 space-y-10">
      <Card>
        <Collapsible defaultOpen>
          <CardHeader className="flex flex-row items-center justify-between pt-4 pb-4">
            <CardTitle className="text-md">Titles & Descriptions</CardTitle>

            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon" className="group !mt-0">
                <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
              </Button>
            </CollapsibleTrigger>
          </CardHeader>

          <Separator />

          <CollapsibleContent>
            <CardContent className="mt-7 space-y-6">
              {isLoading ? (
                <ContentGridSkeleton />
              ) : (
                <Tabs
                  value={activeLang}
                  onValueChange={(v) => setActiveLang(v as "en" | "sv")}
                  className="w-full"
                >
                  <TabsList className="mb-4">
                    <TabsTrigger value="en" className="gap-2">
                      <span
                        aria-hidden="true"
                        className="h-5 w-5 rounded-full overflow-hidden bg-white bg-cover bg-center"
                        style={{ backgroundImage: "url('/flags/england.svg')" }}
                      />
                      English
                    </TabsTrigger>
                    <TabsTrigger value="sv" className="gap-2">
                      <span
                        aria-hidden="true"
                        className="h-5 w-5 rounded-full overflow-hidden bg-white bg-cover bg-center"
                        style={{ backgroundImage: "url('/flags/sweden.svg')" }}
                      />
                      Swedish
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="en">
                    <ContentGrid
                      lang="en"
                      values={texts.en}
                      onChange={updateField}
                      placeholders={{
                        heroTitle: "Type the English headline",
                        heroSubtitle: "Type the English tagline",
                        heroButton: "e.g. 'Explore more'",

                        galleryTitle: "Type the English title",
                        galleryButton: "e.g. 'Check events'",
                        galleryUrl: "Enter the button URL",

                        aboutTitle: "Type the English title",
                        aboutSubtitle: "Type the English card title",
                        aboutText: "Type the English card text...",

                        contactTitle: "Type the English title",
                        footerTitle: "Type the English title",
                      }}
                    />
                  </TabsContent>

                  <TabsContent value="sv">
                    <ContentGrid
                      lang="sv"
                      values={texts.sv}
                      onChange={updateField}
                      placeholders={{
                        heroTitle: "Skriv den svenska rubriken",
                        heroSubtitle: "Skriv den svenska underrubriken",
                        heroButton: 't.ex. "Utforska mer"',

                        galleryTitle: "Skriv den svenska rubriken",
                        galleryButton: 't.ex. "Se evenemang"',
                        galleryUrl: "Ange knapplänken",

                        aboutTitle: "Skriv den svenska rubriken",
                        aboutSubtitle: "Skriv den svenska korttiteln",
                        aboutText: "Skriv den svenska korttexten...",

                        contactTitle: "Skriv den svenska rubriken",
                        footerTitle: "Skriv den svenska rubriken",
                      }}
                    />
                  </TabsContent>
                </Tabs>
              )}

              <div className="py-2">
                <Separator />
              </div>

              <div className="flex justify-end">
                {isLoading ? (
                  <Skeleton className="h-8 w-32 rounded-md animate-pulse [animation-duration:2s] bg-muted/80" />
                ) : (
                  <Button onClick={saveTexts} disabled={loading}>
                    Save changes
                  </Button>
                )}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  );
}

/* ================= SHARED GRID ================= */

function ContentGrid({
  placeholders,
  values,
  onChange,
  lang,
}: {
  placeholders: Record<string, string>;
  values: any;
  onChange: (key: any, value: string, lang: "en" | "sv") => void;
  lang: "en" | "sv";
}) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-5">
        <SectionHeader
          icon={RiLayoutTopLine}
          title="Hero Section"
          description="Main headline content shown at the top of the homepage."
        />

        <LabeledInput
          label="Headline"
          placeholder={placeholders.heroTitle}
          value={values.hero_title}
          onChange={(v) => onChange("hero_title", v, lang)}
        />
        <LabeledInput
          label="Tagline"
          placeholder={placeholders.heroSubtitle}
          value={values.hero_subtitle}
          onChange={(v) => onChange("hero_subtitle", v, lang)}
        />
        <LabeledInput
          label="Button text"
          placeholder={placeholders.heroButton}
          value={values.hero_button_text}
          onChange={(v) => onChange("hero_button_text", v, lang)}
        />

        <div className="pt-1" />

        <SectionHeader
          icon={TfiLayoutSlider}
          title="Image Slider"
          description="Title and button text for the events gallery."
        />

        <LabeledInput
          label="Title"
          placeholder={placeholders.galleryTitle}
          value={values.gallery_title}
          onChange={(v) => onChange("gallery_title", v, lang)}
        />
        <LabeledInput
          label="Button text"
          placeholder={placeholders.galleryButton}
          value={values.gallery_button_text}
          onChange={(v) => onChange("gallery_button_text", v, lang)}
        />
        <LabeledInput
          label="Button URL"
          placeholder={placeholders.galleryUrl}
          value={values.gallery_button_url}
          onChange={(v) => onChange("gallery_button_url", v, lang)}
        />
      </div>

      <div className="space-y-5">
        <SectionHeader
          icon={HiOutlineUserGroup}
          title="About Section"
          description="Content about the restaurant section."
        />

        <LabeledInput
          label="Title"
          placeholder={placeholders.aboutTitle}
          value={values.about_title}
          onChange={(v) => onChange("about_title", v, lang)}
        />
        <LabeledInput
          label="Card title"
          placeholder={placeholders.aboutSubtitle}
          value={values.about_subtitle}
          onChange={(v) => onChange("about_subtitle", v, lang)}
        />
        <LabeledTextarea
          label="Card text"
          placeholder={placeholders.aboutText}
          value={values.about_text}
          onChange={(v) => onChange("about_text", v, lang)}
        />

        <div className="pt-1" />

        <SectionHeader
          icon={HiOutlineEnvelope}
          title="Contact & Footer"
          description="Titles used in the Contact section and website footer."
        />

        <LabeledInput
          label="Contact title"
          placeholder={placeholders.contactTitle}
          value={values.contact_title}
          onChange={(v) => onChange("contact_title", v, lang)}
        />
        <LabeledInput
          label="Footer title"
          placeholder={placeholders.footerTitle}
          value={values.footer_title}
          onChange={(v) => onChange("footer_title", v, lang)}
        />
      </div>
    </div>
  );
}

/* ================= HELPERS ================= */

function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 mb-2">
      <Icon className="text-brand-primary/80 bg-muted/60 border border-border/60 rounded-md w-9 h-9 p-2 mt-1" />
      <div>
        <h4 className="text-md font-medium">{title}</h4>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function LabeledInput({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1">
      <h4 className="text-sm font-medium">{label}</h4>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function LabeledTextarea({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1">
      <h4 className="text-sm font-medium">{label}</h4>
      <Textarea
        rows={5}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function ContentGridSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-5">
        <SectionHeader
          icon={RiLayoutTopLine}
          title="Hero Section"
          description="Main headline content shown at the top of the homepage."
        />

        <div className="space-y-1">
          <Skeleton className="w-32 h-6 rounded-md animate-pulse [animation-duration:2s] bg-muted/80 mb-3" />
          <Skeleton className="h-9 w-full rounded-md animate-pulse [animation-duration:2s] bg-muted/80" />
        </div>
        <div className="space-y-1">
          <Skeleton className="w-32 h-6 rounded-md animate-pulse [animation-duration:2s] bg-muted/80 mb-3" />
          <Skeleton className="h-9 w-full rounded-md animate-pulse [animation-duration:2s] bg-muted/80" />
        </div>
        <div className="space-y-1">
          <Skeleton className="w-32 h-6 rounded-md animate-pulse [animation-duration:2s] bg-muted/80 mb-3" />
          <Skeleton className="h-9 w-full rounded-md animate-pulse [animation-duration:2s] bg-muted/80" />
        </div>

        <div className="pt-1" />

        <SectionHeader
          icon={RiImageLine}
          title="Gallery Section"
          description="Title and button text for the events gallery."
        />

        <div className="space-y-1">
          <Skeleton className="w-32 h-6 rounded-md animate-pulse [animation-duration:2s] bg-muted/80 mb-3" />
          <Skeleton className="h-9 w-full rounded-md animate-pulse [animation-duration:2s] bg-muted/80" />
        </div>
        <div className="space-y-1">
          <Skeleton className="w-32 h-6 rounded-md animate-pulse [animation-duration:2s] bg-muted/80 mb-3" />
          <Skeleton className="h-9 w-full rounded-md animate-pulse [animation-duration:2s] bg-muted/80" />
        </div>
        <div className="space-y-1">
          <Skeleton className="w-32 h-6 rounded-md animate-pulse [animation-duration:2s] bg-muted/80 mb-3" />
          <Skeleton className="h-9 w-full rounded-md animate-pulse [animation-duration:2s] bg-muted/80" />
        </div>
      </div>

      <div className="space-y-5">
        <SectionHeader
          icon={HiOutlineUserGroup}
          title="About Section"
          description="Content about the restaurant section."
        />

        <div className="space-y-1">
           <div className="space-y-1">
          <Skeleton className="w-32 h-6 rounded-md animate-pulse [animation-duration:2s] bg-muted/80 mb-3" />
          <Skeleton className="h-9 w-full rounded-md animate-pulse [animation-duration:2s] bg-muted/80" />
        </div>
         <div className="space-y-1 !mt-5">
          <Skeleton className="w-32 h-6 rounded-md animate-pulse [animation-duration:2s] bg-muted/80 mb-3" />
          <Skeleton className="h-9 w-full rounded-md animate-pulse [animation-duration:2s] bg-muted/80" />
        </div>
         <div className="space-y-1 !mt-5">
          <Skeleton className="w-32 h-6 rounded-md animate-pulse [animation-duration:2s] bg-muted/80 mb-3" />
           <Skeleton className="h-24 w-full rounded-md animate-pulse [animation-duration:2s] bg-muted/80" />
        </div>
        
        </div>

        <div className="pt-1" />

        <SectionHeader
          icon={HiOutlineEnvelope}
          title="Contact & Footer"
          description="Titles used in the Contact section and website footer."
        />

        <div className="space-y-1">
          <Skeleton className="w-32 h-6 rounded-md animate-pulse [animation-duration:2s] bg-muted/80 mb-3" />
          <Skeleton className="h-9 w-full rounded-md animate-pulse [animation-duration:2s] bg-muted/80" />
        </div>
        <div className="space-y-1">
          <Skeleton className="w-32 h-6 rounded-md animate-pulse [animation-duration:2s] bg-muted/80 mb-3" />
          <Skeleton className="h-9 w-full rounded-md animate-pulse [animation-duration:2s] bg-muted/80" />
        </div>
      </div>
    </div>
  );
}
