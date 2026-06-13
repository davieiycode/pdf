import Navbar from '../components/Navbar';
import { Type, ImageIcon, MousePointer2 } from 'lucide-react';

export default function TutorialPage() {
  return (
    <div className="min-h-screen bg-[#121212] text-white selection:bg-blue-500/30">
      <Navbar />
      
      <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-4 text-white">Tutorial</h1>
        <p className="text-gray-400 text-lg mb-12">Learn how to master Space PDF in minutes.</p>

        <div className="space-y-12">
          {/* Step 1 */}
          <section className="flex gap-6 items-start">
            <div className="bg-[#1a1a1a] border border-white/10 w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
              <span className="font-bold text-blue-400">1</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Upload your PDF</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                Click the "Open" button in the top right corner of the editor to select a PDF file from your computer. The file is processed locally and never leaves your browser.
              </p>
            </div>
          </section>

          {/* Step 2 */}
          <section className="flex gap-6 items-start">
            <div className="bg-[#1a1a1a] border border-white/10 w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
              <span className="font-bold text-blue-400">2</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Add Text & Shapes</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                Use the top toolbar to select the <Type className="inline w-4 h-4 mx-1" /> text tool. Click anywhere on the canvas to add a text box. You can change the font, size, and color in the Properties panel on the right.
              </p>
            </div>
          </section>

          {/* Step 3 */}
          <section className="flex gap-6 items-start">
            <div className="bg-[#1a1a1a] border border-white/10 w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
              <span className="font-bold text-blue-400">3</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Insert Signatures & Images</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                Click the <ImageIcon className="inline w-4 h-4 mx-1" /> image tool to upload a transparent PNG of your signature or a company stamp. You can use the <MousePointer2 className="inline w-4 h-4 mx-1" /> select tool to move and resize it freely.
              </p>
            </div>
          </section>

          {/* Step 4 */}
          <section className="flex gap-6 items-start">
            <div className="bg-[#1a1a1a] border border-white/10 w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
              <span className="font-bold text-blue-400">4</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Export your Document</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                Once you are done, click "Export" to burn your changes into the PDF. A new file will be downloaded to your computer automatically.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
