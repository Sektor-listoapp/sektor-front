import Image from 'next/image'
import React from 'react'
import closeIcon from './close-icon.svg'

const CloseIcon = () => {
  return (
    <div className="flex items-center justify-center">
   <Image src={closeIcon} alt="" width={24} height={24} aria-hidden />
   </div>
  )
}

export default CloseIcon
