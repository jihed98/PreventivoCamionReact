import { createRoot } from "react-dom/client";
import AuthApp from "./AuthApp";
import "./index.css";

// Create a root element and render the app
createRoot(document.getElementById("root")!).render(<AuthApp />);