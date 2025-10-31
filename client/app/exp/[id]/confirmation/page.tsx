"use client"

import Image from "next/image"
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Check } from "lucide-react";

interface ConfirmationData {
    experienceId: string
    experienceTitle: string
    experienceImage: string
    slotId: string
    date: string
    time: string
    quantity: number
    price: number
    subtotal: number
    taxes: number
    total: number
    bookingId: string
    name: string
    email: string
}

const ConfirmationPage = () => {
    const router = useRouter()
    const [confirmationData, setConfirmationData] = useState<ConfirmationData | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const loadData = () => {
            const data = localStorage.getItem('bookingConfirmation')
            if (data) {
                try {
                    const parsedData = JSON.parse(data)
                    setConfirmationData(parsedData)
                } catch (error) {
                    console.error('Error parsing booking data:', error)
                    router.push('/')
                }
            } else {
                router.push('/')
            }
            setIsLoading(false)
        }
        
        loadData()
    }, [router])

    if (!confirmationData || isLoading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="flex w-full h-20 shadow-md items-center justify-between px-24 bg-white">
                <Image alt="Highway Delite Logo" src={'/hg.png'} height={40} width={90}></Image>
                <div className="flex items-center gap-3">
                    <input 
                        disabled 
                        className="w-64 px-4 py-2 rounded-xl border border-gray-300 text-gray-700 placeholder-gray-400" 
                        placeholder="Search experiences..."
                    />
                    <button className="bg-yellow-300 rounded-lg py-2 px-4 hover:bg-yellow-400">Search</button>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center mt-20">
                <div className="bg-green-500 rounded-full w-24 h-24 flex items-center justify-center mb-6">
                    <Check className="w-12 h-12 text-white" strokeWidth={3} />
                </div>

                <h1 className="text-3xl font-bold text-gray-800 mb-2">Booking Confirmed</h1>
                
                <p className="text-gray-600 mb-8">
                    Ref ID: {confirmationData.bookingId}
                </p>

                <button 
                    onClick={() => {
                        localStorage.removeItem('bookingConfirmation')
                        router.push('/')
                    }}
                    className="bg-gray-300 hover:bg-gray-400 px-6 py-3 rounded-lg text-gray-800 font-medium"
                >
                    Back to Home
                </button>
            </div>
        </div>
    )
}

export default ConfirmationPage
