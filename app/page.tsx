import Image from "next/image";
import DeepChatClient from "./DeepChatClient";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}


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