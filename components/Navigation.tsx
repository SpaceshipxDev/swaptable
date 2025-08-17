'use client'

import { ViewType } from '@/lib/types'

interface NavigationProps {
  currentView: ViewType
  onViewChange: (view: ViewType) => void
}

export function Navigation({ currentView, onViewChange }: NavigationProps) {
  const views: { key: ViewType; label: string }[] = [
    { key: 'edit', label: '编辑' },
    { key: '报价单', label: '报价单' },
    { key: '生产单', label: '生产单' },
    { key: '送货单', label: '送货单' },
    { key: '采购单', label: '采购单' }
  ]

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-1">
            <div className="text-lg tracking-tight text-foreground">工程管理系统</div>
          </div>
          
          <div className="flex items-center space-x-1 rounded-lg bg-muted/50 p-1">
            {views.map((view) => (
              <button
                key={view.key}
                onClick={() => onViewChange(view.key)}
                className={`
                  relative px-4 py-2 text-sm transition-all duration-200 ease-out rounded-md
                  ${currentView === view.key 
                    ? 'bg-background text-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                  }
                `}
              >
                {view.label}
              </button>
            ))}
          </div>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => window.print()}
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              打印
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}