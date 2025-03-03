const TopCard = () => (
    <div className="bg-white p-4 mb-6 shadow-xl rounded-xl flex flex-row justify-between h-[110px]">
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold">List your yachts & experiences</h3>
        <p className="text-sm text-gray-500">Topsail ensign landlubber poop locker. Crimp blossom dock.</p>
      </div>
      <Image src={listyachts} alt="List your yachts & experiences" width={120} height={120} className="mr-[-1rem]" />
    </div>
  );

export default TopCard;