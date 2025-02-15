import TaxCalculator from "@/components/tax-calculator"
import { FaGithub } from "react-icons/fa";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow p-6">
        <TaxCalculator />
      </main>

      <footer className="text-center p-4 bg-gray-100 mt-6">
        <p className="text-sm flex justify-center items-center gap-2">
          Powered by
          <a
            href="https://github.com/richardags"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline flex items-center gap-1"
          >
            <FaGithub size={16} />
            @richardags
          </a>
        </p>
      </footer>
    </div>
  );
}