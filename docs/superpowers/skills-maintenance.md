# Skill Bakım Rehberi

## Hangi skill ne zaman güncellenir?

| Sinyal | Skill | Yapılacak |
|--------|-------|-----------|
| Yeni oda tipi eklendi | ui-agent, arch-agent, impl-agent | SKILL.md Proje Bağlamı bloğunu güncelle |
| Mail provider değişti (Resend → SMTP) | impl-agent, review-agent | SKILL.md Proje Bağlamı bloğunu güncelle |
| Yeni API endpoint eklendi | arch-agent checklist | Route'u checklist'e ekle |
| UI Agent zayıf sonuç veriyor | ui-agent | sources.md'e yeni kaynak ekle |
| Arch Agent bilinen pattern'i sorun işaretliyor | arch-agent | checklist.md'e false-positive notu ekle |
| Yeni güvenlik riski keşfedildi | arch-agent, review-agent | Her ikisine de ekle |
| Next.js major version güncellendi | Tümü | Katman 1 (talimat mantığı) gözden geçir |

## Üç Bakım Katmanı

**Katman 1 — Talimat mantığı** (SKILL.md çalışma adımları)
Stack değişmedikçe dokunma. Ayda bir gözden geçir.

**Katman 2 — Proje bağlamı** (her SKILL.md başındaki ## Proje Bağlamı bloğu)
Kural: Projeye bir şey ekledikten sonra 5 dakika ayır, ilgili skill'i güncelle.

**Katman 3 — Referans listeleri** (sources.md, checklist.md)
İhtiyaç duyuldukça — yeni kaynak, yeni risk, ölü link.
