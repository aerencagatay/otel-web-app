import { Phone } from "lucide-react";

export default function Topbar() {
  return (
    <div className="topbar py-2 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center">
          <p className="mb-0 text-white text-[12.5px]">
            <Phone className="inline w-3 h-3 mr-2 text-gold" />
            Rezervasyon için bizi arayın:&nbsp;
            <a
              href="tel:+905010913417"
              className="text-white no-underline font-semibold"
            >
              +90 501 091 34 17
            </a>
          </p>
          <p className="mb-0 text-[12px]">
            <span className="text-white mr-1">TR</span>
            <span className="text-gray-500">|</span>
            <span className="text-white ml-1">EN</span>
          </p>
        </div>
      </div>
    </div>
  );
}
