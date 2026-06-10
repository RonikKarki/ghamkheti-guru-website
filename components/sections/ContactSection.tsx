"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, CheckCircle, Clock, Building2 } from "lucide-react";
import { Container } from "@/components/common/Container";
import { Section } from "@/components/common/Section";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config";
import { fadeLeft, fadeRight, viewportOnce } from "@/lib/animations";

const contactPoints = [
  {
    icon: Building2,
    label: "Headquarters",
    value: siteConfig.address,
    sub: "Kathmandu, Nepal",
    href: "#map",
  },
  {
    icon: Phone,
    label: "Main Office",
    value: siteConfig.phone,
    sub: "Mon–Fri · 9:00 AM – 5:00 PM NPT",
    href: `tel:${siteConfig.phone}`,
  },
  {
    icon: Mail,
    label: "General Enquiries",
    value: siteConfig.email,
    sub: "We respond within 24 hours",
    href: `mailto:${siteConfig.email}`,
  },
  {
    icon: Clock,
    label: "Business Hours",
    value: "Sun – Fri · 9:00 AM – 5:00 PM",
    sub: "Nepal Standard Time (NPT / UTC+5:45)",
    href: "#",
  },
];

const enquiryTypes = [
  { value: "general",     label: "General Enquiry" },
  { value: "investment",  label: "Investment Opportunity" },
  { value: "partnership", label: "Project Partnership" },
  { value: "media",       label: "Media & Press" },
  { value: "career",      label: "Career / Employment" },
  { value: "procurement", label: "Procurement" },
  { value: "government",  label: "Government / Regulatory" },
];

const DEFAULT_OFFICES = [
  { name: "Headquarters",      city: "Kathmandu",    address: "Trade Tower, Thapathali, Kathmandu 44600" },
  { name: "Hydropower Office", city: "Solukhumbu",   address: "Sisakhola River Project Site" },
  { name: "Solar Operations",  city: "Solukhumbu",   address: "Solar PV Project Site" },
  { name: "Agriculture Hub",   city: "Nawalpur",     address: "Gaindakot, Nawalpur" },
];

interface CmsData {
  intro?:   { title?: string; body?: string };
  offices?: { title?: string; subtitle?: string; items?: { name?: string; city?: string; address?: string }[] };
  map?:     { title?: string; subtitle?: string; body?: string; embedUrl?: string };
}

export function ContactSection({ cms }: { cms?: CmsData }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const introHeading = cms?.intro?.title || "Let's Start a Conversation";
  const introBody    = cms?.intro?.body  || "Whether you're a potential investor, government counterpart, media professional, or community partner — our team is ready to engage. We aim to respond to all enquiries within one business day.";

  const officesTitle = cms?.offices?.title    || "Find Our Offices";
  const officesDesc  = cms?.offices?.subtitle || "";
  const offices      = cms?.offices?.items?.length ? cms.offices.items : DEFAULT_OFFICES;

  const mapTitle    = cms?.map?.title    || "Trade Tower, Thapathali, Kathmandu";
  const mapSubtitle = cms?.map?.subtitle || "Ghamkheti Guru Company Limited HQ";
  const mapEmbedUrl = cms?.map?.embedUrl || "";
  const mapsUrl     = cms?.map?.body     || "https://maps.google.com/?q=Trade+Tower+Thapathali+Kathmandu+Nepal";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      (e.target as HTMLFormElement).reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      {/* Contact info + form */}
      <Section>
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Left — info */}
            <motion.div
              variants={fadeLeft}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="lg:col-span-2 space-y-6"
            >
              <div>
                <Badge variant="overline" dot className="mb-4">Get in Touch</Badge>
                <h2 className="text-display-lg font-display text-foreground text-balance mb-4">
                  {introHeading}
                </h2>
                <p className="text-foreground-muted leading-relaxed">{introBody}</p>
              </div>

              <div className="space-y-4 pt-2">
                {contactPoints.map(({ icon: Icon, label, value, sub, href }) => (
                  <div key={label} className="flex gap-4">
                    <div className="h-10 w-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-4.5 w-4.5 text-primary" strokeWidth={1.8} />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-foreground-subtle mb-0.5">{label}</p>
                      <a href={href} className="text-sm text-foreground hover:text-primary transition-colors leading-snug block">
                        {value}
                      </a>
                      <p className="text-xs text-foreground-subtle">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right — form */}
            <motion.form
              variants={fadeRight}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              onSubmit={handleSubmit}
              className="lg:col-span-3 space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-subtle mb-1.5">Full Name *</label>
                  <input
                    name="name"
                    required
                    placeholder="Your full name"
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-subtle mb-1.5">Organisation</label>
                  <input
                    name="organisation"
                    placeholder="Company or institution"
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-subtle mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="you@organisation.com"
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-subtle mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+977-"
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-subtle mb-1.5">Enquiry Type *</label>
                <select
                  name="enquiryType"
                  required
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
                >
                  <option value="">Select enquiry type…</option>
                  {enquiryTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-subtle mb-1.5">Subject *</label>
                <input
                  name="subject"
                  required
                  placeholder="Brief subject line"
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-subtle mb-1.5">Message *</label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  placeholder="Please describe your enquiry in detail…"
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition resize-none"
                />
              </div>

              {status === "success" ? (
                <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-sm text-emerald-400">
                  <CheckCircle className="h-4 w-4 shrink-0" />
                  Message sent. Our team will respond within one business day.
                </div>
              ) : (
                <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={status === "loading"}>
                  {status === "loading" ? "Sending…" : <><Send className="h-4 w-4" />Send Message</>}
                </Button>
              )}
              {status === "error" && (
                <p className="text-sm text-destructive">Something went wrong. Please try again or email us directly.</p>
              )}
            </motion.form>
          </div>
        </Container>
      </Section>

      {/* Map placeholder */}
      <Section variant="alt" size="sm" id="map">
        <Container>
          <SectionHeader badge="Location" title={officesTitle} description={officesDesc} />

          {/* Office cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {offices.map((o) => (
              <div key={o.name} className="rounded-xl bg-card border border-border p-4 text-center hover:border-primary/20 transition-colors">
                <p className="font-semibold text-foreground text-sm mb-1">{o.name}</p>
                <p className="text-xs text-primary mb-1">{o.city}</p>
                <p className="text-[10px] text-foreground-subtle leading-relaxed">{o.address}</p>
              </div>
            ))}
          </div>

          {/* Map embed */}
          <div className="relative rounded-3xl overflow-hidden border border-border" style={{ height: "420px" }}>
            {mapEmbedUrl ? (
              <>
                <iframe
                  src={mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Office Location"
                />
                {/* Overlay bar at bottom */}
                <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-5 py-3 bg-background/90 backdrop-blur-sm border-t border-border">
                  <div>
                    <p className="font-semibold text-foreground text-sm">{mapTitle}</p>
                    <p className="text-xs text-foreground-subtle">{mapSubtitle}</p>
                  </div>
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shrink-0"
                  >
                    <MapPin className="h-3 w-3" />
                    Open in Google Maps
                  </a>
                </div>
              </>
            ) : (
              /* Fallback placeholder when no embed URL set */
              <div className="h-full bg-linear-to-br from-brand-deep via-surface to-background flex items-center justify-center">
                <div className="text-center">
                  <div className="h-16 w-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-8 w-8 text-primary" strokeWidth={1.5} />
                  </div>
                  <p className="font-semibold text-foreground mb-1">{mapTitle}</p>
                  <p className="text-xs text-foreground-subtle mb-4">{mapSubtitle}</p>
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    <MapPin className="h-3 w-3" />
                    Open in Google Maps
                  </a>
                </div>
              </div>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}
