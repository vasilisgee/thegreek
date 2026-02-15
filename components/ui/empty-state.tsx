import * as React from "react"

import { cn } from "@/lib/utils"

type EmptyStateProps = React.HTMLAttributes<HTMLDivElement> & {
  title: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
}

function EmptyState({
  title,
  description,
  icon,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[260px] flex-col items-center justify-center rounded-xl border border-dashed bg-muted/30 px-6 py-10 text-center",
        className,
      )}
      {...props}
    >
      {icon ? (
        <div className="flex items-center justify-center ">
          {icon}
        </div>
      ) : null}
      <h3 className="mt-4 text-sm font-semibold">{title}</h3>
      {description ? (
        <p className="mt-2 text-xs text-muted-foreground">{description}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
}

export { EmptyState }
