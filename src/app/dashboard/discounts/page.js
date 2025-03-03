import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft } from 'lucide-react'
import React from 'react'

const PartnersDiscounts = () => {
  return (
    <section className="py-10 px-2">
        <div className='container px-2 mx-auto flex items-center space-x-4'>
            <Button className="bg-[#F8F8F8] hover:bg-[#F8F8F8] shadow-md rounded-full flex items-center justify-center w-10 h-10">
                <ArrowLeft className='w-4 h-4 text-black' />
            </Button>
            <h1 className='text-sm md:text-lg font-medium'>Partners Discounts</h1>
        </div>
        <div className='container px-2 mx-auto my-12'>
            <div className='flex flex-col justify-center items-center gap-4'>
                <div className='flex flex-col gap-2 w-full max-w-[350px]'>
                    <h1 className='text-lg font-bold'>Reference Code<span className='text-red-500'>*</span></h1>
                    <form className='w-full flex flex-col gap-4'>
                        <Input required type='text' placeholder='Enter your code here' />
                    <div className='flex items-center space-x-2'>
                        <Button className='bg-[#BEA355] text-white rounded-full h-10 w-full'>Apply Code</Button>
                    </div>
                    </form>
                </div>
            </div>
        </div>
    </section>
  )
}

export default PartnersDiscounts
