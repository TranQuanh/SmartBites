import Navbar from "./components/Navbar/Navbar";
import HeroSection from "./components/HeroSection/HeroSection";
function App() {
  return (
    <div className = "App">
      <div >
        <Navbar />
      </div>
      <div className="container main">
        <HeroSection/>
      </div>
    </div>
  );
}

export default App;
