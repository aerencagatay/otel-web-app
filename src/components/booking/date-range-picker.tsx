"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import type { DayButtonProps } from "react-day-picker";
import { tr, enUS } from "react-day-picker/locale";
import { useLocale, useTranslations } from "next-intl";
import { calculateStayTotal } from "@/lib/config/pricing";
import { approxEur } from "@/lib/config/hotel";
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
  /**
   * Room type to price the calendar for. When omitted the cheapest room
   * type is used server-side (`from: true` marker) so the calendar still
   * shows illustrative "starting from" prices.
   */
  roomType?: string;
  /** Show the "N nights · total ₺X" summary footer once a full range is picked. */
  showSummary?: boolean;
}

function monthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
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
/** "7700" -> "7,7k" (tr) / "7.7k" (en). Full value is shown via `title` tooltip. */
function formatShortPrice(price: number, intlLocale: string): string {
  const thousands = price / 1000;
  const rounded = Math.round(thousands * 10) / 10;
  const str = rounded.toLocaleString(intlLocale, {
    minimumFractionDigits: rounded % 1 === 0 ? 0 : 1,
    maximumFractionDigits: 1,
  });
  return `${str}k`;
}

export default function DateRangePicker({
  checkIn,
  checkOut,
  onChange,
  className,
  numberOfMonths = 2,
  renderTrigger,
  roomType,
  showSummary = false,
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

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [visibleMonth, setVisibleMonth] = useState<Date>(range.from ?? today);
  const [priceMap, setPriceMap] = useState<Record<string, number>>({});
  const [priceRoomType, setPriceRoomType] = useState<string | null>(null);

  // Fetch the static pricing map for the months currently on screen. Cheap
  // (config-derived, 1h edge-cacheable) so re-fetching on month navigation is
  // fine; an AbortController guards against out-of-order responses.
  useEffect(() => {
    if (!open) return;
    const months: string[] = [];
    for (let i = 0; i < monthsToShow; i++) {
      const d = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + i, 1);
      months.push(monthKey(d));
    }
    const controller = new AbortController();
    const qs = new URLSearchParams({ months: months.join(",") });
    if (roomType) qs.set("roomType", roomType);
    fetch(`/api/pricing?${qs}`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return;
        setPriceMap(data.prices ?? {});
        setPriceRoomType(data.roomType ?? null);
      })
      .catch(() => {
        // network hiccup — calendar still works without price labels
      });
    return () => controller.abort();
  }, [open, monthsToShow, visibleMonth, roomType]);

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

  const CustomDayButton = useCallback(
    function CustomDayButton({ day, modifiers, ...buttonProps }: DayButtonProps) {
      const iso = toISO(day.date);
      const price = priceMap[iso];
      return (
        <button {...buttonProps} title={price ? `${price.toLocaleString(intlLocale)} ₺` : undefined}>
          <span className="date-range-picker__day-num">{day.date.getDate()}</span>
          {price != null && !modifiers.outside && (
            <span className="date-range-picker__day-price">
              {formatShortPrice(price, intlLocale)}
            </span>
          )}
        </button>
      );
    },
    [priceMap, intlLocale]
  );

  const stay =
    showSummary && range.from && range.to
      ? calculateStayTotal(roomType ?? priceRoomType ?? "", checkIn, checkOut)
      : null;

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
            className="date-range-picker__calendar date-range-picker__calendar--priced"
            mode="range"
            locale={dpLocale}
            numberOfMonths={monthsToShow}
            selected={range}
            onSelect={handleSelect}
            disabled={{ before: today }}
            defaultMonth={range.from ?? today}
            onMonthChange={setVisibleMonth}
            components={{ DayButton: CustomDayButton }}
            autoFocus
          />
          {stay && stay.total != null && (
            <p className="date-range-picker__summary">
              {t("summary", {
                nights: stay.nights,
                total: stay.total.toLocaleString(intlLocale),
              })}
              {locale === "en" && (
                <span className="date-range-picker__summary-eur">
                  {" "}
                  {t("summaryEur", { amount: approxEur(stay.total).toLocaleString(intlLocale) })}
                </span>
              )}
            </p>
          )}
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
