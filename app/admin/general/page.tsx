"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { FaInstagram } from "react-icons/fa6";
import { HiOutlineEnvelope } from "react-icons/hi2";
import { TbBuildingStore } from "react-icons/tb";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import ImageCard from "@/components/admin/ImageCard";
import { Separator } from "@/components/ui/separator";
import { ChevronDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

import { useBusinessInfo } from "@/hooks/use-business-info";
import { useWebsiteBasics } from "@/hooks/use-website-basic";

export default function AdminGeneralPage() {
  const { businessInfo, updateField, saveBusinessInfo, loading, isLoading } =
    useBusinessInfo();

  const {
    websiteBasics,
    updateWebsiteField,
    handleMetaImageChange,
    saveWebsiteBasics,
    metaImageFile,
  } = useWebsiteBasics();

  return (
    <div className="p-7 space-y-10">
      {/* ================= BUSINESS INFO ================= */}
      <Card>
        <Collapsible defaultOpen>
          {/* ===== HEADER ===== */}
          <CardHeader className="flex flex-row items-center justify-between gap-4 pt-4 pb-4">
            <div>
              <CardTitle className="text-lg">Business Information </CardTitle>
            </div>

            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon" className="group !mt-0">
                {" "}
                <ChevronDown className=" h-4 w-4 transition-transform group-data-[state=open]:rotate-180 " />
              </Button>
            </CollapsibleTrigger>
          </CardHeader>

          <Separator />

          {/* ===== CONTENT ===== */}
          <CollapsibleContent>
            <CardContent className="space-y-6 mt-5">
              <div className="grid md:grid-cols-2 gap-6">
                {/* LEFT COLUMN */}
                <div className="space-y-5">
                  <div className="flex items-start gap-3 mb-2 align-center">
                    <div className="flex items-center justify-center">
                      <TbBuildingStore className="text-muted-foreground border rounded-md w-9 h-9 p-2 mt-1" />
                    </div>
                    <div>
                      <h4 className="text-md font-medium">
                        Contact Information
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Details displayed in the website footer and contact
                        section.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    {isLoading ? (
                      <Skeleton className="w-32 h-6 rounded-md animate-pulse [animation-duration:2s] bg-muted/80 mb-3" />
                    ) : (
                      <label className="text-sm font-medium">Address</label>
                    )}

                    {isLoading ? (
                      <Skeleton className="h-9 w-full rounded-md animate-pulse [animation-duration:2s] bg-muted/80" />
                    ) : (
                      <Input
                        value={businessInfo.address}
                        onChange={(e) => updateField("address", e.target.value)}
                        placeholder="Your business address"
                      />
                    )}
                  </div>

                  <div className="space-y-1">
                    {isLoading ? (
                      <Skeleton className="w-32 h-6 rounded-md animate-pulse [animation-duration:2s] bg-muted/80 mb-3" />
                    ) : (
                      <label className="text-sm font-medium">Phone</label>
                    )}

                    {isLoading ? (
                      <Skeleton className="h-9 w-full rounded-md animate-pulse [animation-duration:2s] bg-muted/80" />
                    ) : (
                      <Input
                        value={businessInfo.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        placeholder="Your business address"
                      />
                    )}
                  </div>

                  <div className="space-y-1">
                    {isLoading ? (
                      <Skeleton className="w-32 h-6 rounded-md animate-pulse [animation-duration:2s] bg-muted/80 mb-3" />
                    ) : (
                      <label className="text-sm font-medium">Email</label>
                    )}

                    {isLoading ? (
                      <Skeleton className="h-9 w-full rounded-md animate-pulse [animation-duration:2s] bg-muted/80" />
                    ) : (
                      <Input
                        type="email"
                        autoComplete="email"
                        value={businessInfo.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        placeholder="Your business email address"
                      />
                    )}
                  </div>

                  <div className="space-y-1">
                    {isLoading ? (
                      <Skeleton className="w-32 h-6 rounded-md animate-pulse [animation-duration:2s] bg-muted/80 mb-3" />
                    ) : (
                      <label className="text-sm font-medium">
                        Opening hours
                      </label>
                    )}

                    {isLoading ? (
                      <Skeleton className="h-36 w-full rounded-md animate-pulse [animation-duration:2s] bg-muted/80" />
                    ) : (
                      <Textarea
                        value={businessInfo.opening_hours}
                        onChange={(e) =>
                          updateField("opening_hours", e.target.value)
                        }
                        placeholder="Your business opening hours"
                        rows={6}
                      />
                    )}
                  </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="space-y-5">
                  {/* ===== SOCIAL MEDIA ===== */}

                  <div className="flex items-start gap-3 mb-2 align-center">
                    <div className="flex items-center justify-center">
                      <FaInstagram className="text-muted-foreground border rounded-md w-9 h-9 p-2 mt-1" />
                    </div>
                    <div>
                      <h4 className="text-md font-medium">Social Media</h4>
                      <p className="text-xs text-muted-foreground">
                        Links to your public social media profiles.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    {isLoading ? (
                      <Skeleton className="w-32 h-6 rounded-md animate-pulse [animation-duration:2s] bg-muted/80 mb-3" />
                    ) : (
                      <label className="text-sm font-medium">Facebook</label>
                    )}

                    {isLoading ? (
                      <Skeleton className="h-9 w-full rounded-md animate-pulse [animation-duration:2s] bg-muted/80" />
                    ) : (
                      <Input
                        value={businessInfo.facebook}
                        onChange={(e) =>
                          updateField("facebook", e.target.value)
                        }
                        placeholder="Facebook profile URL"
                      />
                    )}
                  </div>

                  <div className="space-y-1">
                    {isLoading ? (
                      <Skeleton className="w-32 h-6 rounded-md animate-pulse [animation-duration:2s] bg-muted/80 mb-3" />
                    ) : (
                      <label className="text-sm font-medium">Instagram</label>
                    )}

                    {isLoading ? (
                      <Skeleton className="h-9 w-full rounded-md animate-pulse [animation-duration:2s] bg-muted/80" />
                    ) : (
                      <Input
                        value={businessInfo.instagram}
                        onChange={(e) =>
                          updateField("instagram", e.target.value)
                        }
                        placeholder="Instagram profile URL"
                      />
                    )}
                  </div>

                  <div className="space-y-1">
                    {isLoading ? (
                      <Skeleton className="w-32 h-6 rounded-md animate-pulse [animation-duration:2s] bg-muted/80 mb-3" />
                    ) : (
                      <label className="text-sm font-medium">TikTok</label>
                    )}

                    {isLoading ? (
                      <Skeleton className="h-9 w-full rounded-md animate-pulse [animation-duration:2s] bg-muted/80" />
                    ) : (
                      <Input
                        value={businessInfo.tiktok}
                        onChange={(e) => updateField("tiktok", e.target.value)}
                        placeholder="TikTok profile URL"
                      />
                    )}
                  </div>

                  <div className="pt-1"></div>

                  {/* ===== ORDER LINKS ===== */}

                  <div className="flex items-start gap-3 mb-2 align-center">
                    <div className="flex items-center justify-center">
                      <HiOutlineEnvelope className="text-muted-foreground border rounded-md w-9 h-9 p-2 mt-1" />
                    </div>
                    <div>
                      <h4 className="text-md font-medium">Order Online</h4>
                      <p className="text-xs text-muted-foreground">
                        Links used for online ordering buttons on the website.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      {isLoading ? (
                        <Skeleton className="w-32 h-6 rounded-md animate-pulse [animation-duration:2s] bg-muted/80 mb-3" />
                      ) : (
                        <label className="text-sm font-medium gap-2">
                          Order pickup
                        </label>
                      )}

                      {isLoading ? (
                        <Skeleton className="h-9 w-full rounded-md animate-pulse [animation-duration:2s] bg-muted/80" />
                      ) : (
                        <Input
                          value={businessInfo.order_pickup}
                          onChange={(e) =>
                            updateField("order_pickup", e.target.value)
                          }
                          placeholder="Your pickup order URL"
                        />
                      )}
                    </div>

                    <div className="space-y-1">
                      {isLoading ? (
                        <Skeleton className="w-32 h-6 rounded-md animate-pulse [animation-duration:2s] bg-muted/80 mb-3" />
                      ) : (
                        <label className="text-sm font-medium">
                          Order delivery
                        </label>
                      )}

                      {isLoading ? (
                        <Skeleton className="h-9 w-full rounded-md animate-pulse [animation-duration:2s] bg-muted/80" />
                      ) : (
                        <Input
                          value={businessInfo.order_delivery}
                          onChange={(e) =>
                            updateField("order_delivery", e.target.value)
                          }
                          placeholder="Your online delivery URL"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="py-2">
                <Separator />
              </div>
              {/* ===== FOOTER ACTION ===== */}
              <div className="flex justify-end ">
                {isLoading ? (
                  <Skeleton className="h-8 w-32 rounded-md animate-pulse [animation-duration:2s] bg-muted/80" />
                ) : (
                  <Button onClick={saveBusinessInfo} disabled={loading}>
                    Save changes
                  </Button>
                )}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* ================= WEBSITE BASICS ================= */}
      <Card>
        <Collapsible defaultOpen>
          {/* ===== HEADER ===== */}
          <CardHeader className="flex flex-row items-center justify-between gap-4 pt-4 pb-4">
            <div>
              <CardTitle className="text-lg">Website Basics</CardTitle>
            </div>

            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon" className="group !mt-0">
                <ChevronDown
                  className="
                    h-4 w-4
                    transition-transform
                    group-data-[state=open]:rotate-180
                "
                />
              </Button>
            </CollapsibleTrigger>
          </CardHeader>

          <Separator />

          {/* ===== CONTENT ===== */}
          <CollapsibleContent>
            <CardContent className="space-y-6 mt-5">
              <div className="grid md:grid-cols-2 gap-6">
                {/* LEFT COLUMN */}
                <div className="space-y-5">
                  <div className="space-y-1">
                    {isLoading ? (
                      <Skeleton className="w-40 h-6 rounded-md animate-pulse [animation-duration:2s] bg-muted/80 mb-3" />
                    ) : (
                      <div>
                        {" "}
                        <h4 className="text-sm font-medium">Main Title</h4>
                        <p className="text-xs text-muted-foreground pb-2">
                          Displayed in the browser title and search engine
                          results.
                        </p>
                      </div>
                    )}

                    {isLoading ? (
                      <Skeleton className="h-9 w-full rounded-md animate-pulse [animation-duration:2s] bg-muted/80" />
                    ) : (
                      <Input
                        placeholder="Type your website main title"
                        value={websiteBasics.site_title}
                        onChange={(e) =>
                          updateWebsiteField("site_title", e.target.value)
                        }
                      />
                    )}
                  </div>

                  <div className="space-y-1">
                    {isLoading ? (
                      <Skeleton className="w-40 h-6 rounded-md animate-pulse [animation-duration:2s] bg-muted/80 mb-3" />
                    ) : (
                      <div>
                        {" "}
                        <h4 className="text-sm font-medium">
                          Website Description
                        </h4>
                        <p className="text-xs text-muted-foreground pb-2">
                          Short description used for search engines and sharing
                          previews.
                        </p>
                      </div>
                    )}

                    {isLoading ? (
                      <Skeleton className="h-24 w-full rounded-md animate-pulse [animation-duration:2s] bg-muted/80" />
                    ) : (
                      <Textarea
                        placeholder="Type your description..."
                        rows={3}
                        value={websiteBasics.site_description}
                        onChange={(e) =>
                          updateWebsiteField("site_description", e.target.value)
                        }
                      />
                    )}
                  </div>

                  <ImageCard
                    title="Meta Image"
                    description="Shown when the website link is shared on social platforms."
                    value={websiteBasics.meta_image}
                    file={metaImageFile}
                    onFileChange={handleMetaImageChange}
                    isLoading={isLoading}
                  />
                </div>

                {/* RIGHT COLUMN */}
                <div className="space-y-5">
                  <div className="space-y-1">
                    {isLoading ? (
                      <Skeleton className="w-40 h-6 rounded-md animate-pulse [animation-duration:2s] bg-muted/80 mb-3" />
                    ) : (
                      <div>
                        <h4 className="text-sm font-medium">
                          Google Analytics
                        </h4>
                        <p className="text-xs text-muted-foreground pb-2">
                          Paste your tracking script without the{" "}
                          <code className="px-1 py-0.5 rounded bg-muted text-xs">
                            &lt;script&gt;
                          </code>{" "}
                          tag to enable website analytics.
                        </p>
                      </div>
                    )}

                    {isLoading ? (
                      <Skeleton className="h-48 w-full rounded-md animate-pulse [animation-duration:2s] bg-muted/80" />
                    ) : (
                      <Textarea
                        placeholder="Paste tracking code here..."
                        className="
                          font-mono
                          text-sm
                          bg-muted/40
                          border-dashed
                          leading-relaxed
                          resize-none
                          focus-visible:ring-2
                          focus-visible:ring-primary/30
                        "
                        spellCheck={false}
                        autoCorrect="off"
                        autoCapitalize="off"
                        rows={9}
                        value={websiteBasics.google_analytics}
                        onChange={(e) =>
                          updateWebsiteField("google_analytics", e.target.value)
                        }
                      />
                    )}
                  </div>

                  <div className="space-y-1">
                    {isLoading ? (
                      <Skeleton className="w-40 h-6 rounded-md animate-pulse [animation-duration:2s] bg-muted/80 mb-3" />
                    ) : (
                      <div>
                        {" "}
                        <h4 className="text-sm font-medium">Google Maps</h4>
                        <p className="text-xs text-muted-foreground pb-2">
                          Embed code used to display the map on the website.
                        </p>
                      </div>
                    )}

                    {isLoading ? (
                      <Skeleton className="h-48 w-full rounded-md animate-pulse [animation-duration:2s] bg-muted/80" />
                    ) : (
                      <Textarea
                        placeholder="Paste embed code here..."
                        className="
                         font-mono
                          text-sm
                          bg-muted/40
                          border-dashed
                          leading-relaxed
                          resize-none
                          focus-visible:ring-2
                          focus-visible:ring-primary/30
                        "
                        spellCheck={false}
                        autoCorrect="off"
                        autoCapitalize="off"
                        rows={9}
                        value={websiteBasics.google_maps}
                        onChange={(e) =>
                          updateWebsiteField("google_maps", e.target.value)
                        }
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="py-2">
                <Separator />
              </div>
              {/* ===== FOOTER ACTION ===== */}
              <div className="flex justify-end">
                {isLoading ? (
                  <Skeleton className="h-8 w-32 rounded-md animate-pulse [animation-duration:2s] bg-muted/80" />
                ) : (
                  <Button onClick={saveWebsiteBasics} disabled={loading}>
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
