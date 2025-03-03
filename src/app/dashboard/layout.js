"use client";

import Footer from "@/components/lp/shared/Footer";
import Header from "@/components/lp/shared/Header";
import React from "react";

const DashboardLayout = ({ children }) => {
  return (
    <>
      <Header />
      <main className="mt-28 bg-[#E2E2E2] dark:bg-gray-900">{children}</main>
      <Footer />
    </>
  );
};

export default DashboardLayout;
