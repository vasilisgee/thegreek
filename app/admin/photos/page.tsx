"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { useMediaAssets } from "@/hooks/use-media-assets";
import { useThumbGallery } from "@/hooks/use-thumb-gallery";
import { useSliderGallery } from "@/hooks/use-slider-gallery";

import { RiLayoutTopLine } from "react-icons/ri";
import { TfiLayoutSlider } from "react-icons/tfi";
import { RiGalleryView } from "react-icons/ri";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ImageCard from "@/components/admin/ImageCard";
import MediaCard from "@/components/admin/MediaCard";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function AdminPhotosPage() {
  const { media, updateField, setFile, files, save, loading, isLoading } =
    useMediaAssets();

  const {
    gallery,
    thumbs,
    setImage,
    save: saveGallery,
    loading: gallerySaving,
  } = useThumbGallery();

  const {
    sliderGallery,
    sliderFiles,
    setSliderField,
    setSliderImage,
    saveSliderGallery,
    sliderLoading,
  } = useSliderGallery();

  return (
    <div className="p-7 space-y-10">
      {/* ================= HERO BACKGROUND ================= */}
      <Card>
        <Collapsible defaultOpen>
          <CardHeader className="flex flex-row items-center justify-between gap-4 pt-4 pb-4">
            <CardTitle className="text-md">Hero Section</CardTitle>

            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon" className="group mt-0!">
                <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
              </Button>
            </CollapsibleTrigger>
          </CardHeader>

          <Separator className="group-data-[state=closed]/collapsible:hidden" />

          <CollapsibleContent>
            <CardContent className="space-y-6 mt-5">
              <div className="space-y-5">
                <div className="flex items-start gap-3 mb-5">
                  <RiLayoutTopLine className="text-brand-primary/80 bg-muted/60 border border-border/60 rounded-md w-9 h-9 p-2 mt-1" />
                  <div>
                    <h4 className="text-md font-medium">Hero Background</h4>
                    <p className="text-xs text-muted-foreground">
                      Upload a background video and image for the top of the website.
                    </p>
                  </div>
                </div>

                {isLoading ? (
                  <Skeleton className="h-64 w-full rounded-md animate-pulse [animation-duration:2s] bg-muted/80" />
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    <MediaCard
                      title="Background Video "
                      description=""
                      mode="video"
                      previewFit="cover"
                      previewHeightClassName="h-72"
                      imageValue={media?.hero_image ?? null}
                      imageFile={files.hero_image ?? null}
                      onImageChange={(file) => setFile("hero_image", file)}
                      videoValue={media?.hero_video ?? null}
                      videoFile={files.hero_video ?? null}
                      onVideoChange={(file) => setFile("hero_video", file)}
                    />
                    <ImageCard
                      title="Background Image "
                      previewFit="cover"
                      previewHeightClassName="h-72"
                      value={media?.hero_image ?? null}
                      file={files.hero_image ?? null}
                      onFileChange={(file) => setFile("hero_image", file)}
                    />
                  </div>
                )}
              </div>

              <div className="pt-2">
                <Separator />
              </div>

              <div className="flex justify-end pb-[25px]">
                {isLoading ? (
                  <Skeleton className="h-8 w-32 rounded-md animate-pulse [animation-duration:2s] bg-muted/80" />
                ) : (
                  <Button onClick={save} disabled={loading}>
                    Save changes
                  </Button>
                )}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* ================= RESTAURANT GALLERY & MENU ================= */}
      <Card>
        <Collapsible defaultOpen>
          <CardHeader className="flex flex-row items-center justify-between gap-4 pt-4 pb-4">
            <CardTitle className="text-md">Restaurant Gallery</CardTitle>

            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon" className="group mt-0!">
                <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
              </Button>
            </CollapsibleTrigger>
          </CardHeader>

          <Separator className="group-data-[state=closed]/collapsible:hidden" />

          <CollapsibleContent>
            <CardContent className="space-y-6 mt-5">
              <div className="grid gap-6">
                {/* LEFT COLUMN */}
                <div className="space-y-5">
                  <div className="flex items-start gap-3 mb-1">
                    <RiGalleryView className="text-brand-primary/80 bg-muted/60 border border-border/60 rounded-md w-9 h-9 p-2 mt-1" />
                    <div>
                      <h4 className="text-md font-medium">Thumbnail Gallery</h4>
                      <p className="text-xs text-muted-foreground">
                        Photos displayed in the about restaurant section.
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-4 gap-6">
                    <ImageCard
                      title=""
                      previewFit="cover"
                      value={gallery.thumb_gallery_1}
                      file={thumbs.thumb_gallery_1 ?? null}
                      onFileChange={(f) => setImage("thumb_gallery_1", f)}
                    />

                    <ImageCard
                      title=""
                      previewFit="cover"
                      value={gallery.thumb_gallery_2}
                      file={thumbs.thumb_gallery_2 ?? null}
                      onFileChange={(f) => setImage("thumb_gallery_2", f)}
                    />

                    <ImageCard
                      title=""
                      previewFit="cover"
                      value={gallery.thumb_gallery_3}
                      file={thumbs.thumb_gallery_3 ?? null}
                      onFileChange={(f) => setImage("thumb_gallery_3", f)}
                    />

                    <ImageCard
                      title=""
                      previewFit="cover"
                      value={gallery.thumb_gallery_4}
                      file={thumbs.thumb_gallery_4 ?? null}
                      onFileChange={(f) => setImage("thumb_gallery_4", f)}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Separator />
              </div>

              <div className="flex justify-end pb-[25px]">
                {isLoading ? (
                  <Skeleton className="h-8 w-32 rounded-md animate-pulse [animation-duration:2s] bg-muted/80" />
                ) : (
                  <Button onClick={saveGallery} disabled={loading}>
                    Save changes
                  </Button>
                )}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* ================= EVENTS GALLERY ================= */}
      <Card>
        <Collapsible defaultOpen>
          <CardHeader className="flex flex-row items-center justify-between gap-4 pt-4 pb-4">
            <CardTitle className="text-md">Events Gallery</CardTitle>

            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon" className="group mt-0!">
                <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
              </Button>
            </CollapsibleTrigger>
          </CardHeader>

          <Separator className="group-data-[state=closed]/collapsible:hidden" />

          <CollapsibleContent>
            <CardContent className="space-y-8 mt-5">
              <div className="flex items-start gap-3 mb-1">
                <TfiLayoutSlider className="text-brand-primary/80 bg-muted/60 border border-border/60 rounded-md w-9 h-9 p-2 mt-1" />
                <div>
                  <h4 className="text-md font-medium">Image Slider</h4>
                  <p className="text-xs text-muted-foreground">
                    Images and titles shown in the events gallery section.
                  </p>
                </div>
              </div>

              {/* EVENTS GRID */}
              <div className="grid md:grid-cols-4 gap-6">
                {/* SLIDE 1 */}
                <div className="space-y-3">
                  <ImageCard
                    title=""
                    previewFit="cover"
                    value={sliderGallery.slider_gallery_1}
                    file={sliderFiles.slider_gallery_1 ?? null}
                    onFileChange={(file) =>
                      setSliderImage("slider_gallery_1", file)
                    }
                  />

                  <Tabs defaultValue="en" className="w-full">
                    <TabsList className="w-full">
                      <TabsTrigger value="en" className="flex-1 gap-2 group">
                        <span
                          aria-hidden="true"
                          className="h-5 w-5 rounded-full overflow-hidden bg-white bg-cover bg-center opacity-50 transition-opacity group-data-[state=active]:opacity-100"
                          style={{
                            backgroundImage: "url('/flags/england.svg')",
                          }}
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

                    <TabsContent value="en">
                      {isLoading ? (
                        <Skeleton className="h-8 w-full rounded-md animate-pulse [animation-duration:2s] bg-muted/80" />
                      ) : (
                        <Input
                          placeholder="Image title in English"
                          value={sliderGallery.slider_gallery_1_title_en ?? ""}
                          onChange={(e) =>
                            setSliderField(
                              "slider_gallery_1_title_en",
                              e.target.value,
                            )
                          }
                        />
                      )}
                    </TabsContent>

                    <TabsContent value="sv">
                      <Input
                        placeholder="Image title in Swedish"
                        value={sliderGallery.slider_gallery_1_title_sv ?? ""}
                        onChange={(e) =>
                          setSliderField(
                            "slider_gallery_1_title_sv",
                            e.target.value,
                          )
                        }
                      />
                    </TabsContent>
                  </Tabs>
                </div>

                {/* SLIDE 2 */}
                <div className="space-y-3">
                  <ImageCard
                    title=""
                    previewFit="cover"
                    value={sliderGallery.slider_gallery_2}
                    file={sliderFiles.slider_gallery_2 ?? null}
                    onFileChange={(file) =>
                      setSliderImage("slider_gallery_2", file)
                    }
                  />

                  <Tabs defaultValue="en" className="w-full">
                    <TabsList className="w-full">
                      <TabsTrigger value="en" className="flex-1 gap-2 group">
                        <span
                          aria-hidden="true"
                          className="h-5 w-5 rounded-full overflow-hidden bg-white bg-cover bg-center opacity-50 transition-opacity group-data-[state=active]:opacity-100"
                          style={{
                            backgroundImage: "url('/flags/england.svg')",
                          }}
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

                    <TabsContent value="en">
                      {isLoading ? (
                        <Skeleton className="h-8 w-full rounded-md animate-pulse [animation-duration:2s] bg-muted/80" />
                      ) : (
                        <Input
                          placeholder="Image title in English"
                          value={sliderGallery.slider_gallery_2_title_en ?? ""}
                          onChange={(e) =>
                            setSliderField(
                              "slider_gallery_2_title_en",
                              e.target.value,
                            )
                          }
                        />
                      )}
                    </TabsContent>

                    <TabsContent value="sv">
                      <Input
                        placeholder="Image title in Swedish"
                        value={sliderGallery.slider_gallery_2_title_sv ?? ""}
                        onChange={(e) =>
                          setSliderField(
                            "slider_gallery_2_title_sv",
                            e.target.value,
                          )
                        }
                      />
                    </TabsContent>
                  </Tabs>
                </div>

                {/* SLIDE 3 */}
                <div className="space-y-3">
                  <ImageCard
                    title=""
                    previewFit="cover"
                    value={sliderGallery.slider_gallery_3}
                    file={sliderFiles.slider_gallery_3 ?? null}
                    onFileChange={(file) =>
                      setSliderImage("slider_gallery_3", file)
                    }
                  />

                  <Tabs defaultValue="en" className="w-full">
                    <TabsList className="w-full">
                      <TabsTrigger value="en" className="flex-1 gap-2 group">
                        <span
                          aria-hidden="true"
                          className="h-5 w-5 rounded-full overflow-hidden bg-white bg-cover bg-center opacity-50 transition-opacity group-data-[state=active]:opacity-100"
                          style={{
                            backgroundImage: "url('/flags/england.svg')",
                          }}
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

                    <TabsContent value="en">
                      {isLoading ? (
                        <Skeleton className="h-8 w-full rounded-md animate-pulse [animation-duration:2s] bg-muted/80" />
                      ) : (
                        <Input
                          placeholder="Image title in English"
                          value={sliderGallery.slider_gallery_3_title_en ?? ""}
                          onChange={(e) =>
                            setSliderField(
                              "slider_gallery_3_title_en",
                              e.target.value,
                            )
                          }
                        />
                      )}
                    </TabsContent>

                    <TabsContent value="sv">
                      <Input
                        placeholder="Image title in Swedish"
                        value={sliderGallery.slider_gallery_3_title_sv ?? ""}
                        onChange={(e) =>
                          setSliderField(
                            "slider_gallery_3_title_sv",
                            e.target.value,
                          )
                        }
                      />
                    </TabsContent>
                  </Tabs>
                </div>

                {/* SLIDE 4 */}
                <div className="space-y-3">
                  <ImageCard
                    title=""
                    previewFit="cover"
                    value={sliderGallery.slider_gallery_4}
                    file={sliderFiles.slider_gallery_4 ?? null}
                    onFileChange={(file) =>
                      setSliderImage("slider_gallery_4", file)
                    }
                  />

                  <Tabs defaultValue="en" className="w-full">
                    <TabsList className="w-full">
                      <TabsTrigger value="en" className="flex-1 gap-2 group">
                        <span
                          aria-hidden="true"
                          className="h-5 w-5 rounded-full overflow-hidden bg-white bg-cover bg-center opacity-50 transition-opacity group-data-[state=active]:opacity-100"
                          style={{
                            backgroundImage: "url('/flags/england.svg')",
                          }}
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

                    <TabsContent value="en">
                      {isLoading ? (
                        <Skeleton className="h-8 w-full rounded-md animate-pulse [animation-duration:2s] bg-muted/80" />
                      ) : (
                        <Input
                          placeholder="Image title in English"
                          value={sliderGallery.slider_gallery_4_title_en ?? ""}
                          onChange={(e) =>
                            setSliderField(
                              "slider_gallery_4_title_en",
                              e.target.value,
                            )
                          }
                        />
                      )}
                    </TabsContent>

                    <TabsContent value="sv">
                      <Input
                        placeholder="Image title in Swedish"
                        value={sliderGallery.slider_gallery_4_title_sv ?? ""}
                        onChange={(e) =>
                          setSliderField(
                            "slider_gallery_4_title_sv",
                            e.target.value,
                          )
                        }
                      />
                    </TabsContent>
                  </Tabs>
                </div>
              </div>

              <Separator />
              <div className="flex justify-end pb-[25px]">
                {isLoading ? (
                  <Skeleton className="h-8 w-32 rounded-md animate-pulse [animation-duration:2s] bg-muted/80" />
                ) : (
                  <Button onClick={saveSliderGallery} disabled={sliderLoading}>
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

