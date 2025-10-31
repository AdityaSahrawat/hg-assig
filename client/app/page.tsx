"use client"


import Loader from "@/components/loader"
import ExpCard from "@/components/expCard"
import axios from "axios"
import { useEffect, useState } from "react"
import Image from "next/image"

export interface Experience {
  id: string;
  imageUrl: string;
  title: string;
  city: string;
  description: string;
  about: string;
  price: number;
  createdAt: Date | string;
}

const Index = ()=>{
  const [exp , setExp] = useState<Experience[] | []>([])
  const [loading , setLoading] = useState(true)
  const [search , setSearch] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const api = process.env.NEXT_PUBLIC_API
  console.log("api : " , api)
  useEffect(()=>{
    
    async function fetchExp(){
      setLoading(true)
      try {
        const response = await axios.get(`${api}/experience`)

        setExp(response.data.exp)
        setLoading(false)

      } catch (error) {
        setLoading(false)
        console.error({
          error
        })
      }
    } 
    
    fetchExp()
    
  },[])

  const filteredExp = exp.filter((experience) => {
    const searchLower = searchQuery.toLowerCase()
    if (searchQuery === "") return true // Show all if no search query
    return (
      experience.title.toLowerCase().includes(searchLower) ||
      experience.city.toLowerCase().includes(searchLower) ||
      experience.description.toLowerCase().includes(searchLower)
    )
  })

  const handleSearch = () => {
    setLoading(true)
    setSearchQuery(search)
    setLoading(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  if(loading){
    return(
      <Loader/>
    )
  }

  return (
    <div>
      <div className="flex w-full h-16 md:h-20 shadow-md items-center justify-between px-4 md:px-8 lg:px-25">
          <Image alt="alt" src={'/hg.png'} height={10} width={90} className="w-16 md:w-20 lg:w-24"></Image>
          <div className="flex items-center justify-center gap-2 md:gap-3">
              <input className="w-32 sm:w-48 md:w-64 px-2 md:px-4 py-1.5 md:py-2 text-sm md:text-base rounded-xl border border-gray-300 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent shadow-sm transition-all duration-200" placeholder="Search experiences..."
              value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyPress}
              ></input>
              <div onClick={handleSearch} className="hover:cursor-pointer bg-yellow-300 rounded-lg py-1.5 md:py-2 px-3 md:px-4 text-sm md:text-base hover:bg-yellow-400 transition-colors duration-200">Search</div>
          </div>
      </div>  
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        {filteredExp.length === 0 && searchQuery !== "" ? (
          <div className="text-center mt-20 text-gray-500 text-xl">
            No experiences found for &quot;{searchQuery}&quot;
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-10 mb-10">
            {
              filteredExp.map((exp : Experience , index)=>(
                <ExpCard key={index} imageUrl={exp.imageUrl} city={exp.city} title={exp.title} description={exp.description} price={exp.price} expId={exp.id}  />
              ))
            }
          </div>
        )}
      </div>
      
    </div>
  )
}
export default Index