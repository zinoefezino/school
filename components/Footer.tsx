import { HugeiconsIcon } from "@hugeicons/react";
import {
  FacebookIcon,
  InstagramIcon,
  NewTwitterIcon,
  Mail01Icon,
  Call02Icon,
  Location01Icon,
} from "@hugeicons/core-free-icons";

const quickLinks = [
  { label: "About", href: "/about" },
  { label: "Academics", href: "/academics" },
  { label: "Admissions", href: "/admissions" },
  { label: "News", href: "/news" },
];

const resources = [
  { label: "Portal login", href: "/portal/login" },
  { label: "Calendar & term dates", href: "/academics" },
  { label: "Fees & payments", href: "/admissions" },
  { label: "Contact admissions", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="bg-navy">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-lg font-medium text-white">School</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-6 text-white/60">
              Building confident learners for a changing world, from foundation
              years through to graduation.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <a
                href="#"
                aria-label="Facebook"
                className="text-white/60 transition-colors hover:text-white"
              >
                <HugeiconsIcon icon={FacebookIcon} size={20} />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="text-white/60 transition-colors hover:text-white"
              >
                <HugeiconsIcon icon={InstagramIcon} size={20} />
              </a>
              <a
                href="#"
                aria-label="X (Twitter)"
                className="text-white/60 transition-colors hover:text-white"
              >
                <HugeiconsIcon icon={NewTwitterIcon} size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-white">Quick links</h3>
            <ul className="mt-4 flex flex-col gap-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium text-white">Resources</h3>
            <ul className="mt-4 flex flex-col gap-3">
              {resources.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium text-white">Get in touch</h3>
            <ul className="mt-4 flex flex-col gap-3 text-sm text-white/60">
              <li className="flex items-start gap-2.5">
                <HugeiconsIcon
                  icon={Location01Icon}
                  size={18}
                  className="mt-0.5 shrink-0"
                />
                <span>12 Fairview Road, Warri, Delta State</span>
              </li>
              <li className="flex items-center gap-2.5">
                <HugeiconsIcon
                  icon={Call02Icon}
                  size={18}
                  className="shrink-0"
                />
                <a href="tel:+2340000000000" className="hover:text-white">
                  +234 000 000 0000
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <HugeiconsIcon
                  icon={Mail01Icon}
                  size={18}
                  className="shrink-0"
                />
                <a
                  href="mailto:info@fairviewacademy.example"
                  className="hover:text-white"
                >
                  info@fairviewacademy.example
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} Fairview Academy. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="#privacy"
              className="text-xs text-white/50 hover:text-white"
            >
              Privacy policy
            </a>
            <a href="#terms" className="text-xs text-white/50 hover:text-white">
              Terms of use
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
