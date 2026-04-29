import Dashboard from "./components/Dashboard";
import bgImage from "./assets/bg.jpg"; // make sure path is correct

function App() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 🌌 FULLSCREEN BACKGROUND IMAGE */}
      <div
        className="fixed inset-0 -z-20 bg-cover bg-center"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      />

      {/* 🌑 DARK OVERLAY FOR READABILITY */}
      <div className="fixed inset-0 -z-10 bg-black/60 backdrop-blur-[2px]" />

      {/* 🚀 MAIN APP */}
      <Dashboard />
    </div>
  );
}

export default App;
