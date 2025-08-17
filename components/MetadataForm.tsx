'use client'

import { Metadata, ViewType } from '../App'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Separator } from './ui/separator'

interface MetadataFormProps {
  metadata: Metadata
  onMetadataChange: (metadata: Metadata) => void
  currentView: ViewType
}

export function MetadataForm({ metadata, onMetadataChange, currentView }: MetadataFormProps) {
  const handleChange = (field: keyof Metadata, value: string) => {
    onMetadataChange({
      ...metadata,
      [field]: value
    })
  }

  // Company fields - always visible
  const companyFields: { key: keyof Metadata; label: string; type?: string }[] = [
    { key: '本公司名称', label: '本公司名称' },
    { key: '本公司地址', label: '本公司地址' },
    { key: '本公司联系人', label: '本公司联系人' }
  ]

  // Get relevant fields based on document type
  const getRelevantFields = (): { key: keyof Metadata; label: string; type?: string }[] => {
    switch (currentView) {
      case '报价单':
        return [
          { key: '销售单号', label: '销售单号' },
          { key: '交期', label: '交期', type: 'date' },
          { key: '客户名称', label: '客户名称' },
          { key: '联系人', label: '联系人' },
          { key: '制单人', label: '制单人' },
          { key: '备注', label: '备注' }
        ]
      case '生产单':
        return [
          { key: '销售单号', label: '销售单号' },
          { key: '交期', label: '交期', type: 'date' },
          { key: '客户名称', label: '客户名称' },
          { key: '制单人', label: '制单人' },
          { key: '备注', label: '备注' }
        ]
      case '送货单':
        return [
          { key: '销售单号', label: '销售单号' },
          { key: '交期', label: '交期', type: 'date' },
          { key: '客户名称', label: '客户名称' },
          { key: '联系人', label: '联系人' },
          { key: '备注', label: '备注' }
        ]
      case '采购单':
        return [
          { key: '采购供应商', label: '采购供应商' },
          { key: '采购收件地址', label: '采购收件地址' },
          { key: '采购寄出时间', label: '采购寄出时间', type: 'datetime-local' },
          { key: '制单人', label: '制单人' },
          { key: '备注', label: '备注' }
        ]
      default: // edit mode - show all fields
        return [
          { key: '销售单号', label: '销售单号' },
          { key: '交期', label: '交期', type: 'date' },
          { key: '客户名称', label: '客户名称' },
          { key: '联系人', label: '联系人' },
          { key: '制单人', label: '制单人' },
          { key: '备注', label: '备注' },
          { key: '采购供应商', label: '采购供应商' },
          { key: '采购收件地址', label: '采购收件地址' },
          { key: '采购寄出时间', label: '采购寄出时间', type: 'datetime-local' }
        ]
    }
  }

  const relevantFields = getRelevantFields()

  return (
    <div className="rounded-xl border border-border/50 bg-card p-6 shadow-sm space-y-6">
      {/* Company Information - Always Visible */}
      <div>
        <h2 className="mb-4 text-lg tracking-tight text-card-foreground">公司信息</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {companyFields.map((field) => (
            <div key={field.key} className="space-y-2">
              <Label htmlFor={field.key} className="text-sm text-muted-foreground">
                {field.label}
              </Label>
              <Input
                id={field.key}
                type={field.type || 'text'}
                value={metadata[field.key]}
                onChange={(e) => handleChange(field.key, e.target.value)}
                className="border-0 bg-muted/30 focus:bg-background transition-colors duration-200"
                placeholder={`输入${field.label}`}
              />
            </div>
          ))}
        </div>
      </div>

      <Separator className="opacity-50" />

      {/* Document Specific Information */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg tracking-tight text-card-foreground">
            {currentView === 'edit' ? '文档信息' : 
             currentView === '采购单' ? '采购信息' : '销售信息'}
          </h2>
          {currentView !== 'edit' && (
            <div className="text-sm text-muted-foreground bg-accent/50 px-3 py-1 rounded-full">
              {currentView}相关字段
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {relevantFields.map((field) => (
            <div key={field.key} className="space-y-2">
              <Label htmlFor={field.key} className="text-sm text-muted-foreground">
                {field.label}
                {currentView === '采购单' && ['采购供应商', '采购收件地址'].includes(field.key) && (
                  <span className="text-destructive ml-1">*</span>
                )}
                {['报价单', '生产单', '送货单'].includes(currentView) && ['客户名称', '制单人'].includes(field.key) && (
                  <span className="text-destructive ml-1">*</span>
                )}
              </Label>
              <Input
                id={field.key}
                type={field.type || 'text'}
                value={metadata[field.key]}
                onChange={(e) => handleChange(field.key, e.target.value)}
                className="border-0 bg-muted/30 focus:bg-background transition-colors duration-200"
                placeholder={`输入${field.label}`}
              />
            </div>
          ))}
        </div>
      </div>

      {currentView === 'edit' && (
        <div className="text-sm text-muted-foreground bg-muted/30 p-4 rounded-lg">
          <p className="mb-2">💡 提示：</p>
          <ul className="space-y-1 text-xs">
            <li>• 公司信息会在所有文档中显示</li>
            <li>• 不同文档类型会显示相关的字段信息</li>
            <li>• 带 * 标记的字段为对应文档类型的必填项</li>
          </ul>
        </div>
      )}
    </div>
  )
}