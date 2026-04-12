import { NextRequest, NextResponse } from "next/server";
import { availabilitySchema } from "@/lib/utils/validation";
import { checkAvailability } from "@/lib/sheets/availability";
import { isPastDate } from "@/lib/utils/dates";

export async function GET(request: NextRequest) {
  try {
    const params = Object.fromEntries(request.nextUrl.searchParams);
    const parsed = availabilitySchema.safeParse(params);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Geçersiz parametreler.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { checkIn, checkOut, adults, children, roomType } = parsed.data;

    if (isPastDate(checkIn)) {
      return NextResponse.json(
        { error: "Giriş tarihi geçmişte olamaz." },
        { status: 400 }
      );
    }

    if (checkIn >= checkOut) {
      return NextResponse.json(
        { error: "Çıkış tarihi giriş tarihinden sonra olmalıdır." },
        { status: 400 }
      );
    }

    const totalGuests = adults + children;
    const rooms = await checkAvailability(
      checkIn,
      checkOut,
      roomType,
      totalGuests
    );

    return NextResponse.json({ rooms });
  } catch (err) {
    console.error("Availability check error:", err);
    return NextResponse.json(
      { error: "Müsaitlik kontrolü sırasında bir hata oluştu." },
      { status: 500 }
    );
  }
}
