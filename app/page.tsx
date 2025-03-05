import Image from "next/image";
import FloatingChat from "./components/FloatingChat";

export default function Home() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Iframe que cubre toda la pantalla */}
      <iframe
        src="https://app.twinteraction.com/augmentour?m=Hn2tN3wZsjk&name=Reference+Tour+2023&at_config=nsAohad8ey&tw_space_id=255"
        className="absolute top-0 left-0 w-full h-full border-0"
        title="Tour Interactivo"
        allow="microphone; camera; accelerometer; gyroscope"
      ></iframe>

      {/* Chatbot flotante */}
      <FloatingChat />
    </div>
  );
}