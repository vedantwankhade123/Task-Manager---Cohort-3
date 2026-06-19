const openForms = document.querySelectorAll(".open-form");
const overlay = document.querySelector(".overlay");
const closeBtn = document.querySelector(".cancel-btn");
const createBtn = document.querySelector(".create-btn");
const categories = document.querySelectorAll(".category p");
const hero = document.querySelector(".hero");
const main = document.querySelector("main");
const emptyState = document.querySelector(".empty-state-ui");
const deleteModal = document.querySelector(".delete-modal");
const confirmDelete = document.querySelector(".confirm-delete");
const cancelDelete = document.querySelector(".cancel-delete");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const categoryData = {
  Work: {
    icon: "ri-suitcase-fill",
    className: "work",
  },
  Personal: {
    icon: "ri-user-fill",
    className: "personal",
  },
  Shopping: {
    icon: "ri-shopping-cart-2-fill",
    className: "shopping",
  },
  Study: {
    icon: "ri-book-read-fill",
    className: "study",
  },
  Health: {
    icon: "ri-heart-fill",
    className: "health",
  },
};
let selectedCategory = "";
let editIndex = null;
let deleteIndex = null;

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("checkbox")) {
    const index = e.target.dataset.index;
    tasks[index].completed = !tasks[index].completed;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
  }
});

function renderTasks() {
  hero.innerHTML = "";

  if (tasks.length === 0) {
    main.style.display = "none";
    emptyState.style.display = "flex";
    return;
  }

  main.style.display = "flex";
  emptyState.style.display = "none";

  tasks.forEach((task, index) => {
    hero.innerHTML += `
      <div class="list ${task.completed ? "completed-task" : ""}">
        <div class="left-part">
          <div class="box">
            <div class="checkbox ${task.completed ? "completed" : ""}"
                    data-index="${index}">
            </div>
          </div>

          <div class="left-text">
            <h2 class="${task.completed ? "completed-text" : ""}">
                 ${task.title}
            </h2>

            <p class="description ${task.completed ? "completed-text" : ""}">
                ${task.description}
            </p>

            <div class="left-bottom">
                <p class="category ${categoryData[task.selectedCategory].className}">
                    <i class="${categoryData[task.selectedCategory].icon}"></i>
                        ${task.selectedCategory}
                </p>
            </div>
          </div>
        </div>

        <div class="list-buttons">
          <button class="update-btn" data-index="${index}">
            Update
          </button>

          <button class="delete-btn" data-index="${index}">
            Delete
          </button>
        </div>
      </div>
    `;
  });
}
renderTasks();

categories.forEach((category) => {
  category.addEventListener("click", () => {
    categories.forEach((c) => c.classList.remove("active"));

    category.classList.add("active");

    selectedCategory = category.textContent.trim();
  });
});

openForms.forEach((button) => {
  button.addEventListener("click", () => {
    editIndex = null;

    document.querySelector("#task-title").value = "";
    document.querySelector("#task-description").value = "";

    selectedCategory = "";
    categories.forEach((c) => c.classList.remove("active"));
    createBtn.textContent = "Create";
    overlay.style.display = "flex";
  });
});

closeBtn.addEventListener("click", () => {
  overlay.style.display = "none";
  editIndex = null;

  document.querySelector("#task-title").value = "";
  document.querySelector("#task-description").value = "";

  selectedCategory = "";
  categories.forEach((c) => c.classList.remove("active"));
  createBtn.textContent = "Create";
});

createBtn.addEventListener("click", () => {
  const title = document.querySelector("#task-title").value;
  const description = document.querySelector("#task-description").value;

  if (
    title.trim() === "" ||
    description.trim() === "" ||
    selectedCategory === ""
  ) {
    return;
  }

  if (editIndex !== null) {
    tasks[editIndex].title = title;
    tasks[editIndex].description = description;
    tasks[editIndex].selectedCategory = selectedCategory;
  } else {
    tasks.push({
      title,
      description,
      selectedCategory,
      completed: false,
    });
  }

  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
  overlay.style.display = "none";
  document.querySelector("#task-title").value = "";
  document.querySelector("#task-description").value = "";

  selectedCategory = "";
  editIndex = null;

  createBtn.textContent = "Create";
  categories.forEach((c) => c.classList.remove("active"));
});


document.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
  deleteIndex = e.target.dataset.index;

  deleteModal.style.display = "flex";
}
  if (e.target.classList.contains("update-btn")) {
    const index = e.target.dataset.index;
    editIndex = index;

    document.querySelector("#task-title").value = tasks[index].title;
    document.querySelector("#task-description").value = tasks[index].description;
    selectedCategory = tasks[index].selectedCategory;
    categories.forEach((c) => {c.classList.remove("active");

      if (c.textContent.trim() === selectedCategory) {
        c.classList.add("active");
      }
    });

    createBtn.textContent = "Update";
    overlay.style.display = "flex";
  }
});

cancelDelete.addEventListener("click", () => {
  deleteModal.style.display = "none";
  deleteIndex = null;
});

confirmDelete.addEventListener("click", () => {
  tasks.splice(deleteIndex, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
  deleteModal.style.display = "none";
  deleteIndex = null;
});