import { Route, Routes } from "react-router-dom";
import SuggestedProduction from "./pages/SuggestedProduction";
import { RegisterProduct } from "./pages/RegisterProduct";
import { RegisterRawMaterial } from "./pages/RegisterMaterial";

function App() {
  return (
    <>
      <Routes>
        <Route path="/register/products" element={<RegisterProduct />} />
        <Route path="/suggestion" element={<SuggestedProduction />} />
        <Route path="/register/material" element= {<RegisterRawMaterial/>}/>
      </Routes>
    </>
  );
}

export default App;
