function handleFormSubmit(event) {
  event.preventDefault();
  const searchTermInput = document.getElementById("search-term");
  const searchTerm = searchTermInput.value.trim();

  fetchMedicine(searchTerm);
}

function handleDeleteItem(event) {
  event.preventDefault();
  const deleteItemInput = document.getElementById("delete-term");
  const deleteTerm = deleteItemInput.value.trim();

  deleteMedicine(deleteTerm);
}

function handleCreateItem(event) {
  event.preventDefault();
  const inputName = document.getElementById("name");
  const name = inputName.value.trim();
  const inputPrice = document.getElementById("price");
  const price = inputPrice.value.trim();

  createMedicine(name, price);
}

function handleUpdateItem(event) {
  event.preventDefault();
  const inputName = document.getElementById("new_name");
  const name = inputName.value.trim();
  const inputPrice = document.getElementById("new_price");
  const price = inputPrice.value.trim();

  updateMedicine(name, price);
}

async function updateMedicine(name, price) {
  const summaryElement = document.getElementById("summary-count");
  const listElement = document.getElementById("medicine-list");
  summaryElement.textContent = "";
  listElement.innerHTML = "";

  const formData = new FormData();
  formData.append("name", name);
  formData.append("price", price);
  let url = "http://127.0.0.1:8000/update";

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Submission failed!");
    }

    const result = await response.json();

    if (result.error) {
      summaryElement.textContent = `Update failed: ${result.error}`;
      return result;
    }

    summaryElement.textContent =
      result.message || `Medicine '${name}' updated successfully.`;
    listElement.innerHTML = "";

    return result;
  } catch (error) {
    console.error("Update Error:", error);
    summaryElement.textContent = `Update failed: ${error.message}`;
    return { error: error.message };
  }
}

async function deleteMedicine(name) {
  const summaryElement = document.getElementById("summary-count");
  const listElement = document.getElementById("medicine-list");

  summaryElement.textContent = "Attempting deletion...";
  listElement.innerHTML = "";
  const formData = new FormData();
  formData.append("name", name);

  let url = "http://127.0.0.1:8000/delete";

  try {
    const response = await fetch(url, {
      method: "DELETE",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Deletion failed with status: ${response.status}`);
    }

    const result = await response.json();

    if (result.error) {
      summaryElement.textContent = `Deletion failed: ${result.error}`;
      return result;
    }

    summaryElement.textContent =
      result.message || `Medicine '${name}' deleted successfully.`;
    listElement.innerHTML = "";

    return result;
  } catch (error) {
    console.error("Deletion Error:", error);
    summaryElement.textContent = `Deletion failed: ${error.message}`;
    return { error: error.message };
  }
}
async function createMedicine(name, price) {
  const summaryElement = document.getElementById("summary-count");
  const listElement = document.getElementById("medicine-list");
  summaryElement.textContent = "";
  listElement.innerHTML = "";

  const formData = new FormData();
  formData.append("name", name);
  formData.append("price", price);
  let url = "http://127.0.0.1:8000/create";

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Submission failed!");
    }

    const result = await response.json();

    if (result.error) {
      summaryElement.textContent = `Creation failed: ${result.error}`;
      return result;
    }

    summaryElement.textContent =
      result.message || `Medicine '${name}' created successfully.`;
    listElement.innerHTML = "";

    return result;
  } catch (error) {
    console.error("Creation Error:", error);
    summaryElement.textContent = `Creation failed: ${error.message}`;
    return { error: error.message };
  }
}

async function fetchMedicine(searchTerm = "") {
  const listElement = document.getElementById("medicine-list");
  const summaryElement = document.getElementById("summary-count");
  listElement.innerHTML = "<li>Fetching data... please wait.</li>";
  summaryElement.textContent = "";

  let url = "http://127.0.0.1:8000/medicines";

  if (searchTerm) {
    url = `${url}/${encodeURIComponent(searchTerm)}`;
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    listElement.innerHTML = "";

    if (!data) {
      listElement.innerHTML = "<li>No medicine found with this name!</li>";
    } else if (data.price !== undefined && data.name) {
      const listItem = document.createElement("li");
      const priceDisplay =
        typeof data.price === "number"
          ? `Price: ${data.price.toFixed(2)}`
          : "Price not available";

      listItem.textContent = `${data.name} (${priceDisplay})`;
      listElement.appendChild(listItem);
    } else {
      listElement.innerHTML =
        "<li>This medicine has an invalid or incomplete format!</li>";
    }
  } catch (error) {
    console.error("There was an error fetching the data", error);
    listElement.innerHTML = `<li>Error loading data: ${error.message}</li>`;
  }
}

async function fetchAllMedicines() {
  const listElement = document.getElementById("medicine-list");
  const summaryElement = document.getElementById("summary-count");

  listElement.innerHTML = "<li>Fetching data... please wait.</li>";
  summaryElement.textContent = "";
  try {
    const response = await fetch("http://127.0.0.1:8000/medicines");

    if (!response.ok) {
      throw new Error(`HTTP error!`);
    }

    const data = await response.json();
    const medicines = data.medicines;
    const totalMedicines = medicines.length;

    listElement.innerHTML = "";

    if (totalMedicines === 0) {
      listElement.innerHTML = "<li>No medicine items were found</li>";
    }

    let validItemCount = 0;
    medicines.forEach((item) => {
      if (item.price !== undefined && item.name) {
        const listItem = document.createElement("li");
        const priceDisplay =
          typeof item.price === "number"
            ? `Price: ${item.price.toFixed(2)}`
            : "Price not available";

        listItem.textContent = `${item.name} (${priceDisplay})`;
        listElement.appendChild(listItem);
        validItemCount++;
      }
    });

    summaryElement.textContent = `Found ${validItemCount} valid items and ${totalMedicines - validItemCount} invalid items (Total: ${totalMedicines})`;

    if (validItemCount === 0 && totalMedicines > 0) {
      listElement.innerHTML = `<li>All fetched items were invalid</li>`;
    } else if (totalMedicines === 0) {
      listElement.innerHTML = `<li>The server return an empty list</li>`;
    }
  } catch {
    console.error("There was an error fetching the data", error);
    listElement.innerHTML(`<li>Error loading data: ${error.message}</li>`);
    summaryElement.textContent = "Error fetching the data";
  }
}
