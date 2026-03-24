"use client";

import { useEffect, useState } from "react";
import {
  useCatalogue,
  type CatalogueCategory,
  type CatalogueItem,
  type CatalogueLanguage,
} from "@/hooks/use-catalogue";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import ImageCard from "@/components/admin/ImageCard";
import {
  Sortable,
  SortableContent,
  SortableItem,
  SortableItemHandle,
} from "@/components/ui/sortable";
import { closestCorners } from "@dnd-kit/core";
import {
  ChevronDown,
  GripVertical,
  Image as ImageIcon,
  Package,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { LuBox } from "react-icons/lu";
import { TbPencil } from "react-icons/tb";


type Language = CatalogueLanguage;

const createId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const createItem = (order = 1): CatalogueItem => ({
  id: createId(),
  order,
  image: null,
  file: null,
  title: { en: "", sv: "" },
  description: { en: "", sv: "" },
  tags: { en: [], sv: [] },
  tagInput: { en: "", sv: "" },
});

const createCategory = (index: number): CatalogueCategory => ({
  id: createId(),
  title: {
    en: `Catalogue Category ${index}`,
    sv: "",
  },
  order: index,
  items: [],
});

type CatalogueItemPreviewImageProps = {
  value: string | null;
  file: File | null;
  title: string;
};

function CatalogueItemPreviewImage({
  value,
  file,
  title,
}: CatalogueItemPreviewImageProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }

    if (!value) {
      setPreviewUrl(null);
      return;
    }

    const baseUrl = value.startsWith("http")
      ? value
      : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/site-assets/${value}`;
    const separator = baseUrl.includes("?") ? "&" : "?";
    setPreviewUrl(`${baseUrl}${separator}v=${Date.now()}`);
  }, [file, value]);

  useEffect(() => {
    setIsLoaded(!previewUrl);
  }, [previewUrl]);

  return (
    <div className="relative h-16 w-16 shrink-0  items-center justify-center">
      {previewUrl ? (
        <>
          {!isLoaded && (
            <div className="absolute inset-0">
              <Skeleton className="h-full w-full rounded-lg" />
            </div>
          )}
          <img
            src={previewUrl}
            alt={title}
            className="h-full w-full object-cover rounded-full border bg-muted/30 "
            onLoad={() => setIsLoaded(true)}
            onError={() => setIsLoaded(true)}
            style={{ opacity: isLoaded ? 1 : 0 }}
          />
        </>
      ) : (
        <div className="flex h-full w-full items-center justify-center ">
          <LuBox className=" bg-muted/60 border border-border/60 rounded-md w-8 h-8 p-2 mt-1" />
        </div>
      )}
    </div>
  );
}

export default function AdminCataloguePage() {
  const {
    categories,
    setCategories,
    saveCatalogue,
    deleteCategory,
    loading,
    isLoading,
  } = useCatalogue();
  const [openCategoryIds, setOpenCategoryIds] = useState<string[]>([]);

  const updateCategoryTitle = (
    categoryId: string,
    lang: Language,
    title: string,
  ) => {
    setCategories((prev) =>
      prev.map((category) =>
        category.id === categoryId
          ? { ...category, title: { ...category.title, [lang]: title } }
          : category,
      ),
    );
  };

  const updateItem = (
    categoryId: string,
    itemId: string,
    updater: (item: CatalogueItem) => CatalogueItem,
  ) => {
    setCategories((prev) =>
      prev.map((category) => {
        if (category.id !== categoryId) return category;
        return {
          ...category,
          items: category.items.map((item) =>
            item.id === itemId ? updater(item) : item,
          ),
        };
      }),
    );
  };

  const addCategory = () => {
    setCategories((prev) => {
      const newCategory = createCategory(prev.length + 1);
      setOpenCategoryIds((current) =>
        current.includes(newCategory.id)
          ? current
          : [...current, newCategory.id],
      );
      return [...prev, newCategory];
    });
  };

  const handleDeleteCategory = (categoryId: string) => {
    setOpenCategoryIds((prev) => prev.filter((id) => id !== categoryId));
    deleteCategory(categoryId);
  };

  const addItem = (categoryId: string) => {
    setCategories((prev) =>
      prev.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              items: [
                ...category.items,
                createItem(category.items.length + 1),
              ],
            }
          : category,
      ),
    );
  };

  const removeItem = (categoryId: string, itemIndex: number) => {
    setCategories((prev) =>
      prev.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              items: category.items
                .filter((_, index) => index !== itemIndex)
                .map((item, index) => ({ ...item, order: index + 1 })),
            }
          : category,
      ),
    );
  };

  const handleTagInputChange = (
    categoryId: string,
    itemId: string,
    lang: Language,
    value: string,
  ) => {
    updateItem(categoryId, itemId, (item) => ({
      ...item,
      tagInput: { ...item.tagInput, [lang]: value },
    }));
  };

  const commitTags = (categoryId: string, itemId: string, lang: Language) => {
    updateItem(categoryId, itemId, (item) => {
      const raw = item.tagInput[lang].trim();
      if (!raw) return item;
      const nextTags = raw
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
        .filter((tag) => !item.tags[lang].includes(tag));
      if (!nextTags.length) {
        return { ...item, tagInput: { ...item.tagInput, [lang]: "" } };
      }
      return {
        ...item,
        tags: { ...item.tags, [lang]: [...item.tags[lang], ...nextTags] },
        tagInput: { ...item.tagInput, [lang]: "" },
      };
    });
  };

  const removeTag = (
    categoryId: string,
    itemId: string,
    lang: Language,
    tag: string,
  ) => {
    updateItem(categoryId, itemId, (item) => ({
      ...item,
      tags: {
        ...item.tags,
        [lang]: item.tags[lang].filter((t) => t !== tag),
      },
    }));
  };

  const updateCategoryItems = (categoryId: string, items: CatalogueItem[]) => {
    setCategories((prev) =>
      prev.map((category) =>
        category.id === categoryId ? { ...category, items } : category,
      ),
    );
  };

  const handleSaveCategory = () => {
    saveCatalogue();
  };

  const skeletonCards = Array.from({ length: 3 });

  return (
    <div className="p-7">
      {isLoading ? (
        <div className="space-y-8">
          {skeletonCards.map((_, index) => (
            <Card key={`category-skeleton-${index}`}>
              <CardHeader className="flex flex-row items-center justify-between gap-4 pt-4 pb-4">
                <div className="flex-1">
                  <Skeleton className="h-6 w-56 rounded-md" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-7 w-7 rounded-md" />
                  <Skeleton className="h-7 w-7 rounded-md" />
                  <Skeleton className="h-7 w-7 rounded-md" />
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="mt-6 space-y-4">
                <Skeleton className="h-20 w-full rounded-xl" />
                <Skeleton className="h-20 w-full rounded-xl" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-9 w-24 rounded-md" />
                  <Skeleton className="h-9 w-32 rounded-md" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Sortable
          value={categories}
          onValueChange={setCategories}
          getItemValue={(category) => category.id}
          orientation="vertical"
        >
          <SortableContent className="flex flex-col gap-8">
          {categories.map((category, categoryIndex) => {
            const isEmpty = category.items.length === 0;
            const titlePlaceholder = `Catalogue Category ${categoryIndex + 1}`;
            const categoryTitleEn = category.title?.en?.trim() ?? "";
            const displayTitle = categoryTitleEn || titlePlaceholder;

            return (
              <SortableItem key={category.id} value={category.id}>
                <Card>
                  <Collapsible
                    open={openCategoryIds.includes(category.id)}
                    onOpenChange={(isOpen) =>
                      setOpenCategoryIds((prev) =>
                        isOpen
                          ? prev.includes(category.id)
                            ? prev
                            : [...prev, category.id]
                          : prev.filter((id) => id !== category.id),
                      )
                    }
                  >
                    <CardHeader className="flex flex-row items-center justify-between gap-4 pt-4 pb-4">
                      <div className="flex-1">
                        <CardTitle className="text-md">
                          {isLoading ? (
                            <Skeleton className="h-6 w-56 rounded-md" />
                          ) : (
                            displayTitle
                          )}
                        </CardTitle>
                      </div>

                      <div className="flex items-center gap-1 mt-0!">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="mt-0! h-7 w-7"
                              aria-label="Edit category title"
                            >
                              <TbPencil className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent align="end" className="w-80">
                            <div className="space-y-4">
                              <div>
                                <h4 className="text-sm font-semibold">
                                  Edit category title
                                </h4>
                                <p className="text-xs text-muted-foreground">
                                  Set the name for each language.
                                </p>
                              </div>
                              <Tabs defaultValue="en">
                                <TabsList className="w-full">
                                  <TabsTrigger value="en" className="flex-1 gap-2 group">
                                    <span
                                      aria-hidden="true"
                                      className="h-5 w-5 rounded-full overflow-hidden bg-white bg-cover bg-center opacity-50 transition-opacity group-data-[state=active]:opacity-100"
                                      style={{ backgroundImage: "url('/flags/england.svg')" }}
                                    />
                                    English
                                  </TabsTrigger>
                                  <TabsTrigger value="sv" className="flex-1 gap-2 group">
                                    <span
                                      aria-hidden="true"
                                      className="h-5 w-5 rounded-full overflow-hidden bg-white bg-cover bg-center opacity-50 transition-opacity group-data-[state=active]:opacity-100"
                                      style={{ backgroundImage: "url('/flags/sweden.svg')" }}
                                    />
                                    Swedish
                                  </TabsTrigger>
                                </TabsList>
                                <TabsContent value="en" className="space-y-2">
                                  <Input
                                    id={`category-title-en-${category.id}`}
                                    value={category.title.en}
                                    onChange={(e) =>
                                      updateCategoryTitle(
                                        category.id,
                                        "en",
                                        e.target.value,
                                      )
                                    }
                                    placeholder={titlePlaceholder}
                                  />
                                </TabsContent>
                                <TabsContent value="sv" className="space-y-2">
                                  <Input
                                    id={`category-title-sv-${category.id}`}
                                    value={category.title.sv}
                                    onChange={(e) =>
                                      updateCategoryTitle(
                                        category.id,
                                        "sv",
                                        e.target.value,
                                      )
                                    }
                                    placeholder="Katalogkategori"
                                  />
                                </TabsContent>
                              </Tabs>
                            </div>
                          </PopoverContent>
                        </Popover>
                        <SortableItemHandle>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="mt-0! h-7 w-7 cursor-grab active:cursor-grabbing"
                            aria-label="Reorder category"
                          >
                            <GripVertical className="h-4 w-4" />
                          </Button>
                        </SortableItemHandle>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="icon" className="group mt-0!">
                            <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                    </CardHeader>

                    <Separator className="group-data-[state=closed]/collapsible:hidden" />

                    <CollapsibleContent>
                      <CardContent className="mt-6 space-y-6">
                        {isEmpty ? (
                          <EmptyState
                            title="No items yet"
                            description="Create your first menu item for this category."
                            icon={<LuBox className=" bg-muted/60 border border-border/60 rounded-md w-9 h-9 p-2" />}
                            action={
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => addItem(category.id)}
                              >
                                Add item
                                <Plus className="h-4 w-4" />
                              </Button>
                            }
                          />
                        ) : (
                          <Sortable
                            value={category.items}
                            onValueChange={(items) =>
                              updateCategoryItems(category.id, items)
                            }
                            getItemValue={(item) => item.id}
                            orientation="vertical"
                            collisionDetection={closestCorners}
                          >
                            <SortableContent className="min-h-[260px] flex flex-col gap-3 [overflow-anchor:none]">
                              {category.items.map((item, itemIndex) => {
                                const itemLabel =
                                  item.title.en?.trim() ||
                                  item.title.sv?.trim() ||
                                  `Item ${itemIndex + 1}`;
                                const previewTitle = itemLabel;
                                const previewDescription =
                                  item.description.en?.trim() ||
                                  item.description.sv?.trim() ||
                                  "";
                                const previewTags =
                                  item.tags.en.length > 0
                                    ? item.tags.en
                                    : item.tags.sv;

                                return (
                                  <SortableItem key={item.id} value={item.id}>
                                    <div className="group flex flex-col gap-3 rounded-xl border border-border bg-muted/40 p-1 shadow-xs transition-colors data-[state=active]:ring-2 data-[state=active]:ring-primary/30 data-[dragging=true]:opacity-80 md:flex-row md:items-center">
                                      <div className="flex w-full  gap-3 items-center justify-center">
                                        <CatalogueItemPreviewImage
                                          value={item.image}
                                          file={item.file}
                                          title={previewTitle}
                                        />
                                        <div className="flex-1 flex-row flex items-center gap-3">
                                          <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-sm font-semibold">
                                              {previewTitle}
                                            </span>
                                          </div>
                                          {previewTags.length > 0 ? (
                                            <div className="flex flex-wrap gap-1">
                                              {previewTags.map((tag) => (
                                                <span
                                                  key={tag}
                                                  className="inline-flex items-center gap-1 rounded-full border bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground"
                                                >
                                                  {tag}
                                                </span>
                                              ))}
                                            </div>
                                          ) : (
                                            // <span className="text-xs text-muted-foreground">
                                            //   No tags yet.
                                            // </span>
                                            []
                                          )}
                                          {/* <p className="text-xs text-muted-foreground">
                                            {previewDescription || "No description yet."}
                                          </p> */}
                                        </div>
                                      </div>

                                      <div className="flex shrink-0 items-center gap-2 md:ml-auto">
                                        <Popover>
                                          <PopoverTrigger asChild>
                                            <Button
                                              type="button"
                                              size="icon"
                                              variant="ghost"
                                              aria-label={`Edit ${itemLabel}`}
                                            >
                                              <TbPencil className="!h-5 !w-5" />
                                            </Button>
                                          </PopoverTrigger>
                                          <PopoverContent
                                            align="center"
                                            side="left"
                                            sideOffset={12}
                                            className="w-[320px] max-w-[80vw] p-4 max-h-[75vh] overflow-y-auto shadow-lg"
                                          >
                                            <div className="space-y-4">
                                              <div className="mb-0">
                                                <p className="text-sm font-semibold">
                                                  Edit item
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                  Update the image, title, tags and description.
                                                </p>
                                              </div>

                                              <ImageCard
                                                title=""
                                                description=""
                                                value={item.image}
                                                file={item.file}
                                                previewFit="cover"
                                                size="compact"
                                                onFileChange={(file) =>
                                                  updateItem(
                                                    category.id,
                                                    item.id,
                                                    (current) => ({
                                                      ...current,
                                                      file,
                                                    }),
                                                  )
                                                }
                                              />

                                              <Tabs defaultValue="en" className="w-full">
                                                <TabsList className="mb-2 w-full">
                                                  <TabsTrigger
                                                    value="en"
                                                    className="flex-1 justify-center gap-2 group"
                                                  >
                                                    <span
                                                      aria-hidden="true"
                                                      className="h-5 w-5 rounded-full overflow-hidden bg-white bg-cover bg-center opacity-50 transition-opacity group-data-[state=active]:opacity-100"
                                                      style={{
                                                        backgroundImage:
                                                          "url('/flags/england.svg')",
                                                      }}
                                                    />
                                                    English
                                                  </TabsTrigger>
                                                  <TabsTrigger
                                                    value="sv"
                                                    className="flex-1 justify-center gap-2 group"
                                                  >
                                                    <span
                                                      aria-hidden="true"
                                                      className="h-5 w-5 rounded-full overflow-hidden bg-white bg-cover bg-center opacity-50 transition-opacity group-data-[state=active]:opacity-100"
                                                      style={{
                                                        backgroundImage:
                                                          "url('/flags/sweden.svg')",
                                                      }}
                                                    />
                                                    Swedish
                                                  </TabsTrigger>
                                                </TabsList>

                                                {(["en", "sv"] as Language[]).map((lang) => (
                                                  <TabsContent key={lang} value={lang}>
                                                    <div className="space-y-3">
                                                      <div className="space-y-1">
                                                        <Input
                                                          value={item.title[lang]}
                                                          onChange={(event) =>
                                                            updateItem(
                                                              category.id,
                                                              item.id,
                                                              (it) => ({
                                                                ...it,
                                                                title: {
                                                                  ...it.title,
                                                                  [lang]: event.target.value,
                                                                },
                                                              }),
                                                            )
                                                          }
                                                          placeholder={
                                                            lang === "en"
                                                              ? "Title in English"
                                                              : "Titel pa Svenska"
                                                          }
                                                          aria-label={
                                                            lang === "en"
                                                              ? "Title in English"
                                                              : "Titel pa Svenska"
                                                          }
                                                        />
                                                      </div>

                                                      <div className="space-y-1">
                                                        <Textarea
                                                          rows={3}
                                                          value={item.description[lang]}
                                                          onChange={(event) =>
                                                            updateItem(
                                                              category.id,
                                                              item.id,
                                                              (it) => ({
                                                                ...it,
                                                                description: {
                                                                  ...it.description,
                                                                  [lang]: event.target.value,
                                                                },
                                                              }),
                                                            )
                                                          }
                                                          placeholder={
                                                            lang === "en"
                                                              ? "Description in English"
                                                              : "Beskrivning pa Svenska"
                                                          }
                                                          aria-label={
                                                            lang === "en"
                                                              ? "Description in English"
                                                              : "Beskrivning pa Svenska"
                                                          }
                                                        />
                                                      </div>

                                                      <div className="space-y-2">
                                                        <Input
                                                          value={item.tagInput[lang]}
                                                          onChange={(event) =>
                                                            handleTagInputChange(
                                                              category.id,
                                                              item.id,
                                                              lang,
                                                              event.target.value,
                                                            )
                                                          }
                                                          onKeyDown={(event) => {
                                                            if (
                                                              event.key === "Enter" ||
                                                              event.key === ","
                                                            ) {
                                                              event.preventDefault();
                                                              commitTags(
                                                                category.id,
                                                                item.id,
                                                                lang,
                                                              );
                                                            }
                                                          }}
                                                          onBlur={() =>
                                                            commitTags(
                                                              category.id,
                                                              item.id,
                                                              lang,
                                                            )
                                                          }
                                                          placeholder={
                                                            lang === "en"
                                                              ? "Tags in English (Press Enter)"
                                                              : "Taggar pa Svenska (Tryck Enter)"
                                                          }
                                                          aria-label={
                                                            lang === "en"
                                                              ? "Tags in English"
                                                              : "Taggar pa Svenska"
                                                          }
                                                        />
                                                        {item.tags[lang].length > 0 && (
                                                          <div className="flex flex-wrap gap-3 mt-4!">
                                                            {item.tags[lang].map((tag) => (
                                                              <span
                                                                key={tag}
                                                                className="inline-flex items-center gap-1 pr-1 rounded-full bg-muted px-3 border py-1 text-xs font-semibold text-muted-foreground "
                                                              >
                                                                {tag}
                                                                <button
                                                                  type="button"
                                                                  onClick={() =>
                                                                    removeTag(
                                                                      category.id,
                                                                      item.id,
                                                                      lang,
                                                                      tag,
                                                                    )
                                                                  }
                                                                  className="cursor-pointer rounded-full p-0.5 hover:bg-muted-foreground/10"
                                                                  aria-label={`Remove ${tag}`}
                                                                >
                                                                  <X className="h-3 w-3" />
                                                                </button>
                                                              </span>
                                                            ))}
                                                          </div>
                                                        )}
                                                      </div>
                                                    </div>
                                                  </TabsContent>
                                                ))}
                                              </Tabs>
                                            </div>
                                          </PopoverContent>
                                        </Popover>

                                        <AlertDialog>
                                          <AlertDialogTrigger asChild>
                                            <Button
                                              type="button"
                                              size="icon"
                                              variant="ghost"
                                              aria-label={`Delete ${itemLabel}`}
                                            >
                                              <Trash2 className="h-4 w-4" />
                                            </Button>
                                          </AlertDialogTrigger>
                                          <AlertDialogContent size="sm">
                                            <AlertDialogHeader>
                                              <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                                                <Trash2 className="h-5 w-5" />
                                              </AlertDialogMedia>
                                              <AlertDialogTitle>
                                                Delete menu item?
                                              </AlertDialogTitle>
                                              <AlertDialogDescription>
                                                This action cannot be undone.
                                              </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                              <AlertDialogCancel variant="outline">
                                                Cancel
                                              </AlertDialogCancel>
                                              <AlertDialogAction
                                                onClick={() =>
                                                  removeItem(category.id, itemIndex)
                                                }
                                                variant="destructive"
                                              >
                                                Delete
                                              </AlertDialogAction>
                                            </AlertDialogFooter>
                                          </AlertDialogContent>
                                        </AlertDialog>

                                        <SortableItemHandle>
                                          <Button
                                            type="button"
                                            size="icon"
                                            variant="ghost"
                                            className="h-9 w-9 cursor-grab active:cursor-grabbing"
                                            aria-label="Reorder menu item"
                                          >
                                            <GripVertical className="h-4 w-4" />
                                          </Button>
                                        </SortableItemHandle>
                                      </div>
                                    </div>
                                  </SortableItem>
                                );
                              })}
                            </SortableContent>
                          </Sortable>
                        )}

                        <Separator />

                        <div className="flex flex-wrap items-center justify-between gap-3 pb-[25px]">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => addItem(category.id)}
                          >
                            Add item
                            <Plus className="h-4 w-4" />
                          </Button>
                          <div className="flex items-center gap-3">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="text-muted-foreground hover:text-foreground"
                                  disabled={loading}
                                >
                                  Delete category
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent size="sm">
                                <AlertDialogHeader>
                                  <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                                    <Trash2 className="h-5 w-5" />
                                  </AlertDialogMedia>
                                  <AlertDialogTitle>
                                    Delete this category?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel variant="outline">
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteCategory(category.id)}
                                    disabled={loading}
                                    variant="destructive"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                            <Button
                              type="button"
                              onClick={handleSaveCategory}
                              disabled={loading}
                            >
                              Save settings
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              </SortableItem>
            );
          })}
          </SortableContent>
        </Sortable>
      )}

      {!isLoading && (
        <div className="flex justify-center mt-10">
          <Button type="button" variant="outline" onClick={addCategory}>
            Add category
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
