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
