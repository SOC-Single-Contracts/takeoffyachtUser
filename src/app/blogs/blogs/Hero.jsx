import React from "react";
import { bloghero } from "../../../../public/assets/images";
import Image from "next/image";
import { Dot, User } from "lucide-react";
import { format } from "date-fns";

const Hero = ({ blog }) => {
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy hh:mm a');
    } catch (err) {
      return dateString;
    }
  };
  return (
    <section className="py-20 bg-[#1F1F1F] mt-24">
      <div className="max-w-5xl px-4 mx-auto flex items-center lg:flex-row flex-col justify-between">
        <div className="flex flex-col items-start justify-center max-w-[700px] w-full">
          <h1 className="lg:text-5xl md:text-3xl text-xl font-bold text-white">
            {blog.title}
          </h1>
          <div className="flex items-center capitalize w-full mt-10">
            <div className="flex items-center gap-2">
              <User className="md:w-8 md:h-8 w-6 h-6 bg-white rounded-full p-1 text-black" />
              <p className="md:text-md text-xs text-white">By {blog.author_name}</p>
            </div>
            {/* <Dot className="text-white md:mx-2 mx-1" /> */}
            {/* <p className="text-white md:text-md text-xs">12 Min Read</p> */}
            <Dot className="text-white md:mx-2 mx-1" />
            <p className="text-white md:text-md text-xs">{formatDate(blog?.created_at)}</p>
          </div>
        </div>
        <Image
          src={blog.thumbnail_image || bloghero}
          alt={blog.title}
          className="w-full mb-4 max-w-[500px] h-[273px] object-cover lg:mt-0 mt-10"
          width={500}
          height={300}
        />
      </div>
    </section>
  );
};

export default Hero;