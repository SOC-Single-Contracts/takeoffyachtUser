import Image from 'next/image';
import Link from 'next/link';

const WhatsAppButton = () => {
  return (
    <Link 
      href="https://wa.me/your_number"
      target="_blank" 
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 bg-green-500 text-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
      <Image src="/assets/images/icons8-whatsapp.svg" alt="WhatsApp" className='invert' width={30} height={30} />
    </Link>
  );
};

export default WhatsAppButton;