import { Loader2 } from "lucide-react"

export const PageLoader = () => (
  <div className="flex flex-1 items-center justify-center min-h-[300px] w-full">
    <Loader2 className="h-8 w-8 animate-spin text-stone-400" />
  </div>
)
