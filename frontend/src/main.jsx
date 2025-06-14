import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store ,{persister}from "../src/app/store.js";
import { PersistGate } from "redux-persist/integration/react";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor= {persister}>
      <StrictMode>
      <App />
    </StrictMode>
    </PersistGate>
    
  </Provider>
);
