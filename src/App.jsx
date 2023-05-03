import Hero from "./components/Hero";
import Demo from "./components/Demo";
import './App.css';

function App() {
  return (
    <main className=" p-2">
    <div className="main">
      <div className="gradient" />

      </div>
      <div className="relative z-10 flex justify-center items-center flex-col max-w-7xl mx-auto sm:px-16 px-6">
       <Hero />
       <Demo />
    {/* bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 */}
     
    </div>
 </main>
  );
}

export default App;