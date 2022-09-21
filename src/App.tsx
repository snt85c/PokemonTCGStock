import { UserAuthContextProvider } from "./LoginComponents/userAuth";
import Navbar from "./LoginComponents/Navbar";
import Search from "./SearchbarComponents/Search";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Deck from "./SearchbarComponents/Deck";
import Menu from "./Menu";
import Home from "./HomeComponents/Home";
import Collection from "./CollectionComponent/Collection";
function App() {
  return (
    <BrowserRouter>
      <UserAuthContextProvider>
        
        <Routes>
        <Route path="/search" element={<Search />} />
          <Route path="/" element={<Home />} />
          <Route path="/user" element={<Navbar />} />
          <Route path="/collection" element={<Collection />} />

        </Routes>
        <Menu />
      </UserAuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
