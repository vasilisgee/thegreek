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
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ChevronDown, Circle, Square } from "lucide-react";
import { ComponentType, useState } from "react";
import { RiSparkling2Line } from "react-icons/ri";
import { MdOutlineRoundedCorner, MdLanguage } from "react-icons/md";
import { FaLetterboxd, FaRegFloppyDisk } from "react-icons/fa6";
import FileCard from "@/components/admin/FileCard";
import { LuPaintBucket } from "react-icons/lu";
import { RiFontSize } from "react-icons/ri";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { TbGhost3 } from "react-icons/tb";
import { useIsGuest } from "@/lib/auth/guest";
import dynamic from "next/dynamic";

const HexColorPicker = dynamic(
  () => import("react-colorful").then((mod) => mod.HexColorPicker),
  { ssr: false }
);
const HexColorInput = dynamic(
  () => import("react-colorful").then((mod) => mod.HexColorInput),
  { ssr: false }
);

const FONT_OPTIONS = [
  "Geom",
  "Roboto",
  "Poppins",
  "Montserrat",
  "Open Sans",
  "Lato",
  "Nunito",
  "Raleway",
  "Work Sans",
  "DM Sans",
  "Source Sans 3",
  "Merriweather",
  "Playfair Display",
  "Oswald",
  "Rubik",
];

const LANGUAGE_OPTIONS = [
  { value: "en", label: "English", locale: "EN" },
  { value: "es", label: "Spanish", locale: "ES" },
  { value: "fr", label: "French", locale: "FR" },
  { value: "de", label: "German", locale: "DE" },
  { value: "it", label: "Italian", locale: "IT" },
  { value: "pt", label: "Portuguese", locale: "PT" },
  { value: "nl", label: "Dutch", locale: "NL" },
  { value: "sv", label: "Swedish", locale: "SV" },
  { value: "pl", label: "Polish", locale: "PL" },
  { value: "el", label: "Greek", locale: "EL" },
  { value: "tr", label: "Turkish", locale: "TR" },
  { value: "ar", label: "Arabic", locale: "AR" },
  { value: "hi", label: "Hindi", locale: "HI" },
  { value: "ja", label: "Japanese", locale: "JA" },
  { value: "ko", label: "Korean", locale: "KO" },
];

const LAYOUT_OPTIONS = [
  {
    value: "rounded",
    label: "Rounded",
    description: "Soft, modern corners.",
    icon: Circle,
  },
  {
    value: "square",
    label: "Square",
    description: "Crisp, sharp edges.",
    icon: Square,
  },
] as const;

export default function AdminAppearancePage() {
  const { toast } = useToast();
  const isGuest = useIsGuest();
  const [layoutStyle, setLayoutStyle] = useState<(typeof LAYOUT_OPTIONS)[number]["value"]>("rounded");
  const selectedLayout =
    LAYOUT_OPTIONS.find((option) => option.value === layoutStyle) ??
    LAYOUT_OPTIONS[0];
  const SelectedLayoutIcon = selectedLayout.icon;
  const [fontFamily, setFontFamily] = useState(FONT_OPTIONS[0]);
  const [mainLanguage, setMainLanguage] = useState(LANGUAGE_OPTIONS[0].value);
  const [secondaryLanguage, setSecondaryLanguage] = useState("sv");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [brandColor, setBrandColor] = useState("#151a3f");
  const [backgroundColor, setBackgroundColor] = useState("#f5f3f0");
  const [textColor, setTextColor] = useState("#e2e8f0");
  const [headingColor, setHeadingColor] = useState("#151a3f");
  const selectedFont = FONT_OPTIONS.find((font) => font === fontFamily) ?? FONT_OPTIONS[0];
  const selectedMainLanguage =
    LANGUAGE_OPTIONS.find((option) => option.value === mainLanguage) ?? LANGUAGE_OPTIONS[0];
  const selectedSecondaryLanguage =
    LANGUAGE_OPTIONS.find((option) => option.value === secondaryLanguage) ??
    LANGUAGE_OPTIONS.find((option) => option.value === "sv") ??
    LANGUAGE_OPTIONS[1];

  function handleSave() {
    if (isGuest) {
      toast({
        title: "Guest mode",
        description: (
          <div className="flex items-center gap-2">
            <TbGhost3 className="h-5 w-5" />
            <span className="text-xs text-muted-foreground">
              Saving is disabled for guest users.
            </span>
          </div>
        ),
      });
      return;
    }

    toast({
      title: "Settings saved",
      description: (
        <div className="flex items-center gap-2">
          <FaRegFloppyDisk className="h-5 w-5" />
          <span className="text-xs text-muted-foreground">
            Your changes were saved successfully.
          </span>
        </div>
      ),
    });
  }

  return (
    <div className="p-7 space-y-10">
      <Card>
        <Collapsible defaultOpen>
          <CardHeader className="flex flex-row items-center justify-between pt-4 pb-4">
            <CardTitle className="text-md">Website Appearance</CardTitle>

            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon" className="group !mt-0">
                <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
              </Button>
            </CollapsibleTrigger>
          </CardHeader>

          <Separator />

          <CollapsibleContent>
            <CardContent className="mt-7 space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                {/* LEFT COLUMN */}
                <div className="space-y-6">
                  <SectionHeader
                    icon={FaLetterboxd}
                    title="Site logo"
                    description="Upload the primary logo used in the header and footer."
                  />

                  <FileCard
                    title="Logo file"
                    hideHeader
                    value={null}
                    file={logoFile}
                    onFileChange={setLogoFile}
                    accept=".jpg,.jpeg,.png,.svg"
                    allowedMimeTypes={["image/jpeg", "image/png", "image/svg+xml"]}
                    allowedExtensions={[".jpg", ".jpeg", ".png", ".svg"]}
                    uploadLabel="Upload Logo"
                    invalidMessage="Only JPG, PNG, or SVG files are allowed."
                  />

                  <div className="pt-1" />

                  <SectionHeader
                    icon={LuPaintBucket}
                    title="Colors"
                    description="Set the core color palette for the website."
                  />

                  <div className="grid grid-cols-4 gap-4">
                    <ColorPickerField
                      id="main-color"
                      label="Brand"
                      color={brandColor}
                      onChange={setBrandColor}
                    />
                    <ColorPickerField
                      id="background-color"
                      label="Background"
                      color={backgroundColor}
                      onChange={setBackgroundColor}
                    />
                    <ColorPickerField
                      id="titles-color"
                      label="Headings"
                      color={headingColor}
                      onChange={setHeadingColor}
                    />
                    <ColorPickerField
                      id="text-color"
                      label="Text"
                      color={textColor}
                      onChange={setTextColor}
                    />
                  </div>

                  <div className="pt-[10px]" />

                  <SectionHeader
                    icon={RiFontSize}
                    title="Font"
                    description="Pick a Google Font for the website typography."
                  />

                  <div className="space-y-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          id="font-family"
                          variant="outline"
                          className="h-[45px] w-full justify-between text-sm font-normal"
                        >
                          <span className="truncate">{selectedFont}</span>
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="start"
                        className="w-[var(--radix-dropdown-menu-trigger-width)]"
                      >
                        {FONT_OPTIONS.map((font) => (
                          <DropdownMenuItem
                            key={font}
                            onSelect={() => setFontFamily(font)}
                            className={`text-sm font-normal ${
                              font === fontFamily ? "bg-accent text-accent-foreground" : ""
                            }`}
                          >
                            {font}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="space-y-6">
                  <SectionHeader
                    icon={RiSparkling2Line}
                    title="Animations"
                    description="Enable or disable motion throughout the site."
                  />

                  <div className="flex items-center justify-between gap-4 rounded-md border border-border px-3 py-3">
                    <div>
                      <p className="text-sm font-medium">Enable animations</p>
                      <p className="text-xs text-muted-foreground">
                        Smooth transitions and subtle effects.
                      </p>
                    </div>
                    <Switch id="animations-toggle" defaultChecked />
                  </div>

                  <div className="pt-1" />

                  <SectionHeader
                    icon={MdOutlineRoundedCorner}
                    title="Layout"
                    description="Choose the corner style used across UI elements."
                  />

                  <div className="space-y-1">
                    <Label htmlFor="layout-style">Corner style</Label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          id="layout-style"
                          variant="outline"
                          className="h-[45px] w-full justify-between"
                        >
                          <span className="inline-flex items-center gap-2">
                            <SelectedLayoutIcon className="h-4 w-4 text-muted-foreground" />
                            {selectedLayout.label}
                          </span>
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="start"
                        className="w-[var(--radix-dropdown-menu-trigger-width)]"
                      >
                        {LAYOUT_OPTIONS.map((option) => {
                          const Icon = option.icon;
                          const isSelected = option.value === layoutStyle;
                          return (
                            <DropdownMenuItem
                              key={option.value}
                              onSelect={() => setLayoutStyle(option.value)}
                              className={`gap-2 ${isSelected ? "bg-accent text-accent-foreground" : ""}`}
                            >
                              <Icon className="h-4 w-4 text-muted-foreground" />
                              <div className="flex flex-col">
                                <span>{option.label}</span>
                                <span className="text-xs text-muted-foreground">
                                  {option.description}
                                </span>
                              </div>
                            </DropdownMenuItem>
                          );
                        })}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="pt-1" />

                  <SectionHeader
                    icon={MdLanguage}
                    title="Languages"
                    description="Set the main and secondary languages."
                  />

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="language-main">Main language</Label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            id="language-main"
                            variant="outline"
                            className="h-[45px] w-full justify-between"
                          >
                            <span className="inline-flex items-center gap-2">
                              <span className="inline-flex items-center justify-center rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                                {selectedMainLanguage.locale}
                              </span>
                              {selectedMainLanguage.label}
                            </span>
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="start"
                          className="w-[var(--radix-dropdown-menu-trigger-width)]"
                        >
                          {LANGUAGE_OPTIONS.map((language) => (
                            <DropdownMenuItem
                              key={language.value}
                              onSelect={() => setMainLanguage(language.value)}
                              className={
                                language.value === mainLanguage
                                  ? "bg-accent text-accent-foreground"
                                  : undefined
                              }
                            >
                              <span className="inline-flex items-center justify-center rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                                {language.locale}
                              </span>
                              <span>{language.label}</span>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="language-secondary">
                        Secondary language
                      </Label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            id="language-secondary"
                            variant="outline"
                            className="h-[45px] w-full justify-between"
                          >
                            <span className="inline-flex items-center gap-2">
                              <span className="inline-flex items-center justify-center rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                                {selectedSecondaryLanguage.locale}
                              </span>
                              {selectedSecondaryLanguage.label}
                            </span>
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="start"
                          className="w-[var(--radix-dropdown-menu-trigger-width)]"
                        >
                          {LANGUAGE_OPTIONS.map((language) => (
                            <DropdownMenuItem
                              key={language.value}
                              onSelect={() => setSecondaryLanguage(language.value)}
                              className={
                                language.value === secondaryLanguage
                                  ? "bg-accent text-accent-foreground"
                                  : undefined
                              }
                            >
                              <span className="inline-flex items-center justify-center rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                                {language.locale}
                              </span>
                              <span>{language.label}</span>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </div>

              <div className="py-2">
                <Separator />
              </div>

              <div className="flex justify-end">
                <Button type="button" onClick={handleSave}>
                  Save changes
                </Button>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  );
}

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

function ColorPickerField({
  id,
  label,
  color,
  onChange,
}: {
  id: string;
  label: string;
  color: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1">
      <Label htmlFor={id}>{label}</Label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            id={id}
            variant="outline"
            className="h-[45px] w-full justify-between px-3"
          >
            <span className="inline-flex items-center gap-2">
              <span
                className="h-5 w-5 rounded-sm border border-border"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs text-muted-foreground">
                {color.toUpperCase()}
              </span>
            </span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-[var(--radix-dropdown-menu-trigger-width)] p-3"
        >
          <div className="space-y-3">
            <HexColorPicker
              color={color}
              onChange={onChange}
              style={{ width: "100%", height: 140 }}
            />
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-medium text-muted-foreground">
                HEX
              </span>
              <HexColorInput
                color={color}
                onChange={onChange}
                prefixed
                className="h-[45px] w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
