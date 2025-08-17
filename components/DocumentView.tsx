'use client'

import { ViewType, SpreadsheetRow, Metadata } from '@/types'
import { ImageWithFallback } from './figma/ImageWithFallback'

interface DocumentViewProps {
  viewType: ViewType
  metadata: Metadata
  rows: SpreadsheetRow[]
}

export function DocumentView({ viewType, metadata, rows }: DocumentViewProps) {
  const getDocumentTitle = () => {
    switch (viewType) {
      case '报价单': return '报价单'
      case '生产单': return '生产单'
      case '送货单': return '送货单'
      case '采购单': return '采购单'
      default: return '文档'
    }
  }

  const getVisibleColumns = () => {
    switch (viewType) {
      case '报价单':
        return ['零件图片', '图号', '规格', '材料', '数量', '单价', '总价']
      case '生产单':
        return ['零件图片', '图号', '规格', '材料', '数量', '加工方式', '工艺要求', '备注']
      case '送货单':
        return ['零件图片', '图号', '规格', '数量', '备注']
      case '采购单':
        return ['零件图片', '图号', '规格', '材料', '数量', '单价', '总价']
      default:
        return []
    }
  }

  const getDocumentFields = () => {
    const baseFields = [
      { key: '本公司名称', label: '本公司名称', value: metadata.本公司名称 },
      { key: '本公司地址', label: '本公司地址', value: metadata.本公司地址 },
      { key: '本公司联系人', label: '本公司联系人', value: metadata.本公司联系人 }
    ]

    let specificFields: { key: string; label: string; value: string }[] = []

    switch (viewType) {
      case '报价单':
        specificFields = [
          { key: '销售单号', label: '销售单号', value: metadata.销售单号 },
          { key: '交期', label: '交期', value: metadata.交期 },
          { key: '客户名称', label: '客户名称', value: metadata.客户名称 },
          { key: '联系人', label: '联系人', value: metadata.联系人 },
          { key: '制单人', label: '制单人', value: metadata.制单人 }
        ]
        break
      case '生产单':
        specificFields = [
          { key: '销售单号', label: '销售单号', value: metadata.销售单号 },
          { key: '交期', label: '交期', value: metadata.交期 },
          { key: '客户名称', label: '客户名称', value: metadata.客户名称 },
          { key: '制单人', label: '制单人', value: metadata.制单人 }
        ]
        break
      case '送货单':
        specificFields = [
          { key: '销售单号', label: '销售单号', value: metadata.销售单号 },
          { key: '交期', label: '交期', value: metadata.交期 },
          { key: '客户名称', label: '客户名称', value: metadata.客户名称 },
          { key: '联系人', label: '联系人', value: metadata.联系人 }
        ]
        break
      case '采购单':
        specificFields = [
          { key: '采购供应商', label: '采购供应商', value: metadata.采购供应商 },
          { key: '采购收件地址', label: '采购收件地址', value: metadata.采购收件地址 },
          { key: '采购寄出时间', label: '采购寄出时间', value: metadata.采购寄出时间 },
          { key: '制单人', label: '制单人', value: metadata.制单人 }
        ]
        break
    }

    return [...baseFields, ...specificFields]
  }

  const getFilteredRows = () => {
    if (viewType === '采购单') {
      return rows.filter(row => row.采购)
    }
    return rows.filter(row => 
      Object.values(row).some(value => 
        value !== null && value !== '' && value !== false
      )
    )
  }

  const visibleColumns = getVisibleColumns()
  const filteredRows = getFilteredRows()
  const documentFields = getDocumentFields()

  const calculateTotal = () => {
    if (viewType === '报价单' || viewType === '采购单') {
      return filteredRows.reduce((total, row) => {
        const price = parseFloat(row.总价) || 0
        return total + price
      }, 0).toFixed(2)
    }
    return null
  }

  return (
    <div className="max-w-full bg-white text-black print:shadow-none">
      {/* Document Header */}
      <div className="mb-8 text-center border-b-2 border-gray-300 pb-6">
        <h1 className="text-4xl tracking-tight mb-6">{getDocumentTitle()}</h1>
        
        {/* Company Information Section */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <span className="text-gray-600 block mb-1">公司名称</span>
              <div className="border-b border-gray-400 pb-1 min-h-[1.5rem]">
                {metadata.本公司名称 || '_____'}
              </div>
            </div>
            <div className="text-center">
              <span className="text-gray-600 block mb-1">公司地址</span>
              <div className="border-b border-gray-400 pb-1 min-h-[1.5rem]">
                {metadata.本公司地址 || '_____'}
              </div>
            </div>
            <div className="text-center">
              <span className="text-gray-600 block mb-1">公司联系人</span>
              <div className="border-b border-gray-400 pb-1 min-h-[1.5rem]">
                {metadata.本公司联系人 || '_____'}
              </div>
            </div>
          </div>
        </div>

        {/* Document Specific Information */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          {documentFields.slice(3).map((field) => (
            <div key={field.key} className="text-left">
              <span className="text-gray-600 block mb-1">{field.label}:</span>
              <div className="border-b border-gray-300 pb-1 min-h-[1.5rem]">
                {field.value || '_____'}
              </div>
            </div>
          ))}
          {metadata.备注 && (
            <div className="text-left col-span-full">
              <span className="text-gray-600 block mb-1">备注:</span>
              <div className="border-b border-gray-300 pb-1 min-h-[1.5rem]">
                {metadata.备注 || '_____'}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Document Table */}
      <div className="mb-8">
        <table className="w-full border-collapse border-2 border-gray-400">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-400 px-3 py-3 text-left text-sm">序号</th>
              {visibleColumns.map(column => (
                <th key={column} className="border border-gray-400 px-3 py-3 text-left text-sm">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row, index) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="border border-gray-400 px-3 py-3 text-sm text-center">{index + 1}</td>
                {visibleColumns.map(column => (
                  <td key={column} className="border border-gray-400 px-3 py-3 text-sm">
                    {column === '零件图片' && row[column] ? (
                      <div className="flex justify-center">
                        <ImageWithFallback
                          src={typeof row[column] === 'string' ? row[column] as string : URL.createObjectURL(row[column] as File)}
                          alt="零件图片"
                          className="h-16 w-16 object-cover rounded border border-gray-300"
                        />
                      </div>
                    ) : column === '采购' ? (
                      row[column] ? '是' : '否'
                    ) : column === '单价' || column === '总价' ? (
                      row[column as keyof SpreadsheetRow] ? `¥${row[column as keyof SpreadsheetRow]}` : '-'
                    ) : (
                      row[column as keyof SpreadsheetRow] || '-'
                    )}
                  </td>
                ))}
              </tr>
            ))}
            {filteredRows.length === 0 && (
              <tr>
                <td 
                  colSpan={visibleColumns.length + 1} 
                  className="border border-gray-400 px-3 py-8 text-center text-gray-500"
                >
                  暂无数据
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Total */}
      {calculateTotal() && (
        <div className="flex justify-end mb-8">
          <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-300">
            <div className="text-xl">
              <span className="text-gray-700 mr-6">合计金额:</span>
              <span className="text-2xl">¥{calculateTotal()}</span>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="border-t-2 border-gray-300 pt-8 text-sm text-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="mb-3">制单人:</div>
            <div className="border-b-2 border-gray-400 pb-1 w-24 min-h-[1.5rem]">
              {viewType === '采购单' ? metadata.制单人 || '_____' : metadata.制单人 || '_____'}
            </div>
          </div>
          <div>
            <div className="mb-3">审核人:</div>
            <div className="border-b-2 border-gray-400 pb-1 w-24 min-h-[1.5rem]">_____</div>
          </div>
          <div>
            <div className="mb-3">
              {viewType === '采购单' ? '采购日期:' : '制单日期:'}
            </div>
            <div className="border-b-2 border-gray-400 pb-1 w-32 min-h-[1.5rem]">
              {viewType === '采购单' && metadata.采购寄出时间 
                ? new Date(metadata.采购寄出时间).toLocaleDateString('zh-CN')
                : new Date().toLocaleDateString('zh-CN')
              }
            </div>
          </div>
          <div>
            <div className="mb-3">签字:</div>
            <div className="border-b-2 border-gray-400 pb-1 w-24 min-h-[1.5rem]">_____</div>
          </div>
        </div>
      </div>
    </div>
  )
}