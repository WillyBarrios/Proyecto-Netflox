
import Navbar from "./components/Navbar.jsx";
import Series from "./components/Series.jsx";
import './App.css'

function App() {
  return (
    <>
      <Navbar />
      <div className="netflix-clone">
        <Series />
      </div>
    </>
  );
}

export default App;
