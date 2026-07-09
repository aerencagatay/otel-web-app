"use client";

import { useEffect, useRef, useState } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import { tr, enUS } from "react-day-picker/locale";
import { useLocale, useTranslations } from "next-intl";
import "react-day-picker/style.css";

export interface DateRangeTriggerArgs {
  checkInLabel: string;
  checkOutLabel: string;
  open: boolean;
  openPicker: () => void;
}

interface Props {
  checkIn: string;
  checkOut: string;
  onChange: (checkIn: string, checkOut: string) => void;
  className?: string;
  numberOfMonths?: number;
  renderTrigger: (args: DateRangeTriggerArgs) => React.ReactNode;
}

function toISO(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function fromISO(s?: string) {
  if (!s) return undefined;
  const parts = s.split("-").map(Number);
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return undefined;
  const [y, m, d] = parts;
  return new Date(y, m - 1, d);
}

/**
 * Reusable check-in/check-out range picker (react-day-picker v9), locale-aware:
 * tarih biçimleri ve takvim yerelleştirmesi aktif dile göre (`tr` / `enUS`)
 * seçilir. Homepage hızlı arama pill'i ve rezervasyon sayfası formu paylaşır.
 */
export default function DateRangePicker({
  checkIn,
  checkOut,
  onChange,
  className,
  numberOfMonths = 2,
  renderTrigger,
}: Props) {
  const t = useTranslations("booking.datePicker");
  const locale = useLocale();
  const dpLocale = locale === "en" ? enUS : tr;
  const intlLocale = locale === "en" ? "en-US" : "tr-TR";

  const [open, setOpen] = useState(false);
  const [monthsToShow, setMonthsToShow] = useState(1);
  const rootRef = useRef<HTMLDivElement>(null);

  function formatLabel(d?: Date) {
    if (!d) return t("placeholder");
    return d.toLocaleDateString(intlLocale, { day: "2-digit", month: "short" });
  }

  useEffect(() => {
    function updateMonths() {
      setMonthsToShow(window.innerWidth >= 640 ? numberOfMonths : 1);
    }
    updateMonths();
    window.addEventListener("resize", updateMonths);
    return () => window.removeEventListener("resize", updateMonths);
  }, [numberOfMonths]);

  const range: DateRange | undefined = {
    from: fromISO(checkIn),
    to: fromISO(checkOut),
  };

  useEffect(() => {
    if (!open) return;

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function handleClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", handleKey);
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [open]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  function handleSelect(next: DateRange | undefined) {
    if (!next?.from) {
      onChange("", "");
      return;
    }
    const from = toISO(next.from);
    const to = next.to ? toISO(next.to) : "";
    onChange(from, to);
    if (next.from && next.to) {
      setOpen(false);
    }
  }

  return (
    <div ref={rootRef} className={`date-range-picker ${className ?? ""}`}>
      {renderTrigger({
        checkInLabel: formatLabel(range.from),
        checkOutLabel: formatLabel(range.to),
        open,
        openPicker: () => setOpen((v) => !v),
      })}

      {open && (
        <div className="date-range-picker__popover" role="dialog" aria-label={t("dialogLabel")}>
          <DayPicker
            className="date-range-picker__calendar"
            mode="range"
            locale={dpLocale}
            numberOfMonths={monthsToShow}
            selected={range}
            onSelect={handleSelect}
            disabled={{ before: today }}
            defaultMonth={range.from ?? today}
            autoFocus
          />
          <div className="date-range-picker__footer">
            <p className="date-range-picker__hint">{t("hint")}</p>
            <button
              type="button"
              className="date-range-picker__close"
              onClick={() => setOpen(false)}
            >
              {t("close")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
