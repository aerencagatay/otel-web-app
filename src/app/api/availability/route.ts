import { NextRequest, NextResponse } from "next/server";
import { availabilitySchema } from "@/lib/utils/validation";
import { checkAvailability } from "@/lib/sheets/availability";
import { isPastDate } from "@/lib/utils/dates";
import {
  getClientIp,
  availabilityLimiter,
} from "@/lib/security/rate-limit";

export async function GET(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rateLimitResult = await availabilityLimiter.limit(ip);
    if (!rateLimitResult.success) {
      return NextResponse.json({ error: "rateLimit" }, { status: 429 });
    }

    const params = Object.fromEntries(request.nextUrl.searchParams);
    const parsed = availabilitySchema.safeParse(params);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "invalidParams", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { checkIn, checkOut, adults, children, roomType } = parsed.data;

    if (isPastDate(checkIn)) {
      return NextResponse.json({ error: "pastDate" }, { status: 400 });
    }

    if (checkIn >= checkOut) {
      return NextResponse.json(
        { error: "checkoutAfterCheckin" },
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
    return NextResponse.json({ error: "availabilityError" }, { status: 500 });
  }
}
