export default function Loading() {
  return (
    <main className="flex flex-1 flex-col gap-6 px-6 py-16">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="h-32 border-2 border-black bg-[#EFEEEA]"
          aria-hidden="true"
        />
      ))}
    </main>
  );
}
