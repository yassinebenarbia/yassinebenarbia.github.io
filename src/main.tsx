import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import GitProfile from "./components/gitprofile.tsx";
import BlogList from "./components/blog-list.tsx";
import BlogPage from "./components/blog.tsx";
import App from "./App.tsx";
import "./assets/index.css";


// import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HashRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import CONFIG from "../gitprofile.config";

const Root = () => {
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme
      ? storedTheme
      : CONFIG.themeConfig?.defaultTheme || "light";
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <React.StrictMode>
      <HashRouter>
        <ThemeProvider value={{ theme, setTheme }}>
          <Routes>
            <Route path="/" element={<App config={CONFIG} />}>
              <Route path="" element={<GitProfile config={CONFIG} />} />
              <Route path="blogs" element={<BlogList config={CONFIG} />} />
              <Route
                path="blogs/:BlogName"
                element={<BlogPage config={CONFIG} />}
              />
            </Route>
          </Routes>
        </ThemeProvider>
      </HashRouter>
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(<Root />);