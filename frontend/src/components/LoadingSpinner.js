import React from 'react'

const LoadingSpinner = ({ text = 'Loading...' }) => {
  return (
    <div className="w-full py-20 flex flex-col items-center justify-center text-center">
      <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-gray-600 dark:text-gray-300">{text}</p>
    </div>
  )
}

export default LoadingSpinner


