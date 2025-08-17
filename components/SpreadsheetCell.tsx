'use client'

import { useState, useRef, useEffect } from 'react'
import { Checkbox } from './ui/checkbox'
import { ImageWithFallback } from './figma/ImageWithFallback'
import { ImageIcon, X } from 'lucide-react'

interface SpreadsheetCellProps {
  value: any
  type: 'text' | 'number' | 'image' | 'checkbox'
  isSelected: boolean
  isEditing: boolean
  onChange: (value: any) => void
  onEditingChange: (editing: boolean) => void
}

export function SpreadsheetCell({ 
  value, 
  type, 
  isSelected, 
  isEditing, 
  onChange, 
  onEditingChange 
}: SpreadsheetCellProps) {
  const [localValue, setLocalValue] = useState(value || '')
  const inputRef = useRef<HTMLInputElement>(null)
  const cellRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  useEffect(() => {
    setLocalValue(value || '')
  }, [value])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault()
      e.stopPropagation()
      onChange(localValue)
      onEditingChange(false)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      e.stopPropagation()
      setLocalValue(value || '')
      onEditingChange(false)
    }
  }

  const handleBlur = () => {
    onChange(localValue)
    onEditingChange(false)
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    if (type === 'image') {
      e.preventDefault()
      e.stopPropagation()
      
      const items = e.clipboardData.items
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile()
          if (blob) {
            const reader = new FileReader()
            reader.onload = (event) => {
              onChange(event.target?.result as string)
            }
            reader.readAsDataURL(blob)
          }
          return
        }
      }

      // If no image found, try to get image from URL
      const text = e.clipboardData.getData('text/plain')
      if (text && (text.startsWith('http') || text.startsWith('data:image'))) {
        onChange(text)
      }
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    if (type === 'image') {
      e.preventDefault()
      e.stopPropagation()
      
      const files = e.dataTransfer.files
      if (files.length > 0) {
        const file = files[0]
        if (file.type.startsWith('image/')) {
          const reader = new FileReader()
          reader.onload = (event) => {
            onChange(event.target?.result as string)
          }
          reader.readAsDataURL(file)
        }
      }
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    if (type === 'image') {
      e.preventDefault()
    }
  }

  if (type === 'image') {
    return (
      <div 
        ref={cellRef}
        className={`
          h-16 flex items-center justify-center relative group
          ${isSelected ? 'bg-accent/20' : 'hover:bg-muted/20'}
        `}
        onPaste={handlePaste}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        tabIndex={isSelected ? 0 : -1}
      >
        {value ? (
          <div className="relative">
            <ImageWithFallback
              src={typeof value === 'string' ? value : URL.createObjectURL(value)}
              alt="零件图片"
              className="h-12 w-12 object-cover rounded-md border border-border/30"
            />
            <button
              onClick={(e) => {
                e.stopPropagation()
                onChange(null)
              }}
              className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center text-xs"
            >
              <X className="h-2 w-2" />
            </button>
          </div>
        ) : (
          <div className={`
            h-12 w-12 border-2 border-dashed rounded-md flex items-center justify-center transition-colors duration-200
            ${isSelected 
              ? 'border-ring bg-accent/10' 
              : 'border-border/50 hover:border-border group-hover:bg-muted/30'
            }
          `}>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </div>
        )}
        {isSelected && !value && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-xs text-muted-foreground bg-background/90 px-2 py-1 rounded shadow-sm">
              粘贴图片
            </div>
          </div>
        )}
      </div>
    )
  }

  if (type === 'checkbox') {
    return (
      <div className={`
        h-12 flex items-center justify-center
        ${isSelected ? 'bg-accent/20' : 'hover:bg-muted/20'}
      `}>
        <Checkbox
          checked={value}
          onCheckedChange={onChange}
        />
      </div>
    )
  }

  return (
    <div className={`
      h-12 relative
      ${isSelected ? 'bg-accent/20' : ''}
    `}>
      {isEditing ? (
        <input
          ref={inputRef}
          type={type === 'number' ? 'number' : 'text'}
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="w-full h-full px-3 bg-background border-0 outline-none focus:ring-2 focus:ring-ring"
          autoFocus
        />
      ) : (
        <div 
          className={`
            w-full h-full px-3 flex items-center cursor-cell
            ${!value && 'text-muted-foreground'}
          `}
        >
          {value || (isSelected ? (type === 'number' ? '0' : '输入内容') : '')}
        </div>
      )}
    </div>
  )
}