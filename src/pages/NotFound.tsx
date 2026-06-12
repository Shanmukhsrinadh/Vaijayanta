import { AlertCircle } from 'lucide-react';
import { Link } from 'wouter';

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 w-full max-w-md p-10 text-center">
        <AlertCircle className="h-12 w-12 text-[#800020] mx-auto mb-4" />
        <h1 className="text-3xl font-black text-gray-900 mb-2">404</h1>
        <p className="text-gray-500 mb-6">The page you're looking for doesn't exist.</p>
        <Link href="/" className="inline-block px-6 py-3 bg-[#800020] text-white rounded-full font-bold text-sm hover:bg-[#e8c547] hover:text-[#800020] transition-all">
          Go Home
        </Link>
      </div>
    </div>
  );
}
