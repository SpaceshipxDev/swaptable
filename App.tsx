'use client'

import { useState } from 'react'
import { SpreadsheetEditor } from './components/SpreadsheetEditor'
import { DocumentView } from './components/DocumentView'
import { Navigation } from './components/Navigation'
import { MetadataForm } from './components/MetadataForm'

export interface SpreadsheetRow {
  id: string
  零件图片: string | File | null
  图号: string
  规格: string
  材料: string
  数量: string
  加工方式: string
  工艺要求: string
  备注: string
  单价: string
  总价: string
  采购: boolean
}

export interface Metadata {
  // Company Information (always visible)
  本公司名称: string
  本公司地址: string
  本公司联系人: string
  
  // Sales/General Information
  销售单号: string
  交期: string
  客户名称: string
  联系人: string
  制单人: string
  备注: string
  
  // Purchase Information  
  采购供应商: string
  采购收件地址: string
  采购寄出时间: string
}

export type ViewType = 'edit' | '报价单' | '生产单' | '送货单' | '采购单'

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('edit')
  const [metadata, setMetadata] = useState<Metadata>({
    // Company Information
    本公司名称: '',
    本公司地址: '',
    本公司联系人: '',
    
    // Sales/General Information
    销售单号: '',
    交期: '',
    客户名称: '',
    联系人: '',
    制单人: '',
    备注: '',
    
    // Purchase Information
    采购供应商: '',
    采购收件地址: '',
    采购寄出时间: ''
  })
  
  const [rows, setRows] = useState<SpreadsheetRow[]>([
    {
      id: '1',
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
  ])

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        currentView={currentView} 
        onViewChange={setCurrentView}
      />
      
      <main className="container mx-auto px-6 py-8">
        {currentView === 'edit' ? (
          <div className="space-y-8">
            <MetadataForm 
              metadata={metadata}
              onMetadataChange={setMetadata}
              currentView={currentView}
            />
            <SpreadsheetEditor 
              rows={rows}
              onRowsChange={setRows}
            />
          </div>
        ) : (
          <DocumentView 
            viewType={currentView}
            metadata={metadata}
            rows={rows}
          />
        )}
      </main>
    </div>
  )
}