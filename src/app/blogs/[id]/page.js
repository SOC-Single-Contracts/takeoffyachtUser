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
    <DetailedBlog blogId={id} />
    <Footer />
    </main>
  );
}