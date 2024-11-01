import { Flow } from "@/lib/components/flow";

export default function Home() {
  return (
    <div className="grid grid-cols-4 w-full h-full">
      <div className="col-span-3">
        <Flow />
      </div>
      <div className="col-span-1 border-l border-gray-200 z-10">
        {/* Sidebar content */}
        <h1>Test</h1>
      </div>
    </div>
  );
}
