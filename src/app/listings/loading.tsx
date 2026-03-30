export default function Loading() {
  return (
    <div className="min-h-screen mt-20 bg-gray-50 py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-6 animate-pulse">
          <aside className="hidden lg:block w-72 shrink-0 bg-gray-200 h-[600px] rounded-xl" />
          <main className="flex-1 space-y-6">
            <div className="h-12 bg-gray-200 rounded-xl" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 bg-gray-200 rounded-xl" />
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}