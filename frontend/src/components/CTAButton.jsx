import React from 'react'

function CTAButton({ text, onClick, disabled }) {
  return (
    <button
      type="submit"
      onClick={onClick}
      disabled={disabled}
      className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold py-2.5 px-4 rounded transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer text-center"
    >
      {text}
    </button>
  )
}

export default CTAButton
