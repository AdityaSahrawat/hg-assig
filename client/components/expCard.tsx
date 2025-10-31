

import Image from "next/image"
import { useRouter } from "next/navigation"


const ExpCard = ({imageUrl , city , title , description , price , expId} : {imageUrl : string , city : string , title : string , description: string , price : number , expId : string})=>{
    const router = useRouter()
    return (
        <div className="w-full max-w-sm mx-auto rounded-xl relative mb-6 md:mb-10 bg-gray-50 hover:shadow-md transition-shadow duration-300">
            <div className="relative w-full h-48 md:h-52 rounded-t-xl overflow-hidden">
                <Image alt="efwwe" fill style={{ objectFit: 'cover' }} src={imageUrl}></Image>
            </div>
            <div className="flex items-center justify-between mb-1 p-3">
                <div className="text-gray-900 font-semibold text-base md:text-lg truncate">{title}</div>
                <div className="bg-gray-200 text-gray-700 text-xs md:text-sm font-medium px-2 py-1 rounded-md whitespace-nowrap ml-2">{city}</div>
            </div>

            <div className="text-gray-600 text-sm mb-3 px-3 line-clamp-2">{description}</div>


            <div className="flex items-center justify-between px-3 pb-3">
                <span className="text-gray-800 font-medium text-xs md:text-sm">
                    From <span className="text-black font-bold text-base md:text-lg">₹{price}</span>
                </span>
                <button onClick={()=>{router.push(`/exp/${expId}`)}} className="hover:cursor-pointer bg-yellow-400 hover:bg-yellow-500 text-black font-medium text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2 rounded-md transition-colors whitespace-nowrap">
                    View Details
                </button>
            </div>
        </div>
    )

}

export default ExpCard