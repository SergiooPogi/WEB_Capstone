import { Outlet } from "react-router";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { FloatingChat } from "./components/FloatingChat";

export function Root() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {/* pt-16 lg:pt-20 offsets the fixed navbar height */}
      <div className="flex-1 pt-16 lg:pt-20">
        <Outlet />
      </div>
      <Footer />
      <FloatingChat />
    </div>
  );
}