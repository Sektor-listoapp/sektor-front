import Image from 'next/image'
import React from 'react'
import closeIcon from './close-icon.svg'

const CloseIcon = () => {
  return (
    <div className="flex items-center justify-center">
   <Image src={closeIcon} alt="close-icon" width={24} height={24} />
   </div>
  )
}

export default CloseIcon
