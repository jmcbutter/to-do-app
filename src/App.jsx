import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.scss";
import { SunIcon } from "./assets/images/icons";
import DesktopImg from "/src/assets/images/bg-desktop-dark.jpg";

function App() {
  const [count, setCount] = useState(0);
  const [theme, setTheme] = useState("light");

  return <div className={`App theme--${theme}`}>A</div>;
}

export default App;
