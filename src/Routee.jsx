import React from "react";
import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import Navbar from "./component/Navbar";
import About from "./pages/About";
import Loading from "./component/Loading";
import TALA404Page from "./pages/TALA404Page";

const Routee = () => {
  return (
    <>
      <Loading minMs={700} />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<TALA404Page />} />
      </Routes>
    </>
  );
};

export default Routee;
