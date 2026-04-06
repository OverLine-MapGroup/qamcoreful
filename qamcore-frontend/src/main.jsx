import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

async function prepare() {
  // Запускаем моки только если включён флаг
  // Включить: localStorage.setItem('msw', 'true') + перезагрузить
  // Выключить: localStorage.removeItem('msw') + перезагрузить
  if (localStorage.getItem("msw") === "true") {
    const { worker } = await import("./mocks/browser");
    await worker.start({
      onUnhandledRequest: "bypass", // не перехваченные запросы идут на реальный бэк
    });
    console.log("[MSW] Mock server enabled 🟢");
  }
}

prepare().then(() => {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
});