"use client"

import Image from "next/image"
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";

interface BookingData {
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
}

const PaymentPage = () => {
    const { id } = useParams()
    const router = useRouter()
    const [bookingData, setBookingData] = useState<BookingData | null>(null)
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [promoCode, setPromoCode] = useState("")
    const [agreeTerms, setAgreeTerms] = useState(false)
    const [loading, setLoading] = useState(false)
    const api = process.env.NEXT_PUBLIC_API

    useEffect(() => {
        const data = localStorage.getItem('bookingData')
        if (data) {
            setBookingData(JSON.parse(data))
        } else {
            router.push(`/exp/${id}`)
        }
    }, [id, router])

    const handleApplyPromo = async () => {
        if (!promoCode.trim()) return
        
        try {
            const res = await axios.post(`${api}/promo/validate`, { code: promoCode })
            if (res.data.valid) {
                alert(`Promo code applied! ${res.data.data.type === 'percentage' ? res.data.data.value + '%' : '₹' + res.data.data.value} off`)
            }
        } catch {
            alert("Invalid or expired promo code")
        }
    }

    const handlePayment = async () => {
        if (!fullName.trim() || !email.trim() || !agreeTerms || !bookingData) {
            alert("Please fill all required fields and agree to terms")
            return
        }

        setLoading(true)
        try {
            const data = {
                startDate: bookingData.date,
                endDate: bookingData.date,
                experienceId: bookingData.experienceId,
                name: fullName,
                Email: email,
                slotId: bookingData.slotId,
                quantity: bookingData.quantity,
                promoCode: promoCode || undefined,
            }

            const res = await axios.post(`${api}/booking`, data)
            
            if (res.status === 201) {
                router.push(`/exp/${id}/confirmation`)
            }
        } catch (error) {
            let errorMessage = "Booking failed. Please try again."
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as { response?: { data?: { message?: string } } }
                errorMessage = axiosError.response?.data?.message || errorMessage
            }
            alert(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    if (!bookingData) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>
    }

    const formattedDate = new Date(bookingData.date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
    })

    const formattedTime = new Date(bookingData.time).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    })

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

            <div onClick={() => router.push(`/exp/${id}`)} className="flex items-center gap-2 ml-4 md:ml-12 lg:ml-24 mt-4 md:mt-6 hover:cursor-pointer w-fit">
                <ArrowLeft className="w-4 h-4 md:w-5 md:h-5"/>
                <div className="text-xs md:text-sm">Checkout</div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 md:gap-8 mx-4 md:mx-12 lg:mx-24 mt-4 md:mt-6 mb-12">
                <div className="flex-1 bg-white rounded-lg p-4 md:p-6 shadow-sm">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Full name</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="John Doe"
                                className="w-full px-3 md:px-4 py-2 text-sm md:text-base rounded-lg border border-gray-300 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Email</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="test@test.com"
                                className="w-full px-3 md:px-4 py-2 text-sm md:text-base rounded-lg border border-gray-300 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Promo code</label>
                            <div className="flex gap-2">
                                <input type="text" value={promoCode} onChange={(e) => setPromoCode(e.target.value)}
                                    className="flex-1 px-3 md:px-4 py-2 text-sm md:text-base rounded-lg border border-gray-300 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                                />
                                <button  onClick={handleApplyPromo}
                                    className="bg-black text-white px-4 md:px-6 py-2 text-sm md:text-base rounded-lg hover:bg-gray-800"
                                >
                                    Apply
                                </button>
                            </div>
                        </div>

                        <div className="flex items-start gap-2 pt-2">
                            <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)}
                                className="mt-1" id="terms"
                            />
                            <label htmlFor="terms" className="text-xs md:text-sm text-gray-600">
                                I agree to the terms and safety policy
                            </label>
                        </div>
                    </div>
                </div>

                <div className="w-full lg:w-80">
                    <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-5 shadow-sm sticky top-4">
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <div className="text-gray-600">Experience</div>
                                <div className="font-medium text-right">{bookingData.experienceTitle}</div>
                            </div>

                            <div className="flex justify-between text-sm">
                                <div className="text-gray-600">Date</div>
                                <div className="font-medium">{formattedDate}</div>
                            </div>

                            <div className="flex justify-between text-sm">
                                <div className="text-gray-600">Time</div>
                                <div className="font-medium">{formattedTime}</div>
                            </div>

                            <div className="flex justify-between text-sm">
                                <div className="text-gray-600">Qty</div>
                                <div className="font-medium">{bookingData.quantity}</div>
                            </div>

                            <div className="border-t pt-3">
                                <div className="flex justify-between text-sm">
                                    <div className="text-gray-600">Subtotal</div>
                                    <div>₹{bookingData.subtotal}</div>
                                </div>
                            </div>

                            <div className="flex justify-between text-sm">
                                <div className="text-gray-600">Taxes</div>
                                <div>₹{bookingData.taxes}</div>
                            </div>

                            <div className="border-t pt-3">
                                <div className="flex justify-between text-lg font-semibold">
                                    <div>Total</div>
                                    <div>₹{bookingData.total}</div>
                                </div>
                            </div>

                            <button  onClick={handlePayment} disabled={loading || !fullName.trim() || !email.trim() || !agreeTerms}
                                className={`w-full py-3 rounded-lg font-medium mt-4 ${
                                    loading || !fullName.trim() || !email.trim() || !agreeTerms
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                        : 'bg-yellow-300 hover:bg-yellow-400'
                                }`}
                            >
                                {loading ? 'Processing...' : 'Pay and Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PaymentPage
