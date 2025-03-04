import Image from "next/image";
import DeepChatClient from "./DeepChatClient";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="bg-white text-black p-4 flex justify-between items-center border-b border-gray-300">
        <div className="flex items-center gap-4">
          <Image src="/logo.png" alt="Logo" width={400} height={40} />
          <span className="text-xl font-bold">Twinteraction ChatBot</span>
        </div>
        <nav className="flex gap-4">
          <a href="#features" className="hover:underline">Features</a>
          <a href="#pricing" className="hover:underline">Pricing</a>
          <a href="#docs" className="hover:underline">Docs</a>
          <a href="#contact" className="hover:underline">Contact</a>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center text-center p-8 text-black">
        <div className="flex gap-4">
          {/* Aquí puedes agregar más contenido */}
        </div>
        {/* Deep Chat */}
        <DeepChatClient />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white p-4 flex justify-center">
        <p>&copy; 2025 MyApp. All rights reserved.</p>
      </footer>
    </div>
  );
}