import { HugeiconsIcon } from "@hugeicons/react";
import {
  Call02Icon,
  Mail01Icon,
  WhatsappIcon,
  Clock01Icon,
} from "@hugeicons/core-free-icons";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";

const contactMethods = [
  {
    icon: Call02Icon,
    label: "Call the office",
    value: "+234 802 000 0000",
    href: "tel:+2348020000000",
  },
  {
    icon: WhatsappIcon,
    label: "Chat on WhatsApp",
    value: "+234 802 000 0001",
    href: "https://wa.me/2348020000001",
  },
  {
    icon: Mail01Icon,
    label: "Email us",
    value: "info@fairviewacademy.example",
    href: "mailto:info@fairviewacademy.example",
  },
];

const officeHours = [
  { day: "Monday to Friday", hours: "7:30 AM to 4:00 PM" },
  { day: "Saturday", hours: "Closed" },
  { day: "Sunday", hours: "Closed" },
];

const departments = [
  {
    name: "Admissions office",
    contact: "admissions@fairviewacademy.example · +234 802 000 0002",
  },
  {
    name: "Bursary / fees",
    contact: "bursary@fairviewacademy.example · +234 802 000 0003",
  },
  {
    name: "Principal's office",
    contact: "principal@fairviewacademy.example · +234 802 000 0004",
  },
];

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />

      {/* Page header */}
      <section className="relative overflow-hidden bg-navy">
        <Image
          src="/hero6.jpeg"
          alt="Fairview Academy front gate"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-navy/80" />

        <div className="relative z-10 mx-auto max-w-6xl px-6 py-16 lg:py-20">
          <h1 className="max-w-2xl text-3xl font-medium leading-tight text-white sm:text-4xl">
            Get in touch
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-white/70">
            Questions about admissions, fees, or a visit, reach us directly, no
            forms to fill out.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-4 sm:grid-cols-3">
            {contactMethods.map((method) => (
              <a
                key={method.label}
                href={method.href}
                className="rounded-2xl border border-navy/10 p-6 transition-colors hover:bg-blue-light"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-light text-blue">
                  <HugeiconsIcon icon={method.icon} size={22} />
                </span>
                <p className="mt-4 text-sm text-foreground/60">
                  {method.label}
                </p>
                <p className="mt-1 text-base font-medium text-foreground">
                  {method.value}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-blue-light">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-16 lg:grid-cols-2">
          <div className="flex flex-col overflow-hidden rounded-2xl bg-white">
            <div className="aspect-video bg-navy/5">
              <iframe
                title="Fairview Academy location map"
                src="https://www.google.com/maps?q=Warri%2C%20Delta%20State%2C%20Nigeria&output=embed"
                className="h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <div className="p-6">
              <p className="text-sm font-medium text-foreground">
                Visit the campus
              </p>
              <p className="mt-1 text-sm text-foreground/70">
                12 Fairview Road, Warri, Delta State, Nigeria
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-2xl bg-white p-6">
              <div className="flex items-center gap-2.5">
                <HugeiconsIcon
                  icon={Clock01Icon}
                  size={20}
                  className="text-blue"
                />
                <h3 className="text-sm font-medium text-foreground">
                  Office hours
                </h3>
              </div>
              <div className="mt-4 divide-y divide-black/5">
                {officeHours.map((item) => (
                  <div
                    key={item.day}
                    className="flex items-center justify-between py-2.5 text-sm first:pt-0"
                  >
                    <span className="text-foreground/70">{item.day}</span>
                    <span className="font-medium text-foreground">
                      {item.hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6">
              <h3 className="text-sm font-medium text-foreground">
                Direct lines
              </h3>
              <div className="mt-4 divide-y divide-black/5">
                {departments.map((dept) => (
                  <div key={dept.name} className="py-2.5 first:pt-0">
                    <p className="text-sm font-medium text-foreground">
                      {dept.name}
                    </p>
                    <p className="mt-0.5 text-xs text-foreground/60">
                      {dept.contact}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
