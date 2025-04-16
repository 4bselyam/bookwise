import { HexColorPicker } from 'react-colorful'
import React, { useState } from 'react'

interface Props {
  value?: string
  onPickerChange: (color: string) => void
}

const ColorPicker = () => {
  const [color, setColor] = useState('#aabbcc')
  const [isOpen, setIsOpen] = useState(false)

  return <HexColorPicker color={color} onChange={setColor} />
}

export default ColorPicker
