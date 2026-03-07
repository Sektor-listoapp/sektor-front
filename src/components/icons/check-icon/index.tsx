import React from 'react'
import Image from 'next/image'
import checkIcon from './check-icon.svg'

const CheckIcon = () => {
  return (
    <div className="flex items-center justify-center">
      <Image src={checkIcon} alt="" width={24} height={24} aria-hidden />
    </div>
  )
}

export default CheckIcon
