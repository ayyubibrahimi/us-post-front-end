import type React from "react";
import Footer from "./Footer/Footer";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
