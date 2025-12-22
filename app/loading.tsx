export default function Loading() {
  return (
    <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    </div>
  )
}


