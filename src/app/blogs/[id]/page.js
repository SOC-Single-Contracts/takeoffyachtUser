"use client";
import Header from "@/components/lp/shared/Header";
import Footer from "@/components/lp/shared/Footer";
import DetailedBlog from "../blogs/DetailedBlog";
import { useParams } from "next/navigation";

export default function BlogPage() {
  const { id } = useParams();

  return (
    <main className="bg-[#E2E2E2] dark:bg-gray-900">
    <Header />
          <div className="mt-10 md:mt-0">
          <DetailedBlog blogId={id} />
          <Footer />
            </div>

    </main>
  );
}