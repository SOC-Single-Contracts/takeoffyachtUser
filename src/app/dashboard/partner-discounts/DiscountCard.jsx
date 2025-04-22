import React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const BrandCard = ({ brand }) => {
  if (!brand) return null;

  const imageUrl = brand?.image
    ? `${process.env.NEXT_PUBLIC_API_URL}${brand.image}`
    : "/assets/images/f1.png";

    // console.log(imageUrl)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card
          className="overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-md w-full max-w-[298px] h-fulll max-h-[260px] cursor-pointer"
          role="button"
          tabIndex={0}
        >
          <div className="relative">
            <Image
              src={imageUrl}
              alt={brand?.name || "Brand Image"}
              width={400}
              height={250}
              className="object-cover px-3 pt-3 rounded-3xl h-[120px]"
            />
          </div>
          <div className="px-4 py-2">
            <h3 className="text-md text-center font-semibold mb-1">
              {brand?.name || "Unnamed brand"}
            </h3>
          </div>
        </Card>
      </DialogTrigger>

      <DialogContent className="max-w-3xl p-6 rounded-2xl border-none shadow-none outline-none flex flex-col items-center">
        <Image
          src={imageUrl}
          alt={brand?.name || "Brand Image"}
          width={800}
          height={500}
          className="rounded-lg object-contain"
        />
        <h2 className="text-xl font-semibold mt-4">
          {brand?.name || "Unnamed brand"}
        </h2>
        <p className="text-gray-600">
          {brand?.description || "No description available"}
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default BrandCard;
