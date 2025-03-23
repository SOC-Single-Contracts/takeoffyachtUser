import Image from 'next/image';

const YachtDetailsGrid = ({ yacht }) => {
  const getYachtDetailsGrid = (yacht) => {
    const detailsMap = [
      {
        imgSrc: "/assets/images/person.svg",
        text: `${yacht.capacity} Max`,
        condition: yacht.capacity
      },
      {
        imgSrc: "/assets/images/sleeping.svg",
        text: `${yacht.sleep_capacity} Max`,
        condition: yacht.sleep_capacity
      },
      {
        imgSrc: "/assets/images/ft.svg",
        text: yacht.length ? `${yacht.length} ft.` : "N/A",
        condition: yacht.length
      },
      {
        imgSrc: "/assets/images/cabin.svg",
        text: yacht.number_of_cabin ? `${yacht.number_of_cabin} Cabins` : "N/A",
        condition: yacht.number_of_cabin
      },
      {
        imgSrc: "/assets/images/pilot.svg",
        text: yacht.crew_member ? `${yacht.crew_member} Crew` : "Included",
        condition: true
      },
      {
        imgSrc: "/assets/images/lang.png",
        text: yacht.crew_language || "English",
        condition: true
      },
      {
        imgSrc: "/assets/images/yacht.svg",
        text: yacht.type || "Super Yacht",
        condition: true
      }
    ];

    return detailsMap
      .filter(item => item.condition)
      .map(({ imgSrc, text }, index) => (
        <div
          key={index}
          className="flex flex-col justify-center items-center w-full h-20 border border-gray-300 rounded-lg shadow-sm"
        >
          <Image src={imgSrc} quality={100} alt={text} width={20} height={20} className="dark:invert" />
          <p className="text-gray-700 dark:text-gray-300 mt-2">{text}</p>
        </div>
      ));
  };

  return (
    <>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2 w-full mt-4">
      {getYachtDetailsGrid(yacht)}
     <div className="flex justify-center items-center h-20 border border-gray-300 rounded-lg shadow-sm">
     <Image src="/assets/images/logoround.svg" width={50} height={50} className="" alt="Company Logo" />
    </div>
   </div>
   </>
  );
};

export default YachtDetailsGrid;
