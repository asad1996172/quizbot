import React from 'react'
import Image from 'next/image'

const loading = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <Image src="/assets/icons/loader.svg" alt="loading" width={50} height={50} className="object-container" />
        </div>
    )
}

export default loading