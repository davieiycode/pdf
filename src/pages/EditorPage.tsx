import { useState, useRef } from 'react';
import { 
  Menu, MousePointer2, Type, Image as ImageIcon, 
  PenTool, Download, Upload, ZoomIn, ZoomOut, 
  AlignLeft, AlignCenter, AlignRight, Settings,
  ChevronLeft, ChevronRight, ArrowLeft
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import { saveRecentFile, getFileById } from '../lib/storage';
import { useEffect } from 'react';
import ThumbnailSidebar from '../components/ThumbnailSidebar';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up PDF.js worker for Vite
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

function EditorPage() {
  const [activeTool, setActiveTool] = useState('select');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [pageOrder, setPageOrder] = useState<number[]>([]);
  const [scale, setScale] = useState<number>(1.0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fileId = searchParams.get('fileId');
    if (fileId) {
      getFileById(fileId).then(file => {
        if (file) {
          setPdfFile(file);
          setCurrentPageIndex(0);
        }
      });
    }
  }, [searchParams]);

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPdfFile(file);
      setCurrentPageIndex(0);
      await saveRecentFile(file);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageOrder(Array.from({ length: numPages }, (_, i) => i + 1));
    setCurrentPageIndex(0);
  };

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.1, 3.0));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.5));

  return (
    <div className="flex flex-col h-screen bg-[#1e1e1e] text-white font-sans overflow-hidden">
      {/* Top Navbar */}
      <header className="h-14 border-b border-[#333] flex items-center justify-between px-4 bg-[#2c2c2c] shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-1.5 hover:bg-[#444] rounded transition-colors group">
            <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-white" />
          </Link>
          <div className="w-px h-4 bg-[#444]"></div>
          <h1 className="text-sm font-semibold tracking-wide truncate max-w-[200px]">
            {pdfFile ? pdfFile.name : 'Untitled PDF.pdf'}
          </h1>
        </div>
        
        {/* Toolbar Center */}
        <div className="flex items-center gap-1 bg-[#1e1e1e] p-1 rounded-md border border-[#333]">
          <ToolButton 
            icon={<MousePointer2 className="w-4 h-4" />} 
            active={activeTool === 'select'} 
            onClick={() => setActiveTool('select')} 
            tooltip="Select (V)" 
          />
          <ToolButton 
            icon={<Type className="w-4 h-4" />} 
            active={activeTool === 'text'} 
            onClick={() => setActiveTool('text')} 
            tooltip="Text (T)" 
          />
          <ToolButton 
            icon={<ImageIcon className="w-4 h-4" />} 
            active={activeTool === 'image'} 
            onClick={() => setActiveTool('image')} 
            tooltip="Image" 
          />
          <ToolButton 
            icon={<PenTool className="w-4 h-4" />} 
            active={activeTool === 'draw'} 
            onClick={() => setActiveTool('draw')} 
            tooltip="Draw" 
          />
        </div>

        {/* Top Right */}
        <div className="flex items-center gap-3">
          <input 
            type="file" 
            accept="application/pdf" 
            className="hidden" 
            ref={fileInputRef}
            onChange={onFileChange}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 bg-[#000000] hover:bg-[#333] border border-[#444] text-xs px-3 py-1.5 rounded-md transition-colors"
          >
            <Upload className="w-4 h-4" />
            Open
          </button>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-xs font-semibold px-3 py-1.5 rounded-md transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Sidebar - Pages/Layers */}
        <ThumbnailSidebar 
          pdfFile={pdfFile}
          numPages={numPages}
          currentPageIndex={currentPageIndex}
          onPageSelect={setCurrentPageIndex}
          pageOrder={pageOrder}
          onReorder={setPageOrder}
        />

        {/* Center Canvas Area */}
        <main className="flex-1 bg-[#1e1e1e] relative flex flex-col items-center overflow-auto p-8">
          
          {/* Controls floating */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#2c2c2c] border border-[#333] rounded-md flex items-center p-1 z-10 shadow-lg">
             <button 
               onClick={() => setCurrentPageIndex(p => Math.max(p - 1, 0))}
               disabled={currentPageIndex <= 0}
               className="p-1.5 hover:bg-[#444] rounded text-gray-400 hover:text-white transition-colors disabled:opacity-50"
             >
               <ChevronLeft className="w-4 h-4" />
             </button>
             <span className="text-xs font-mono w-20 text-center text-gray-300">
               {currentPageIndex + 1} / {numPages || 1}
             </span>
             <button 
               onClick={() => setCurrentPageIndex(p => Math.min(p + 1, (numPages || 1) - 1))}
               disabled={currentPageIndex >= numPages - 1}
               className="p-1.5 hover:bg-[#444] rounded text-gray-400 hover:text-white transition-colors disabled:opacity-50"
             >
               <ChevronRight className="w-4 h-4" />
             </button>

             <div className="w-px h-4 bg-[#444] mx-2"></div>

             <button onClick={handleZoomOut} className="p-1.5 hover:bg-[#444] rounded text-gray-400 hover:text-white transition-colors">
               <ZoomOut className="w-4 h-4" />
             </button>
             <span className="text-xs font-mono w-12 text-center text-gray-300">{Math.round(scale * 100)}%</span>
             <button onClick={handleZoomIn} className="p-1.5 hover:bg-[#444] rounded text-gray-400 hover:text-white transition-colors">
               <ZoomIn className="w-4 h-4" />
             </button>
          </div>

          {/* PDF Canvas */}
          <div className="mt-12 bg-white shadow-2xl rounded-sm shrink-0 flex items-center justify-center border border-gray-200 min-h-[500px] min-w-[400px]">
             {pdfFile ? (
               <Document
                 file={pdfFile}
                 onLoadSuccess={onDocumentLoadSuccess}
                 className="flex flex-col items-center"
               >
                 <Page 
                   key={`page-${pageOrder[currentPageIndex]}`}
                   pageNumber={pageOrder[currentPageIndex]} 
                   scale={scale} 
                   className="shadow-md"
                 />
               </Document>
             ) : (
               <div className="text-gray-400 text-sm flex flex-col items-center gap-4">
                 <p>Upload a PDF to start editing</p>
                 <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-md transition-colors"
                  >
                    Select PDF File
                  </button>
               </div>
             )}
          </div>
        </main>

        {/* Right Sidebar - Properties */}
        <aside className="w-72 border-l border-[#333] bg-[#252525] flex flex-col shrink-0">
          <div className="h-10 flex items-center justify-between px-4 border-b border-[#333] text-xs font-medium text-gray-400">
            Properties
            <Settings className="w-3.5 h-3.5" />
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Same properties panel as before */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Text</h3>
              
              <div className="grid grid-cols-2 gap-2">
                <select className="col-span-2 bg-[#1e1e1e] border border-[#333] text-sm rounded px-2 py-1.5 text-white outline-none focus:border-blue-500">
                  <option>Inter</option>
                  <option>Roboto</option>
                  <option>Arial</option>
                  <option>Times New Roman</option>
                </select>
                
                <div className="flex items-center bg-[#1e1e1e] border border-[#333] rounded px-2 py-1.5">
                  <span className="text-xs text-gray-500 w-4">W</span>
                  <input type="number" defaultValue="400" className="bg-transparent text-sm w-full outline-none text-right" />
                </div>
                
                <div className="flex items-center bg-[#1e1e1e] border border-[#333] rounded px-2 py-1.5">
                  <span className="text-xs text-gray-500 w-4">S</span>
                  <input type="number" defaultValue="14" className="bg-transparent text-sm w-full outline-none text-right" />
                </div>
              </div>

              <div className="flex gap-1 bg-[#1e1e1e] border border-[#333] rounded p-1">
                <button className="flex-1 p-1 hover:bg-[#333] rounded flex items-center justify-center text-gray-400 bg-[#333] text-white">
                  <AlignLeft className="w-4 h-4" />
                </button>
                <button className="flex-1 p-1 hover:bg-[#333] rounded flex items-center justify-center text-gray-400">
                  <AlignCenter className="w-4 h-4" />
                </button>
                <button className="flex-1 p-1 hover:bg-[#333] rounded flex items-center justify-center text-gray-400">
                  <AlignRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Fill</h3>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded border border-[#444] bg-black cursor-pointer"></div>
                <span className="text-sm font-mono text-gray-300">#000000</span>
                <span className="text-sm text-gray-500 ml-auto">100%</span>
              </div>
            </div>

          </div>
        </aside>

      </div>
    </div>
  );
}

function ToolButton({ icon, active, onClick, tooltip }: any) {
  return (
    <button 
      title={tooltip}
      onClick={onClick}
      className={`p-2 rounded transition-colors ${
        active 
          ? 'bg-blue-600/20 text-blue-400' 
          : 'text-gray-400 hover:text-white hover:bg-[#333]'
      }`}
    >
      {icon}
    </button>
  );
}

export default EditorPage;
