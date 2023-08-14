const newProjectForm = document.querySelector("[data-project-form]");
const projectList = document.querySelector("[data-project-list]");
const todoContainer = document.querySelector("[data-todo-container]");
todoContainer.style.display = "none";
const newTaskForm = document.querySelector("[data-task-form]");
const taskList = document.querySelector("[data-task-list]");
const clearCompleteTasksBtn = document.querySelector("[data-clear-tasks]");
const deleteProjectBtn = document.querySelector("[data-delete-project]");

const LOCAL_STORAGE_PROJECT_LIST = "project.list";
const LOCAL_STORAGE_SELECTED_PROJECT_ID = "project.selectedproject.id";

let myProjects =
  JSON.parse(localStorage.getItem(LOCAL_STORAGE_PROJECT_LIST)) || [];
let selectedProjectId = localStorage.getItem(LOCAL_STORAGE_SELECTED_PROJECT_ID);

function createProject(name) {
  return {
    id: Date.now().toString(),
    name,
    tasks: [],
  };
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function renderProjects() {
  clearElement(projectList);
  myProjects.forEach((project) => {
    const projectElement = document.createElement("li");
    projectElement.classList.add("project_name");
    projectElement.id = project.id;
    projectElement.textContent = project.name;
    projectList.appendChild(projectElement);
  });
}

function renderTasks(project) {
  clearElement(taskList);
  project.tasks.forEach((task) => {
    const taskTemplate = document.getElementById("task_template");
    const taskElement = document.importNode(taskTemplate.content, true);
    const checkbox = taskElement.querySelector("input");
    checkbox.id = task.id;
    checkbox.checked = task.complete;

    const label = taskElement.querySelector("label");
    label.htmlFor = task.id;
    label.append(task.name);
    taskList.appendChild(taskElement);
  });
}

function renderRemainingTaskCount(project) {
  const remainingTaskCount = project.tasks.filter(
    (task) => !task.complete,
  ).length;
  const taskString = remainingTaskCount === 1 ? "task" : "tasks";
  const tasksRemainingText = document.querySelector(".tasks_remaining");
  tasksRemainingText.textContent = `${remainingTaskCount} ${taskString} remaining`;
}

function render() {
  renderProjects();

  const selectedProject = myProjects.find(
    (project) => project.id === selectedProjectId,
  );
  if (!selectedProject) {
    todoContainer.style.display = "none";
  } else {
    todoContainer.style.display = "";
    const title = document.querySelector("[data-project-title]");
    title.textContent = selectedProject.name;
    renderTasks(selectedProject);
    renderRemainingTaskCount(selectedProject);
  }
}

function save() {
  localStorage.setItem(LOCAL_STORAGE_PROJECT_LIST, JSON.stringify(myProjects));
  localStorage.setItem(LOCAL_STORAGE_SELECTED_PROJECT_ID, selectedProjectId);
}

function saveAndRender() {
  save();
  render();
}

function updateTask(e) {
  if (e.target.tagName.toLowerCase() === "input") {
    const selectedProject = myProjects.find(
      (project) => project.id === selectedProjectId,
    );
    const selectedTask = selectedProject.tasks.find(
      (task) => task.id === e.target.id,
    );
    selectedTask.complete = !selectedTask.complete;
    renderRemainingTaskCount(selectedProject);
  }
}

function addNewProject(e) {
  e.preventDefault();
  const projectInput = document.querySelector("[data-project-input]");
  const projectName = projectInput.value;
  projectInput.value = null;
  if (!projectName) return;
  myProjects.push(createProject(projectName));
  saveAndRender();
}

function getSelectedProject(e) {
  if (e.target.tagName.toLowerCase() === "li") {
    selectedProjectId = e.target.id;
    saveAndRender();
  }
}

function createTask(name) {
  return {
    id: Date.now().toString(),
    name,
    complete: false,
  };
}

function addNewTask(e) {
  e.preventDefault();
  const taskInput = document.querySelector("[data-task-input]");
  const taskName = taskInput.value;
  taskInput.value = null;
  if (!taskName) return;

  const selectedProject = myProjects.find(
    (project) => project.id === selectedProjectId,
  );
  selectedProject.tasks.push(createTask(taskName));
  saveAndRender();
}

function clearCompleteTasks() {
  const selectedProject = myProjects.find(
    (project) => project.id === selectedProjectId,
  );
  selectedProject.tasks = selectedProject.tasks.filter(
    (task) => !task.complete,
  );
  saveAndRender();
}

function deleteProject() {
  myProjects = myProjects.filter((project) => project.id !== selectedProjectId);
  saveAndRender();
}

saveAndRender();

newProjectForm.addEventListener("submit", addNewProject);
projectList.addEventListener("click", getSelectedProject);
newTaskForm.addEventListener("submit", addNewTask);
taskList.addEventListener("click", updateTask);
clearCompleteTasksBtn.addEventListener("click", clearCompleteTasks);
deleteProjectBtn.addEventListener("click", deleteProject);
