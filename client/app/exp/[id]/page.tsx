"use client"

import Image from "next/image"
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Loader from "@/components/loader";
import { useState , useEffect } from "react";
import axios from "axios";

export interface Experience {
  id: string;
  imageUrl: string;
  title: string;
  city: string;
  description: string;
  about: string;
  price: number;
  createdAt: Date | string;
  slot?: Slot[];
}

export interface Slot {
  id: string;
  experienceId: string;
  experience?: Experience;
  date: Date | string;
  time: Date | string;
  bookedCount: number;
  capacity: number;
}

const Index = ()=>{
    const {id} = useParams()
    const router = useRouter()
    const [loading , setLoading] = useState(false)
    const [exp , setExp] = useState<Experience | null>()
    const [quantity , setQuantity] = useState(1)
    const [selectedDate, setSelectedDate] = useState<string>("")
    const [selectedTime, setSelectedTime] = useState<string>("")
    const api = process.env.NEXT_PUBLIC_API

    useEffect(()=>{
        const fetchExp =  async()=>{
            setLoading(true)
            const res = await axios.get(`${api}/experience/${id}`)
            setExp(res.data.exp)
            setLoading(false)
        }
        fetchExp()
    },[id, api])

    const subtotal = exp?.price ? exp.price * quantity : 0
    const taxes = Math.round(subtotal * 0.06)
    const total = subtotal + taxes

    const getUniqueDates = () => {
        if (!exp?.slot) return []
        const dates = exp.slot.map(slot => new Date(slot.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
        return [...new Set(dates)]
    }

    const getTimesForDate = (date: string) => {
        if (!exp?.slot) return []
        return exp.slot.filter(slot => {
            const slotDate = new Date(slot.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            return slotDate === date
        })
    }

    const getAvailableSlots = (slot: Slot) => {
        return slot.capacity - slot.bookedCount
    }

    const getSelectedSlot = () => {
        if (!exp?.slot || !selectedTime) return null
        return exp.slot.find(slot => slot.id === selectedTime)
    }

    const isConfirmDisabled = () => {
        if (!selectedDate || !selectedTime) return true
        const selectedSlot = getSelectedSlot()
        if (!selectedSlot) return true
        const availableSlots = getAvailableSlots(selectedSlot)
        return quantity > availableSlots
    }

    const handleConfirm = () => {
        if (isConfirmDisabled()) return
        const selectedSlot = getSelectedSlot()
        if (!selectedSlot) return

        const bookingData = {
            experienceId: id,
            experienceTitle: exp?.title,
            experienceImage: exp?.imageUrl,
            slotId: selectedTime,
            date: selectedSlot.date,
            time: selectedSlot.time,
            quantity,
            price: exp?.price,
            subtotal,
            taxes,
            total
        }

        localStorage.setItem('bookingData', JSON.stringify(bookingData))
        router.push(`/exp/${id}/payment`)
    }

    if(loading){
        return(
            <Loader/>
        )
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="flex w-full h-16 md:h-20 shadow-md items-center justify-between px-4 md:px-12 lg:px-24 bg-white">
                <Image alt="Highway Delite Logo" src={'/hg.png'} height={40} width={90} className="w-16 md:w-20 lg:w-24"></Image>
                <div className="hidden md:flex items-center gap-3">
                    <input 
                        disabled 
                        className="w-48 md:w-64 px-3 md:px-4 py-2 text-sm md:text-base rounded-xl border border-gray-300 text-gray-700 placeholder-gray-400" 
                        placeholder="Search experiences..."
                    />
                    <button className="bg-yellow-300 rounded-lg py-2 px-3 md:px-4 text-sm md:text-base hover:bg-yellow-400">Search</button>
                </div>
            </div> 

            <div onClick={()=>{router.push('/')}} className="flex items-center gap-2 ml-4 md:ml-12 lg:ml-24 mt-4 md:mt-6 hover:cursor-pointer w-fit">
                <ArrowLeft className="w-4 h-4 md:w-5 md:h-5"/>
                <div className="text-xs md:text-sm">Details</div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 md:gap-8 mx-4 md:mx-12 lg:mx-24 mt-4 md:mt-6">
                <div className="flex-1">
                    {exp?.imageUrl && (
                        <Image 
                            alt={exp.title} 
                            src={exp.imageUrl} 
                            height={400} 
                            width={600} 
                            className="w-full h-48 md:h-64 object-cover rounded-lg"
                        />
                    )}

                    <div className="mt-4 md:mt-5 text-xl md:text-2xl font-semibold border-b-2 border-blue-900 pb-2 inline-block">
                        {exp?.title}
                    </div>
                    
                    <div className="mt-3 text-sm text-gray-600 leading-relaxed">
                        {exp?.description}
                    </div>

                    <div className="mt-6 md:mt-8">
                        <div className="text-sm font-semibold mb-3">Choose date</div>
                        <div className="flex gap-2 flex-wrap">
                            {getUniqueDates().map((date, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedDate(date)}
                                    className={`px-3 md:px-4 py-2 text-xs md:text-sm border rounded ${
                                        selectedDate === date 
                                            ? 'bg-yellow-300 border-yellow-400' 
                                            : 'bg-white border-gray-300'
                                    }`}
                                >
                                    {date}
                                </button>
                            ))}
                        </div>
                    </div>

                    {selectedDate && (
                        <div className="mt-4 md:mt-6">
                            <div className="text-sm font-semibold mb-3">Choose time</div>
                            <div className="flex gap-2 flex-wrap">
                                {getTimesForDate(selectedDate).map((slot, index) => {
                                    const availableSlots = getAvailableSlots(slot)
                                    const timeStr = new Date(slot.time).toLocaleTimeString('en-US', { 
                                        hour: 'numeric', 
                                        minute: '2-digit',
                                        hour12: true 
                                    })
                                    const isSoldOut = availableSlots === 0
                                    
                                    return (
                                        <button
                                            key={index}
                                            onClick={() => !isSoldOut && setSelectedTime(slot.id)}
                                            disabled={isSoldOut}
                                            className={`px-3 md:px-4 py-2 text-xs md:text-sm border rounded relative ${
                                                isSoldOut 
                                                    ? 'bg-gray-200 border-gray-300 text-gray-500 cursor-not-allowed' 
                                                    : selectedTime === slot.id 
                                                        ? 'bg-yellow-300 border-yellow-400' 
                                                        : 'bg-white border-gray-300'
                                            }`}
                                        >
                                            <div>{timeStr}</div>
                                            <div className="text-xs text-red-500">
                                                {isSoldOut ? 'Sold out' : `${availableSlots} left`}
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                            <div className="text-xs text-gray-500 mt-2">
                                All times are in IST (GMT +5:30)
                            </div>
                        </div>
                    )}

                    <div className="mt-6 md:mt-8 mb-6 lg:mb-0">
                        <div className="text-sm font-semibold mb-2">About</div>
                        <div className="text-sm text-gray-600 bg-gray-100 p-3 rounded">
                            {exp?.about}
                        </div>
                    </div>
                </div>

                <div className="w-full lg:w-80">
                    <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-5 shadow-sm sticky top-4">
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Starts at</span>
                                <span className="font-semibold">₹{exp?.price}</span>
                            </div>
                            
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">Quantity</span>
                                <div className="flex items-center gap-3">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-6 h-6 border rounded flex items-center justify-center hover:bg-gray-100">
                                        −
                                    </button>
                                    <span>{quantity}</span>
                                    <button onClick={() => {
                                            const selectedSlot = getSelectedSlot()
                                            const maxQty = selectedSlot ? getAvailableSlots(selectedSlot) : 999
                                            if (quantity < maxQty) {
                                                setQuantity(quantity + 1)
                                            }
                                        }}
                                        className="w-6 h-6 border rounded flex items-center justify-center hover:bg-gray-100">
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-between text-sm">
                                <div className="text-gray-600">Subtotal</div>
                                <div>₹{subtotal}</div>
                            </div>

                            <div className="flex justify-between text-sm">
                                <div className="text-gray-600">Taxes</div>
                                <div>₹{taxes}</div>
                            </div>

                            <div className="border-t pt-3 mt-3">
                                <div className="flex justify-between text-lg font-semibold">
                                    <div>Total</div>
                                    <div>₹{total}</div>
                                </div>
                            </div>

                            <button onClick={handleConfirm} disabled={isConfirmDisabled()} className={`w-full py-3 rounded-lg font-medium mt-4 ${
                                    isConfirmDisabled() 
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                        : 'bg-yellow-300 hover:bg-yellow-400'
                                }`}>
                                Confirm
                            </button>
                            {isConfirmDisabled() && (
                                <p className="text-xs text-red-500 text-center mt-2">
                                    {!selectedDate || !selectedTime 
                                        ? 'Please select date and time' 
                                        : 'Quantity exceeds available slots'}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Index