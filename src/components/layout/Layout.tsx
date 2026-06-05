import type { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import ParallaxBackground from "../ui/ParallaxBackground";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen w-full bg-transparent relative">
      <ParallaxBackground />

      <div className="relative z-10">
        <Header />

        <main className="pl-0 md:pl-[76px] min-h-[calc(100vh-80px)] transition-[padding] duration-300 flex flex-col items-center pb-[70px] md:pb-0">
          <div className="w-full max-w-[1200px] mx-auto px-4 py-2">
            {children}
          </div>
        </main>

        <div className="mb-[40px] md:mb-0 md:pl-[15px] transition-[padding] duration-300">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Layout;
