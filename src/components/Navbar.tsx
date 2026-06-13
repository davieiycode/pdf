import { Link } from 'react-router-dom';
import { PenTool } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 border-b border-white/10 bg-[#121212]/80 backdrop-blur-md z-50 px-6 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2 group">
        <div className="bg-blue-600 p-1.5 rounded-lg group-hover:bg-blue-500 transition-colors">
          <PenTool className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-white tracking-wide">Space PDF</span>
      </Link>
      <div className="flex items-center gap-6 text-sm font-medium">
        <Link to="/tutorial" className="text-gray-300 hover:text-white transition-colors">Tutorial</Link>
        <Link to="/about" className="text-gray-300 hover:text-white transition-colors">About</Link>
        <Link to="/editor" className="bg-white text-black px-4 py-2 rounded-full hover:bg-gray-200 transition-colors font-semibold">
          Open Editor
        </Link>
      </div>
    </nav>
  );
}
