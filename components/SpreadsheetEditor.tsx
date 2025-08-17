'use client'

import { useState, useRef, useCallback } from 'react'
import { SpreadsheetRow } from '../App'
import { SpreadsheetCell } from './SpreadsheetCell'
import { Button } from './ui/button'
import { Plus, Trash2 } from 'lucide-react'

interface SpreadsheetEditorProps {
  rows: SpreadsheetRow[]
  onRowsChange: (rows: SpreadsheetRow[]) => void
}

interface CellPosition {
  rowIndex: number
  columnKey: keyof SpreadsheetRow
}

export function SpreadsheetEditor({ rows, onRowsChange }: SpreadsheetEditorProps) {
  const [selectedCell, setSelectedCell] = useState<CellPosition | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const columns = [
    { key: '零件图片' as keyof SpreadsheetRow, label: '零件图片', width: '120px', type: 'image' },
    { key: '图号' as keyof SpreadsheetRow, label: '图号', width: '120px', type: 'text' },
    { key: '规格' as keyof SpreadsheetRow, label: '规格', width: '140px', type: 'text' },
    { key: '材料' as keyof SpreadsheetRow, label: '材料', width: '120px', type: 'text' },
    { key: '数量' as keyof SpreadsheetRow, label: '数量', width: '80px', type: 'number' },
    { key: '加工方式' as keyof SpreadsheetRow, label: '加工方式', width: '120px', type: 'text' },
    { key: '工艺要求' as keyof SpreadsheetRow, label: '工艺要求', width: '140px', type: 'text' },
    { key: '备注' as keyof SpreadsheetRow, label: '备注', width: '120px', type: 'text' },
    { key: '单价' as keyof SpreadsheetRow, label: '单价', width: '80px', type: 'number' },
    { key: '总价' as keyof SpreadsheetRow, label: '总价', width: '80px', type: 'number' },
    { key: '采购' as keyof SpreadsheetRow, label: '采购', width: '60px', type: 'checkbox' }
  ]

  const addRow = () => {
    const newRow: SpreadsheetRow = {
      id: Date.now().toString(),
      零件图片: null,
      图号: '',
      规格: '',
      材料: '',
      数量: '',
      加工方式: '',
      工艺要求: '',
      备注: '',
      单价: '',
      总价: '',
      采购: false
    }
    onRowsChange([...rows, newRow])
  }

  const deleteRow = (id: string) => {
    onRowsChange(rows.filter(row => row.id !== id))
  }

  const updateCell = (rowId: string, column: keyof SpreadsheetRow, value: any) => {
    onRowsChange(rows.map(row => 
      row.id === rowId ? { ...row, [column]: value } : row
    ))
  }

  const handleCellClick = (rowIndex: number, columnKey: keyof SpreadsheetRow) => {
    setSelectedCell({ rowIndex, columnKey })
    setIsEditing(false)
  }

  const handleCellDoubleClick = (rowIndex: number, columnKey: keyof SpreadsheetRow) => {
    setSelectedCell({ rowIndex, columnKey })
    setIsEditing(true)
  }

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!selectedCell) return

    const { rowIndex, columnKey } = selectedCell
    const currentColumnIndex = columns.findIndex(col => col.key === columnKey)

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault()
        if (rowIndex > 0) {
          setSelectedCell({ rowIndex: rowIndex - 1, columnKey })
        }
        break
      case 'ArrowDown':
        e.preventDefault()
        if (rowIndex < rows.length - 1) {
          setSelectedCell({ rowIndex: rowIndex + 1, columnKey })
        }
        break
      case 'ArrowLeft':
        e.preventDefault()
        if (currentColumnIndex > 0) {
          setSelectedCell({ rowIndex, columnKey: columns[currentColumnIndex - 1].key })
        }
        break
      case 'ArrowRight':
        e.preventDefault()
        if (currentColumnIndex < columns.length - 1) {
          setSelectedCell({ rowIndex, columnKey: columns[currentColumnIndex + 1].key })
        }
        break
      case 'Enter':
        e.preventDefault()
        if (isEditing) {
          setIsEditing(false)
        } else {
          setIsEditing(true)
        }
        break
      case 'Escape':
        e.preventDefault()
        setIsEditing(false)
        break
      case 'Tab':
        e.preventDefault()
        if (currentColumnIndex < columns.length - 1) {
          setSelectedCell({ rowIndex, columnKey: columns[currentColumnIndex + 1].key })
        } else if (rowIndex < rows.length - 1) {
          setSelectedCell({ rowIndex: rowIndex + 1, columnKey: columns[0].key })
        }
        break
    }
  }, [selectedCell, isEditing, rows.length, columns])

  const parseTabularData = (text: string): string[][] => {
    const lines = text.split('\n').filter(line => line.trim())
    return lines.map(line => line.split('\t'))
  }

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    if (!selectedCell || isEditing) return

    const clipboardData = e.clipboardData
    const text = clipboardData.getData('text/plain')
    
    // Check if it's tabular data (contains tabs or multiple lines)
    if (text.includes('\t') || text.includes('\n')) {
      e.preventDefault()
      
      const data = parseTabularData(text)
      if (data.length === 0) return

      const { rowIndex, columnKey } = selectedCell
      const startColumnIndex = columns.findIndex(col => col.key === columnKey)
      
      // Create new rows if needed
      const newRows = [...rows]
      while (newRows.length < rowIndex + data.length) {
        const newRow: SpreadsheetRow = {
          id: Date.now().toString() + Math.random(),
          零件图片: null,
          图号: '',
          规格: '',
          材料: '',
          数量: '',
          加工方式: '',
          工艺要求: '',
          备注: '',
          单价: '',
          总价: '',
          采购: false
        }
        newRows.push(newRow)
      }

      // Fill in the data
      data.forEach((rowData, dataRowIndex) => {
        const targetRowIndex = rowIndex + dataRowIndex
        if (targetRowIndex < newRows.length) {
          rowData.forEach((cellValue, dataCellIndex) => {
            const targetColumnIndex = startColumnIndex + dataCellIndex
            if (targetColumnIndex < columns.length) {
              const column = columns[targetColumnIndex]
              if (column.type !== 'image' && column.key !== 'id') {
                if (column.type === 'checkbox') {
                  newRows[targetRowIndex][column.key] = cellValue.toLowerCase() === 'true' || cellValue === '1' || cellValue.toLowerCase() === 'yes'
                } else {
                  newRows[targetRowIndex][column.key] = cellValue
                }
              }
            }
          })
        }
      })

      onRowsChange(newRows)
    }
  }, [selectedCell, isEditing, rows, columns, onRowsChange])

  return (
    <div className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center justify-between">
          <h2 className="text-lg tracking-tight text-card-foreground">零件清单</h2>
          <Button 
            onClick={addRow}
            size="sm"
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            添加行
          </Button>
        </div>
      </div>

      <div 
        ref={containerRef}
        className="overflow-auto max-h-[70vh]"
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        tabIndex={0}
      >
        <div className="min-w-full">
          {/* Header */}
          <div className="flex border-b border-border/30 bg-muted/20 sticky top-0 z-10">
            <div className="w-12 p-3 text-center text-sm text-muted-foreground border-r border-border/30 bg-muted/20">
              #
            </div>
            {columns.map((column) => (
              <div 
                key={column.key}
                className="p-3 text-sm text-muted-foreground border-r border-border/30 last:border-r-0 bg-muted/20"
                style={{ width: column.width, minWidth: column.width }}
              >
                {column.label}
              </div>
            ))}
            <div className="w-12 p-3 text-center text-sm text-muted-foreground bg-muted/20">
              操作
            </div>
          </div>

          {/* Rows */}
          {rows.map((row, rowIndex) => (
            <div key={row.id} className="flex border-b border-border/10 hover:bg-muted/5 transition-colors duration-150">
              <div className="w-12 p-3 text-center text-sm text-muted-foreground border-r border-border/30 bg-muted/10">
                {rowIndex + 1}
              </div>
              {columns.map((column) => {
                const isSelected = selectedCell?.rowIndex === rowIndex && selectedCell?.columnKey === column.key
                return (
                  <div 
                    key={column.key}
                    className={`
                      border-r border-border/30 last:border-r-0 relative cursor-cell
                      ${isSelected ? 'ring-2 ring-ring ring-inset z-20' : ''}
                    `}
                    style={{ width: column.width, minWidth: column.width }}
                    onClick={() => handleCellClick(rowIndex, column.key)}
                    onDoubleClick={() => handleCellDoubleClick(rowIndex, column.key)}
                  >
                    <SpreadsheetCell
                      value={row[column.key]}
                      type={column.type}
                      isSelected={isSelected}
                      isEditing={isEditing && isSelected}
                      onChange={(value) => updateCell(row.id, column.key, value)}
                      onEditingChange={setIsEditing}
                    />
                  </div>
                )
              })}
              <div className="w-12 p-3 text-center">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteRow(row.id)}
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}