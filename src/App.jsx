import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./Components/Home/Home";

import AboutPage from "./Components/AboutPage/AboutPage";
import Products from "./Components/Product/Products";
import ProductDetails from "./Components/Product/ProductDetails";
import Footer from "./Components/Footer/Footer";
import ScrollToTop from "./Components/ScrollToTop/ScrollToTop";

import NavbarComponent from "./Components/NavbarComponent/NavbarComponent";
import ContactUs from "./Components/ContactUs/ContactUs";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <NavbarComponent />
      <Routes>
        {/* Basic Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactUs />} />

        {/* Products list (all + category + subcategory) */}
        <Route path="/products" element={<Products />} />
        <Route path="/products/:categorySlug" element={<Products />} />
        {/* subCategorySlug = subcategory slug (sub.slug || generateSlug(sub.name)) */}
        <Route
          path="/products/:categorySlug/:subCategorySlug"
          element={<Products />}
        />

        {/* Product Details */}
        <Route path="/product/:productId" element={<ProductDetails />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
