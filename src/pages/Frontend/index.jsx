import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Header from "./Components/Header";
import Footer from "./Components/Footer/Footer";
import About from "./About";
import Contact from "./Contact";
import Todos from "./Todos";
export default function index() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/">
            <Route path="home" element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="todos" element={<Todos />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </>
  );
}
