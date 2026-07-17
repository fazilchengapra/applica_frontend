import re

with open('src/app/page.tsx', 'r') as f:
    content = f.read()

# 1. Add use client and imports
if '"use client"' not in content:
    content = '"use client";\n\n' + content
    content = content.replace('import Image from "next/image";', 'import Image from "next/image";\nimport { useEffect, useState } from "react";')

# 2. Add React hooks
hook_code = """
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: "-100px 0px -100px 0px" }
    );

    document.querySelectorAll("section[id]").forEach((section) => {
      sectionObserver.observe(section);
    });

    const animationObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("opacity-0", "translate-y-8");
            entry.target.classList.add("opacity-100", "translate-y-0");
            animationObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".animate-on-scroll").forEach((el) => {
      animationObserver.observe(el);
    });

    return () => {
      sectionObserver.disconnect();
      animationObserver.disconnect();
    };
  }, []);
"""
if 'const [activeSection' not in content:
    content = content.replace('export default function Home() {\n  return (', f'export default function Home() {{{hook_code}\n  return (')


# 3. Update navbar links
# Features link
content = re.sub(
    r'<Link\s+href="#features"\s+className="[^"]+"',
    r'<Link\n                href="#features"\n                className={`py-4 px-2 font-bold transition-all duration-200 active:scale-95 hover:opacity-90 ${activeSection === "features" ? "text-primary dark:text-inverse-primary border-b-2 border-primary" : "text-on-surface-variant dark:text-on-surface-variant hover:text-primary dark:hover:text-inverse-primary"}`}',
    content
)

# Pricing link
content = re.sub(
    r'<Link\s+href="#pricing"\s+className="[^"]+"',
    r'<Link\n                href="#pricing"\n                className={`py-4 px-2 font-bold transition-all duration-200 active:scale-95 hover:opacity-90 ${activeSection === "pricing" ? "text-primary dark:text-inverse-primary border-b-2 border-primary" : "text-on-surface-variant dark:text-on-surface-variant hover:text-primary dark:hover:text-inverse-primary"}`}',
    content
)

# How it Works link
content = re.sub(
    r'<Link\s+href="#how-it-works"\s+className="[^"]+"',
    r'<Link\n                href="#how-it-works"\n                className={`py-4 px-2 font-bold transition-all duration-200 active:scale-95 hover:opacity-90 ${activeSection === "how-it-works" ? "text-primary dark:text-inverse-primary border-b-2 border-primary" : "text-on-surface-variant dark:text-on-surface-variant hover:text-primary dark:hover:text-inverse-primary"}`}',
    content
)

# 4. Add animate-on-scroll classes to all <section> elements
# We do this by replacing `<section className="` with `<section className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 ease-out `
animation_classes = 'animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 ease-out '

content = content.replace('<section className="', f'<section className="{animation_classes}')

with open('src/app/page.tsx', 'w') as f:
    f.write(content)

print("Done")
