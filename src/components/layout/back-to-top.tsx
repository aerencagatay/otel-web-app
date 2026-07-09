"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronUp } from "lucide-react";

export default function BackToTop() {
  const t = useTranslations("backToTop");
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`back-to-top ${show ? "show" : ""}`}
      aria-label={t("label")}
    >
      <ChevronUp size={20} />
    </button>
  );
}
