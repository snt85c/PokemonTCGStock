import { UserAuthContextProvider } from "./LoginComponents/userAuth";
import Navbar from "./LoginComponents/Navbar";
import Searchbar from "./SearchbarComponents/Searchbar";
function App() {
  return (
    <UserAuthContextProvider>
      <Navbar />
      <Searchbar />
    </UserAuthContextProvider>
  );
}

export default App;
