import Topbar from "@/components/layout/topbar";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import BackToTop from "@/components/layout/back-to-top";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Topbar />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <BackToTop />
    </>
  );
}
