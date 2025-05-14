const taskTextInput = document.querySelector(".tasktestInput");
const taskdateInput = document.querySelector(".taskdateInput");
const taskaddButton = document.querySelector(".addButton");
const tasksContainer = document.querySelector(".tasksContainer");
const taskdeleteButton = document.querySelector(".deleteBtn");
const taskCategoryBtn = document.querySelectorAll(".categoryBtn");
let selectedTaskElement;
let taskActionsBtn = document.querySelectorAll(".actionBtn");
let counter;
let taskListData = [];

const toggleNoTaskMessage = (view) => {
  const Element = document.querySelector(".notTaskAlert");
  if (view) {
    setTimeout(() => {
      Element.classList.add("d-flex");
      Element.classList.remove("d-none");
      Element.classList.add("animation-fadeinTop");
    }, 500);
  } else {
    setTimeout(() => {
      Element.classList.add("animation-fadeoutTop");
      Element.classList.remove("d-flex");
      Element.classList.add("d-none");
    }, 500);
  }
};

const renderTask = (taskText, taskDate, status, storageData) => {
  const newtaskEl = document.createElement("ul");
  newtaskEl.className = "d-flex taskcon";
  for (let i = 1; i <= 4; i++) {
    const ele = document.createElement("li");
    newtaskEl.appendChild(ele);
  }
  newtaskEl.children[0].innerText = taskText;
  if (taskDate.length > 1) {
    newtaskEl.children[1].innerText = taskDate;
  } else {
    newtaskEl.children[1].innerText = "No date";
  }
  newtaskEl.children[2].innerText = status;

  const newtaskActionsConEl = document.createElement("ul");
  newtaskActionsConEl.className =
    "d-flex buttom_tascon justify-content-center gap-3 align-items-center";
  const newtaskActionsValue = ["Edit", "Do", "Delete"];
  const newtaskActionsClasses = ["btn-warning", "btn-success", "btn-danger"];
  newtaskActionsValue.forEach((value, index) => {
    const newtaskActionsEl = document.createElement("li");
    newtaskActionsEl.classList = `btn ${newtaskActionsClasses[index]} actionBtn`;
    newtaskActionsEl.dataset.actions = value;
    newtaskActionsEl.innerText = value;
    newtaskActionsConEl.appendChild(newtaskActionsEl);
  });
  newtaskEl.children[3].appendChild(newtaskActionsConEl);

  tasksContainer.appendChild(newtaskEl);
  if (tasksContainer.length < 1) {
    toggleNoTaskMessage();
  }
  let newtaskDate;
  if (taskDate.length < 1) {
    newtaskDate = "No date";
  } else {
    newtaskDate = taskDate;
  }

  if (!storageData) {
    taskListData.push({
      taskText: taskText,
      taskDate: newtaskDate,
      taskStatus: status,
    });
    localStorage.setItem("Tasks", JSON.stringify(taskListData));
  }

  taskdateInput.value = "";
  taskTextInput.value = "";
};

const handleTaskAdd = (event) => {
  const taskText = taskTextInput.value;
  const taskDate = taskdateInput.value;
  const alert = document.querySelector(".alert");

  const newTaskF = () => {
    if (taskText.length >= 1) {
      renderTask(taskText, taskDate, "Pending");
      alert.innerText = "Todo added successfully!";
      alert.classList.replace("alert-danger", "alert-success");
      toggleNoTaskMessage(false);
    } else {
      alert.innerText = "Please enter a todo";
      alert.classList.replace("alert-success", "alert-danger");
    }
    alert.classList.toggle("d-none");
    alert.classList.add("animation-fadeinTop");

    setTimeout(() => {
      alert.classList.replace("animation-fadeinTop", "animation-fadeoutTop");
      setTimeout(() => {
        alert.classList.toggle("d-none");
      }, 500);
    }, 650);
  };

  const editTask = () => {
    const [taskTextEdit, taskDateEdit, taskStatus] =
      selectedTaskElement.children;
    if (taskText.length >= 1) {
      taskaddButton.innerText = "Add";
      taskTextEdit.innerText = taskText;
      if (taskDate.length > 1) {
        taskDateEdit.innerText = taskDate;
      }
      const parent = selectedTaskElement.parentElement;
      const ChildsArr = Array.from(parent.children);
      const index = ChildsArr.indexOf(selectedTaskElement);

        let TasksData = JSON.parse(localStorage.getItem("Tasks"));
        let taskCurrent;
        taskCurrent == undefined ? taskCurrent =TasksData[index - 1] : taskCurrent =TasksData[index]
        if(taskCurrent != undefined){
          taskCurrent.taskText = taskText;
          taskCurrent.taskStatus = taskStatus.innerText;
        }
        if (taskDate.length > 1) {
          taskCurrent.taskDate = taskDate;
        }
        TasksData[index] = taskCurrent;
        localStorage.setItem("Tasks", JSON.stringify(TasksData));
      alert.innerText = "Todo edited successfully!";
      alert.classList.replace("alert-danger", "alert-success");
      taskTextInput.value = "";
      taskdateInput.value = "";
    } else {
      alert.innerText = "Please enter a todo";
      alert.classList.replace("alert-success", "alert-danger");
    }
    alert.classList.toggle("d-none");
    alert.classList.add("animation-fadeinTop");

    setTimeout(() => {
      alert.classList.replace("animation-fadeinTop", "animation-fadeoutTop");
      setTimeout(() => {
        alert.classList.toggle("d-none");
      }, 500);
    }, 650);
  };

  taskaddButton.innerText == "Add" ? newTaskF() : editTask();
};

const handleTaskAction = (event) => {
  const action = event.target.dataset.actions;
  const task = event.target.parentElement.parentElement.parentElement;
  selectedTaskElement = task;
  if (action == "Edit") {
    const [taskText, taskDate] = task.children;
    taskaddButton.innerText = "Edit";
    taskTextInput.value = taskText.innerText;
    if (taskDate.innerText != "No date") {
      taskdateInput.value = taskDate.innerText;
    }
  } else if (action == "Do") {
    const parent = task.parentElement;
    const ChildsArr = Array.from(parent.children);
    const index = ChildsArr.indexOf(task);
    let TasksData = JSON.parse(localStorage.getItem("Tasks"));
    let taskCurrent = TasksData[index - 1];
    task.children[2].innerText == "Pending"
      ? ((task.children[2].innerText = "Complated"),
        (taskCurrent.taskStatus = "Complated"))
      : ((task.children[2].innerText = "Pending"),
        (taskCurrent.taskStatus = "Pending"));

    TasksData[index - 1] = taskCurrent;
    localStorage.setItem("Tasks", JSON.stringify(TasksData));

    event.target.innerText == "Do"
      ? (event.target.innerText = "Undo")
      : (event.target.innerText = "Do");
  } else {
    task.classList.add("animation-fadeoutTop");
    const parent = task.parentElement;
    const ChildsArr = Array.from(parent.children);
    const index = ChildsArr.indexOf(task) - 1;
    setTimeout(() => {
      let TasksData = JSON.parse(localStorage.getItem("Tasks"));
      TasksData.splice(index, 1);
      localStorage.setItem("Tasks", JSON.stringify(TasksData));
      tasksContainer.removeChild(task);
    }, 500);
    if (task.parentElement.children.length <= 2) {
      toggleNoTaskMessage(true);
    }
  }
};

const handleDeleteAll = (event) => {
  let tasks = Array.from(tasksContainer.children).reverse();
  tasks.forEach((task, index) => {
    if (!task.classList.contains("notTaskAlert")) {
      setTimeout(() => {
        task.classList.add("animation-fadeoutLeft");
        setTimeout(() => {
          tasksContainer.removeChild(task);
        }, 500);
      }, 500 * index);
    }
  });

  let TasksData = [];
  localStorage.setItem("Tasks", JSON.stringify(TasksData));
  setTimeout(() => {
    toggleNoTaskMessage(true);
  }, tasks.length * 360);
};

taskdeleteButton.addEventListener("click", handleDeleteAll);
taskaddButton.addEventListener("click", handleTaskAdd);

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("actionBtn")) {
    handleTaskAction(e);
  }
});

const loadTasksFromStorage = (evene) => {
  const taskDataLocal = JSON.parse(localStorage.getItem("Tasks"));
  if (taskDataLocal != null && taskDataLocal.length > 0) {
    taskDataLocal.forEach((task) => {
      taskListData.push(task);
    });
    taskListData.forEach((task) => {
      renderTask(task.taskText, task.taskDate, task.taskStatus, true);
    });
  } else {
    toggleNoTaskMessage(true);
  }
};

const filterTasksByStatus = (event) => {
  toggleNoTaskMessage(false);
  setTimeout(() => {
    const catName = event.target.dataset.category;
    const tasksRow = Array.from(tasksContainer.children);
    let taskFilters = [];
    if (catName != "All") {
      tasksRow.forEach((task) => {
        if (!task.classList.contains("notTaskAlert")) {
          if (task.children[2].innerText == catName) {
            task.classList.remove("d-none");
            task.classList.add("d-flex");
            taskFilters.push(task);
          } else {
            task.classList.add("d-none");
          }
        } else {
          return;
        }
      });
    } else {
      tasksRow.forEach((task) => {
        if (!task.classList.contains("notTaskAlert")) {
          task.classList.remove("d-none");
          task.classList.add("d-flex");
          taskFilters.push(task);
        }
      });
    }

    if (taskFilters.length < 1) {
      toggleNoTaskMessage(true);
    } else {
      taskFilters.forEach((task, index) => {
        task.classList.remove("animation-fadeinLeft");
        setTimeout(() => {
          task.classList.add("animation-fadeinLeft");
          task.classList.add("d-flex");
        }, 200 * index);
      });
    }
  }, 50);
};

taskCategoryBtn.forEach((Btn) => {
  Btn.addEventListener("click", filterTasksByStatus);
});

window.addEventListener("load", loadTasksFromStorage);
