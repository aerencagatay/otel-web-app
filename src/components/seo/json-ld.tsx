import type { ContactPage, Hotel, HotelRoom, Thing, WithContext } from "schema-dts";
import { HOTEL } from "@/lib/config/hotel";
import { ROOM_TYPE_MAP } from "@/lib/config/room-types";
import { getLowestUpcomingPrice } from "@/lib/config/pricing";
import { getAverageRating, getReviewCount } from "@/lib/config/reviews";

/**
 * Desteklenen içerik dilleri. Task 04 (i18n) devreye girdiğinde builder'lara
 * ilgili locale geçilmesi yeterli — şu an yalnızca `inLanguage` alanını ve
 * ileride locale'e göre değişecek metinleri etkiler.
 */
export type JsonLdLocale = "tr" | "en";

const IN_LANGUAGE: Record<JsonLdLocale, string> = { tr: "tr-TR", en: "en-US" };

/** Sabit @id — sayfalar arası şema referansları bu kimliği kullanır. */
const HOTEL_ID = `${HOTEL.website}/#hotel`;

/**
 * Yapılandırılmış veriyi <script type="application/ld+json"> olarak basar.
 * JSON.stringify çıktısındaki `<` karakterleri XSS'e karşı unicode'a
 * çevrilir (Next.js JSON-LD rehberinin önerisi).
 */
export default function JsonLd({
  data,
}: {
  data: WithContext<Thing> | WithContext<Thing>[];
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

const AMENITIES: Record<JsonLdLocale, string[]> = {
  tr: [
    "Açık yüzme havuzu",
    "Çocuk havuzu",
    "A La Carte restoran",
    "Ücretsiz Wi-Fi",
    "Ücretsiz açık otopark",
    "7/24 resepsiyon",
    "Klima",
    "Deniz manzarası",
  ],
  en: [
    "Outdoor swimming pool",
    "Children's pool",
    "A la carte restaurant",
    "Free Wi-Fi",
    "Free parking",
    "24/7 reception",
    "Air conditioning",
    "Sea view",
  ],
};

/**
 * Tüm sayfalarda (root layout) yayınlanan Hotel şeması.
 *
 * NOT — AggregateRating genişleme noktası: Task 03 `src/lib/config/reviews.ts`
 * dosyasını oluşturduğunda, gerçek yorum verisi varsa buraya koşullu olarak
 *   aggregateRating: { "@type": "AggregateRating", ratingValue, reviewCount }
 * eklenmelidir. Yorum verisi yokken KESİNLİKLE eklenmez — sahte/desteksiz
 * rating Google tarafından cezalandırılır.
 */
export function hotelJsonLd(locale: JsonLdLocale = "tr"): WithContext<Hotel> {
  const averageRating = getAverageRating();
  const reviewCount = getReviewCount();

  return {
    "@context": "https://schema.org",
    "@type": "Hotel",
    "@id": HOTEL_ID,
    name: HOTEL.name,
    url: HOTEL.website,
    telephone: HOTEL.phone,
    email: HOTEL.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Büyükhusun Köyü Namazgah Mevkii No:26",
      addressLocality: "Ayvacık",
      addressRegion: "Çanakkale",
      postalCode: "17860",
      addressCountry: "TR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: HOTEL.geo.latitude,
      longitude: HOTEL.geo.longitude,
    },
    image: [`${HOTEL.website}/og.jpg`, `${HOTEL.website}/img/hero-web.jpg`],
    amenityFeature: AMENITIES[locale].map((name) => ({
      "@type": "LocationFeatureSpecification",
      name,
      value: true,
    })),
    checkinTime: HOTEL.checkIn,
    checkoutTime: HOTEL.checkOut,
    numberOfRooms: HOTEL.totalRooms,
    priceRange: "₺₺",
    // Only emitted when backed by real reviews (src/lib/config/reviews.ts) —
    // a fabricated/unsupported rating here is penalized by Google.
    ...(averageRating != null
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: averageRating,
            reviewCount,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  };
}

/** /rooms sayfası: her oda tipi için HotelRoom + Offer. */
export function roomsJsonLd(locale: JsonLdLocale = "tr"): WithContext<HotelRoom>[] {
  const roomDetails: Record<string, { size: number; description: Record<JsonLdLocale, string> }> = {
    deluxe_sea_view: {
      size: 24,
      description: {
        tr: "Tam deniz manzaralı, klimalı, 24 m² deluxe oda. Maksimum 2 kişi.",
        en: "Deluxe room with full sea view and air conditioning, 24 sqm. Up to 2 guests.",
      },
    },
    traditional_room: {
      size: 22,
      description: {
        tr: "Kısmi deniz manzaralı, klimalı, 22 m² traditional oda. Maksimum 2 kişi.",
        en: "Traditional room with partial sea view and air conditioning, 22 sqm. Up to 2 guests.",
      },
    },
    premium_family: {
      size: 44,
      description: {
        tr: "Deniz manzaralı, oturma alanlı, 44 m² aile suiti. 4 kişiye kadar.",
        en: "Family suite with sea view and sitting area, 44 sqm. Up to 4 guests.",
      },
    },
  };

  return Object.entries(ROOM_TYPE_MAP).map(([roomType, config]) => {
    const details = roomDetails[roomType];
    const price = getLowestUpcomingPrice(roomType);

    return {
      "@context": "https://schema.org",
      "@type": "HotelRoom",
      name: config.publicLabel,
      ...(details
        ? {
            description: details.description[locale],
            floorSize: {
              "@type": "QuantitativeValue",
              value: details.size,
              unitCode: "MTK",
            },
          }
        : {}),
      occupancy: {
        "@type": "QuantitativeValue",
        maxValue: config.maxGuests,
        unitText: locale === "tr" ? "kişi" : "guests",
      },
      containedInPlace: { "@id": HOTEL_ID },
      // Fiyat tanımlı ay yoksa Offer hiç basılmaz (yanlış/bayat fiyat yerine).
      ...(price != null
        ? {
            offers: {
              "@type": "Offer",
              price,
              priceCurrency: "TRY",
              availability: "https://schema.org/InStock",
              url: `${HOTEL.website}/reservation`,
            },
          }
        : {}),
    };
  });
}

/** /contact sayfası: ContactPage + otel referansı. */
export function contactJsonLd(locale: JsonLdLocale = "tr"): WithContext<ContactPage> {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: locale === "tr" ? "İletişim – Assos Karadut Taş Otel" : "Contact – Assos Karadut Taş Otel",
    url: `${HOTEL.website}/contact`,
    inLanguage: IN_LANGUAGE[locale],
    about: { "@id": HOTEL_ID },
  };
}
