import Navbar from '../components/Navbar';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#121212] text-white selection:bg-blue-500/30">
      <Navbar />
      
      <main className="pt-32 pb-20 px-6 max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 text-white">About Space PDF</h1>
        
        <div className="prose prose-invert prose-blue max-w-none">
          <p className="text-xl text-gray-300 leading-relaxed mb-8">
            Space PDF is born out of the frustration with traditional PDF editors that feel clunky, outdated, and often require expensive subscriptions or upload your sensitive documents to the cloud.
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">Privacy First</h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            We believe your documents should stay yours. That's why Space PDF is built entirely on client-side technologies. When you open a PDF, it never leaves your device. All rendering and editing happens right in your browser's memory.
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">Design-Driven Editing</h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            By taking inspiration from modern design tools, we've created a canvas-based approach to PDF editing. You have absolute freedom to place text, images, and shapes exactly where you want them, without fighting rigid document structures.
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">Offline Capable</h2>
          <p className="text-gray-400 leading-relaxed">
            As a Progressive Web App (PWA), you can install Space PDF on your device and use it even when you don't have an internet connection. It's the perfect companion for working on the go.
          </p>
        </div>
      </main>
    </div>
  );
}
