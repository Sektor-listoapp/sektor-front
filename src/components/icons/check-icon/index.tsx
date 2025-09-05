import React from 'react'
import Image from 'next/image'
import checkIcon from './check-icon.svg'

const CheckIcon = () => {
  return (
    <div className="flex items-center justify-center">
      <Image src={checkIcon} alt="check-icon" width={24} height={24} />
    </div>
  )
}

export default CheckIcon
