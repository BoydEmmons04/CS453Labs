const API_BASE_URL = "http://localhost:3000";

const loadButton = document.querySelector("#load-items");
const clearSelectionButton = document.querySelector("#clear-selection");
const itemList = document.querySelector("#items");
const addForm = document.querySelector("#add-item-form");
const itemNameInput = document.querySelector("#item-name");
const itemQuantityInput = document.querySelector("#item-quantity");
const editForm = document.querySelector("#edit-item-form");
const editIdInput = document.querySelector("#edit-id");
const editNameInput = document.querySelector("#edit-name");
const editQuantityInput = document.querySelector("#edit-quantity");
const deleteButton = document.querySelector("#delete-item");
const statusBox = document.querySelector("#status");
const selectedItemBox = document.querySelector("#selected-item");

// Application state
const state = {
  items: [],
  selectedId: null
};

// set the status message
function setStatus(message, isError = false) {
  statusBox.textContent = message;
  statusBox.classList.toggle("error", isError);
}

// get the selected item from app state
function getSelectedItem() {
  return state.items.find((item) => item.id === state.selectedId) ?? null;
}

// reset the edit form inputs
function resetEditForm() {
  editIdInput.value = "";
  editNameInput.value = "";
  editQuantityInput.value = "";
}

// render the selected item details
function renderSelectedItem() {
  const selectedItem = getSelectedItem();

  if (!selectedItem) {
    selectedItemBox.innerHTML = "<em>No item selected.</em>";
    resetEditForm();
    return;
  }

  selectedItemBox.innerHTML = `
    <strong>#${selectedItem.id}</strong>
    <div>Name: ${selectedItem.name}</div>
    <div>Quantity: ${selectedItem.quantity}</div>
  `;

  editIdInput.value = selectedItem.id;
  editNameInput.value = selectedItem.name;
  editQuantityInput.value = selectedItem.quantity;
}

// render the list of items
function renderItems(items) {
  state.items = items;
  itemList.replaceChildren();

  if (items.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "empty-state";
    emptyMessage.textContent = "No items yet.";
    itemList.appendChild(emptyMessage);
    return;
  }

  const list = document.createElement("ul");
  list.className = "item-list";

  for (const item of items) {
    const li = document.createElement("li");
    li.className = "item-row";

    const info = document.createElement("div");
    info.className = "item-info";
    info.innerHTML = `<strong>#${item.id}</strong><span>${item.name} · Qty ${item.quantity}</span>`;

    const actions = document.createElement("div");
    actions.className = "item-actions";

    const selectButton = document.createElement("button");
    selectButton.type = "button";
    selectButton.className = "secondary";
    selectButton.textContent = "View";
    selectButton.addEventListener("click", () => {
      state.selectedId = item.id;
      renderSelectedItem();
      setStatus(`Selected item #${item.id}.`);
    });

    const deleteButtonForItem = document.createElement("button");
    deleteButtonForItem.type = "button";
    deleteButtonForItem.className = "danger";
    deleteButtonForItem.textContent = "Delete";
    deleteButtonForItem.addEventListener("click", () => {
      void deleteItem(item.id);
    });

    actions.append(selectButton, deleteButtonForItem);
    li.append(info, actions);
    list.appendChild(li);
  }

  itemList.appendChild(list);

  if (state.selectedId !== null && !items.some((item) => item.id === state.selectedId)) {
    state.selectedId = null;
  }

  renderSelectedItem();
}

// request JSON data from the API
async function requestJson(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, options);
  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json().catch(() => null)
    : null;

  if (!response.ok) {
    throw new Error(data?.message ?? `Request failed with status ${response.status}`);
  }

  return data;
}

async function loadItems() {
  setStatus("Loading items...");

  try {
    // fetch items from the api
    const data = await requestJson("/api/items");
    renderItems(data.items);
    setStatus("Items loaded.");
  } catch (error) {
    // display error message in the status box
    setStatus(error.message, true);
  }
}

async function addItem(name, quantity) {
  setStatus("Adding item...");

  try {
    // send a POST request to the API to add a new item
    const data = await requestJson("/api/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, quantity })
    });

    // update the status, clear form inputs, reload items, and select the new item
    setStatus(`Added item: ${data.item.name}`);
    itemNameInput.value = "";
    itemQuantityInput.value = "0";
    await loadItems();
    state.selectedId = data.item.id;
    renderSelectedItem();
  } catch (error) {
    setStatus(error.message, true);
  }
}

// update an existing item by sending PATCH to the API
async function updateItem(id, name, quantity) {
  setStatus("Saving changes...");

  try {
    const data = await requestJson(`/api/items/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, quantity })
    });

    setStatus(`Updated item #${data.item.id}.`);
    await loadItems();
    state.selectedId = data.item.id;
    renderSelectedItem();
  } catch (error) {
    setStatus(error.message, true);
  }
}

// delete an item by sending DELETE to the API
async function deleteItem(id) {
  setStatus("Deleting item...");

  try {
    await requestJson(`/api/items/${id}`, {
      method: "DELETE"
    });

    if (state.selectedId === id) {
      state.selectedId = null;
    }

    setStatus(`Deleted item #${id}.`);
    await loadItems();
  } catch (error) {
    setStatus(error.message, true);
  }
}

// event listeners for buttons and forms
loadButton.addEventListener("click", () => {
  void loadItems();
});

// clear the current selection
clearSelectionButton.addEventListener("click", () => {
  state.selectedId = null;
  renderSelectedItem();
  setStatus("Selection cleared.");
});

// handle form submissions for adding and editing items
addForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = itemNameInput.value.trim();
  const quantity = Number(itemQuantityInput.value);

  if (!name || !Number.isInteger(quantity) || quantity < 0) {
    setStatus("Enter a name and a non-negative integer quantity.", true);
    return;
  }

  await addItem(name, quantity);
});

// handle form submission for editing an item
editForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const id = Number(editIdInput.value);
  const name = editNameInput.value.trim();
  const quantity = Number(editQuantityInput.value);

  if (!id || !name || !Number.isInteger(quantity) || quantity < 0) {
    setStatus("Enter a valid item ID, name, and quantity.", true);
    return;
  }

  await updateItem(id, name, quantity);
});

// handle delete button click for the selected item
deleteButton.addEventListener("click", () => {
  const selectedItem = getSelectedItem();

  if (!selectedItem) {
    setStatus("Select an item before deleting it.", true);
    return;
  }

  void deleteItem(selectedItem.id);
});

// load items when the page is first loaded
window.addEventListener("DOMContentLoaded", () => {
  void loadItems();
});
