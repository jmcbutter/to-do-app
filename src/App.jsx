import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.scss";
import { SunIcon, MoonIcon, CrossIcon, CheckIcon } from "./assets/images/icons";
import DesktopImg from "/src/assets/images/bg-desktop-dark.jpg";

function App() {
  const [count, setCount] = useState(0);
  const [theme, setTheme] = useState("light");

  return (
    <div className={`App theme--${theme}`}>
      <div className="Content">
        <div className="Heading">
          <h1>TODO</h1>
          {theme == "light" ? (
            <SunIcon
              className="Heading__theme-switch"
              onClick={() => setTheme("dark")}
            />
          ) : (
            <MoonIcon
              className="Heading__theme-switch"
              onClick={() => setTheme("light")}
            />
          )}
        </div>
        <Task />
      </div>
    </div>
  );
}

function Task(props) {
  const [checked, setChecked] = useState(false);

  return (
    <div className="Task">
      <div
        className={`Task__Checkbox ${checked ? "Task__Checkbox--Checked" : ""}`}
        onClick={() => (checked ? setChecked(false) : setChecked(true))}
      >
        {checked ? <CheckIcon /> : null}
      </div>
      <input
        type="text"
        className={`Task__Input ${checked ? "Task__Input--Checked" : ""}`}
      />
      <CrossIcon className="Task__Remove" />
    </div>
  );
}

export default App;
