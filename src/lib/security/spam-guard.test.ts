import { describe, expect, it } from "vitest";
import { detectContactSpam, looksLikeGibberish } from "./spam-guard";

describe("looksLikeGibberish", () => {
  it.each([
    "NKbwmtujZJjfJEsj",
    "StiWdUvDrADvypOocGT",
    "WhpcnrPyoOTawIlyiD",
  ])("flags random mixed-case bot strings: %s", (value) => {
    expect(looksLikeGibberish(value)).toBe(true);
  });

  it.each([
    "Ahmet Yılmaz",
    "AYŞE KARA",
    "Ronald McDonald",
    "Jean-Pierre DeLaCroix",
    "Merhaba, 12-15 Ağustos için müsaitlik var mı?",
    "Merhaba!!!",
    // Tuhaf ama gerçek takma adlar/e-posta yerel kısımları elenmemeli.
    "kocahipopotam61",
    "kermutako31",
    "kocahipopotam61@gmail.com",
    "",
  ])("does not flag real text: %s", (value) => {
    expect(looksLikeGibberish(value)).toBe(false);
  });
});

describe("detectContactSpam", () => {
  const real = {
    name: "Ahmet Yılmaz",
    message: "Merhaba, Ağustos başında iki gece için yer var mı?",
    website: "",
    elapsedMs: 30_000,
  };

  it("passes a genuine submission", () => {
    expect(detectContactSpam(real)).toBeNull();
  });

  it("never judges the e-mail address (odd addresses can be real)", () => {
    const withEmail = { ...real, email: "b.u.t.e.n.o.v.ak.8.78@gmail.com" };
    expect(detectContactSpam(withEmail)).toBeNull();
  });

  it("flags a filled honeypot", () => {
    expect(detectContactSpam({ ...real, website: "http://x.co" })).toBe("honeypot");
  });

  it("flags submissions faster than a human can type", () => {
    expect(detectContactSpam({ ...real, elapsedMs: 800 })).toBe("too-fast");
  });

  it("does not penalize a missing timing value", () => {
    expect(detectContactSpam({ ...real, elapsedMs: undefined })).toBeNull();
  });

  it("flags gibberish in name or message (the observed attack)", () => {
    expect(
      detectContactSpam({ ...real, name: "NKbwmtujZJjfJEsj", message: "WhpcnrPyoOTawIlyiD" })
    ).toBe("gibberish");
    expect(detectContactSpam({ ...real, message: "WhpcnrPyoOTawIlyiD" })).toBe("gibberish");
  });
});
