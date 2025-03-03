"use client";
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress';
import { ArrowLeft } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';

const ListYachts = () => {
    const [progress, setProgress] = useState(0)
    const [currentStep, setCurrentStep] = useState(1)
    const totalSteps = 3

    useEffect(() => {
      const timer = setTimeout(() => setProgress((currentStep / totalSteps) * 100), 500)
      return () => clearTimeout(timer)
    }, [currentStep])

    const nextStep = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(prev => prev + 1)
        }
    }

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1)
        }
    }

    const renderStep = () => {
        switch(currentStep) {
            case 1:
                return <StepOne />
            case 2:
                return <StepTwo />
            case 3:
                return <StepThree />
            default:
                return <StepOne />
        }
    }

    return (
        <section className="py-10">
            <div className='container px-2 mx-auto flex items-center space-x-4'>
                {currentStep > 0 && (
                    <Button 
                        onClick={prevStep}
                        className="bg-[#F8F8F8] hover:bg-[#F8F8F8] shadow-md rounded-full flex items-center justify-center w-10 h-10"
                    >
                        <ArrowLeft className='w-4 h-4 text-black' />
                    </Button>
                )}
                <h1 className='text-sm md:text-lg font-medium'>List your yachts</h1>
            </div>
            <Progress value={progress} className="w-full bg-[#F8F8F8] container mx-auto my-12" />
            <div className='container mx-auto flex flex-col gap-6'>
                {renderStep()}
                <div className='flex justify-end mt-4'>
                    {currentStep < totalSteps && (
                        <Button onClick={nextStep} className="bg-[#BEA355] rounded-full text-white px-4 py-2">
                            Next
                        </Button>
                    )}
                    {currentStep === totalSteps && (
                        <Button onClick={() => alert('Yacht Listed!')} className="bg-[#BEA355] rounded-full text-white px-4 py-2">
                            Submit
                        </Button>
                    )}
                </div>
            </div>
        </section>
    )
}

export default ListYachts