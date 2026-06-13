import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ArrowRight, Layers, Type, Stamp, FileText, Clock, MoreVertical } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getRecentFiles } from '../lib/storage';
import type { RecentFile } from '../lib/storage';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const [recentFiles, setRecentFiles] = useState<RecentFile[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getRecentFiles().then(files => setRecentFiles(files));
  }, []);
  return (
    <div className="min-h-screen bg-[#121212] text-white selection:bg-blue-500/30">
      <Navbar />
      
      <main className="pt-32 pb-20 px-6 max-w-6xl mx-auto flex flex-col items-center text-center">
        {/* Hero Section */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-8">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          The Future of PDF Editing
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-transparent">
          Edit PDFs with <br/> unparalleled freedom.
        </h1>
        
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
          Experience a beautiful, canvas-based editor that runs entirely offline in your browser. Add text, images, and signatures with absolute freedom.
        </p>
        
        <div className="flex items-center gap-4">
          <Link to="/editor" className="group flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-full font-semibold transition-all">
            Start Editing Free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/tutorial" className="bg-[#242424] hover:bg-[#2a2a2a] border border-white/10 text-white px-8 py-3.5 rounded-full font-semibold transition-all">
            View Tutorial
          </Link>
        </div>

        {/* Recent Files Section */}
        {recentFiles.length > 0 && (
          <div className="mt-20 w-full max-w-4xl text-left">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="w-5 h-5 text-gray-400" />
              <h2 className="text-xl font-bold text-white">Recent Files</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {recentFiles.map(f => (
                <RecentFileCard 
                  key={f.id} 
                  name={f.name} 
                  date={new Date(f.date).toLocaleDateString()} 
                  onClick={() => navigate(`/editor?fileId=${f.id}`)}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-4 text-center">
              *Recent files are securely stored in your browser's local memory (IndexedDB) and never leave your device.
            </p>
          </div>
        )}

        {/* Features Preview */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <FeatureCard 
            icon={<Type className="w-6 h-6 text-blue-400" />}
            title="Text Overlay"
            desc="Add and style text freely anywhere on the page just like a design tool."
          />
          <FeatureCard 
            icon={<Layers className="w-6 h-6 text-purple-400" />}
            title="Layer Management"
            desc="Control the z-index, visibility, and properties of every element."
          />
          <FeatureCard 
            icon={<Stamp className="w-6 h-6 text-emerald-400" />}
            title="Signatures & Stamps"
            desc="Easily import images, sign documents, or stamp them securely."
          />
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="bg-[#1a1a1a] border border-white/5 p-6 rounded-2xl text-left hover:border-white/10 transition-colors">
      <div className="bg-white/5 w-12 h-12 rounded-xl flex items-center justify-center mb-4 border border-white/5">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 leading-relaxed text-sm">{desc}</p>
    </div>
  );
}

function RecentFileCard({ name, date, onClick }: { name: string, date: string, onClick?: () => void }) {
  return (
    <div onClick={onClick} className="group bg-[#1a1a1a] border border-white/5 hover:border-blue-500/30 p-4 rounded-xl flex items-start gap-4 transition-all cursor-pointer">
      <div className="bg-red-500/10 p-2 rounded-lg shrink-0">
        <FileText className="w-6 h-6 text-red-400" />
      </div>
      <div className="flex-1 overflow-hidden">
        <h3 className="text-sm font-semibold text-gray-200 truncate group-hover:text-blue-400 transition-colors">{name}</h3>
        <p className="text-xs text-gray-500 mt-1">{date}</p>
      </div>
      <button className="text-gray-500 hover:text-white p-1 rounded-md hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-all">
        <MoreVertical className="w-4 h-4" />
      </button>
    </div>
  );
}
