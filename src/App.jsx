import { useEffect, useState } from "react";
import "./App.scss";
import { SunIcon, MoonIcon, CrossIcon, CheckIcon } from "./assets/images/icons";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [theme, setTheme] = useState("light");
  const [tasks, setTasks] = useState(
    localStorage.getItem("tasks")
      ? JSON.parse(localStorage.getItem("tasks"))
      : []
  );
  const [filter, setFilter] = useState("All");
  const [displayedTasks, setDisplayedTasks] = useState(tasks);
  const [dragging, setDragging] = useState();

  console.log(localStorage.getItem("Tasks"));

  useEffect(() => {
    let root = document.documentElement;
    root.classList.remove("theme--light", "theme--dark");
    root.classList.add(`theme--${theme}`);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  function toggleTaskCompleted(id) {
    const editedTasks = tasks.map((task) => {
      if (id === task.id) {
        return task.completed
          ? { ...task, completed: false }
          : { ...task, completed: true };
      }
      return task;
    });

    setTasks(editedTasks);
  }

  function deleteTask(id) {
    const editedTasks = tasks.filter((task) => task.id != id);
    setTasks(editedTasks);
  }

  function editTask(id, newName) {
    const editedTasks = tasks.map((task) => {
      if (id === task.id) {
        return { ...task, name: newName };
      }
      return task;
    });

    setTasks(editedTasks);
  }

  function filterTasks(filter) {
    const filteredTasks = tasks.filter((task) => {
      if (filter == "All") return true;
      if (filter == "Active" && !task.completed) return true;
      if (filter == "Completed" && task.completed) return true;
      return false;
    });

    setDisplayedTasks(filteredTasks);
  }

  useEffect(() => filterTasks(filter), [filter, tasks]);

  function clearCompleted() {
    const editedTasks = tasks.filter((task) => !task.completed);
    setTasks(editedTasks);
  }

  function reorderTask(positionRelativeToSibling, siblingId) {
    const taskIndex = tasks.findIndex((task) => task.id == dragging);
    const taskToInsert = tasks[taskIndex];
    const editedTasks = tasks.filter((task) => task.id != dragging);
    const siblingIndex = editedTasks.findIndex((task) => task.id == siblingId);

    if (positionRelativeToSibling == "above") {
      editedTasks.splice(siblingIndex, 0, taskToInsert);
    } else {
      editedTasks.splice(siblingIndex + 1, 0, taskToInsert);
    }

    setTasks(editedTasks);
  }

  function dragTask(id) {
    setDragging(id);
  }

  return (
    <div className={`App`}>
      <div className="content">
        <div className="heading">
          <h1>TODO</h1>
          {theme == "dark" ? (
            <SunIcon
              className="heading__theme-switch"
              onClick={() => setTheme("light")}
            />
          ) : (
            <MoonIcon
              className="heading__theme-switch"
              onClick={() => setTheme("dark")}
            />
          )}
        </div>

        <div className="task-input">
          <TaskInput tasks={tasks} setTasks={setTasks} />
        </div>

        <div className="tasks">
          {displayedTasks.map((task) => (
            <Task
              id={task.id}
              name={task.name}
              completed={task.completed}
              key={task.id}
              toggleTaskCompleted={toggleTaskCompleted}
              deleteTask={deleteTask}
              editTask={editTask}
              draggable="true"
              reorderTask={reorderTask}
              dragTask={dragTask}
            />
          ))}

          <div className="task-info card">
            <div className="task-info__remaining">
              {tasks.filter((task) => !task.completed).length} Tasks Remaining
            </div>
            <div className="task-info__filters">
              <ul className="filters">
                <li
                  className={`filters__filter ${
                    filter == "All" ? "filters__filter--active" : ""
                  }`}
                  onClick={() => setFilter("All")}
                >
                  All
                </li>
                <li
                  className={`filters__filter ${
                    filter == "Active" ? "filters__filter--active" : ""
                  }`}
                  onClick={() => setFilter("Active")}
                >
                  Active
                </li>
                <li
                  className={`filters__filter ${
                    filter == "Completed" ? "filters__filter--active" : ""
                  }`}
                  onClick={() => setFilter("Completed")}
                >
                  Completed
                </li>
              </ul>
            </div>
            <div
              className="task-info__clear-completed"
              onClick={clearCompleted}
            >
              Clear Completed
            </div>
          </div>

          <div className="reorder-note">Drag and drop to reorder list</div>
        </div>
      </div>
    </div>
  );
}

function Task({
  id,
  name,
  completed,
  toggleTaskCompleted,
  deleteTask,
  editTask,
  reorderTask,
  dragTask,
  ...restProps
}) {
  const [activeTopDrop, setActiveTopDrop] = useState(false);
  const [activeBottomDrop, setActiveBottomDrop] = useState(false);

  function onNameChange(e) {
    editTask(id, e.target.value);
  }

  function onRemoveClick() {
    deleteTask(id);
  }

  function onCheckboxClick() {
    toggleTaskCompleted(id);
  }

  function onDragStart(e) {
    dragTask(id);
  }

  function onDragEnterTop(e) {
    e.preventDefault();
    setActiveTopDrop(true);
  }

  function onDragLeaveTop(e) {
    e.preventDefault();
    setActiveTopDrop(false);
  }

  function onDragEnterBottom(e) {
    e.preventDefault();
    setActiveBottomDrop(true);
  }

  function onDragLeaveBottom(e) {
    e.preventDefault();
    setActiveBottomDrop(false);
  }

  function onDropAbove(e) {
    e.preventDefault();
    reorderTask("above", id);
    setActiveBottomDrop(false);
    setActiveTopDrop(false);
  }

  function onDropBelow(e) {
    e.preventDefault();
    reorderTask("below", id);
    setActiveBottomDrop(false);
    setActiveTopDrop(false);
  }

  return (
    <div
      {...restProps}
      className={`task task--entered card card--shadowed ${
        activeTopDrop
          ? "card--active-drop-top"
          : activeBottomDrop
          ? "card--active-drop-bottom"
          : ""
      }`}
      onDragStart={onDragStart}
    >
      <div
        className="dropzone dropzone--top"
        onDragEnter={onDragEnterTop}
        onDragOver={(e) => e.preventDefault()}
        onTouchMove={(e) => e.preventDefault()}
        onDragLeave={onDragLeaveTop}
        onDrop={onDropAbove}
      />
      <div
        className={`checkbox checkbox--clickable ${
          completed ? "checkbox--checked" : ""
        }`}
        onClick={onCheckboxClick}
      >
        {completed ? <CheckIcon /> : null}
      </div>
      <input
        type="text"
        className={`task__input ${completed ? "task__input--checked" : ""}`}
        value={name}
        onChange={onNameChange}
      />
      <CrossIcon className="task__remove" onClick={onRemoveClick} />
      <div
        className="dropzone dropzone--bottom"
        onDragEnter={onDragEnterBottom}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={onDragLeaveBottom}
        onDrop={onDropBelow}
      />
    </div>
  );
}

function TaskInput({ tasks, setTasks }) {
  function onKeyDown(e) {
    if (e.key === "Enter") {
      const newTask = {
        id: uuidv4(),
        name: e.target.value,
      };
      setTasks([...tasks, newTask]);
      e.target.value = "";
    }
  }

  return (
    <div className="task card">
      <div className={`checkbox`}></div>
      <input
        type="text"
        className={`task__input`}
        onKeyDown={onKeyDown}
        placeholder="Create a new todo"
      />
    </div>
  );
}

export default App;
