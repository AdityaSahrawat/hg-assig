

const Loader = ()=>{
    return (
        <div className="flex justify-center items-center h-screen w-screen">
            <div className="relative">
                <div className="w-14 h-14 border-4 border-gray-200 rounded-full"></div>
                <div className="w-14 h-14 border-4 border-t-yellow-300 rounded-full absolute top-0 left-0 animate-spin"></div>
            </div>
        </div>
    )
}

export default Loader