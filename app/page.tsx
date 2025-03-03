import Image from "next/image";

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
        <h1 className="text-4xl font-bold mb-4">Welcome to MyApp</h1>
        <p className="text-lg mb-8 text-gray-900">The best platform to manage your projects efficiently.</p>
        <div className="flex gap-4">
          <a
            href="/signup"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Get Started
          </a>
          <a
            href="/learn-more"
            className="bg-gray-200 text-gray-900 px-4 py-2 rounded hover:bg-gray-300"
          >
            Learn More
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white p-4 flex justify-center">
        <p>&copy; 2025 MyApp. All rights reserved.</p>
      </footer>
    </div>
  );
}
