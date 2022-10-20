document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:5000/getall")
    .then((res) => res.json())
    .then((data) => loadHTMLTable(data["data"]));
});

document.querySelector("table tbody").addEventListener("click", (event) => {
  if (event.target.className === "deleteRowBtn") {
    deleteRowById(event.target.dataset.id);
  }
  if (event.target.className === "editRowBtn") {
    handleEditRow(event.target.dataset.id);
  }
});

const updateBtn = document.querySelector("#updateRowBtn");
const searchBtn = document.querySelector("#searchBtn");

searchBtn.onclick = () => {
  const searchValue = document.querySelector("#searchInput").value;
  fetch("http://localhost:5000/search/" + searchValue)
    .then((res) => res.json())
    .then((data) => loadHTMLTable(data["data"]));
};

const deleteRowById = (id) => {
  fetch("http://localhost:5000/delete/" + id, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        location.reload();
      }
    });
};

const handleEditRow = (id) => {
  const updateSection = document.querySelector("#updateSection");
  updateSection.hidden = false;
  document.querySelector("#updateNameInput").dataset.id = id;
};

updateBtn.onclick = () => {
  const updateNameInput = document.querySelector("#updateNameInput");
  fetch("http://localhost:5000/update", {
    headers: {
      "Content-type": "application/json",
    },
    method: "PATCH",
    body: JSON.stringify({
      id: updateNameInput.dataset.id,
      name: updateNameInput.value,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        location.reload();
      }
    });
};

const addBtn = document.querySelector("#addNameBtn");

addBtn.onclick = () => {
  const nameInput = document.querySelector("#name-input");

  const name = nameInput.value;

  nameInput.value = "";

  fetch("http://localhost:5000/insert", {
    headers: {
      "Content-type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ name: name }),
  })
    .then((res) => res.json())
    .then((data) => insertRowIntoTable(data["data"]));
};

const insertRowIntoTable = (data) => {
  const table = document.querySelector("table tbody");
  const isTableData = table.querySelector(".no-data");
  let tableHtml = "<tr>";
  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      if (key === "data_added") {
        data[key] = new Date(data[key]).toLocaleString();
      }
      tableHtml += `<td>${data[key]}</td>`;
    }
  }
  tableHtml += `<td><button class="deleteRowBtn" data-id=${data.id}>Delete</button></td>`;
  tableHtml += `<td><button class="editRowBtn" data-id=${data.id}>Edit</button></td>`;
  tableHtml += "</tr>";

  if (isTableData) {
    table.innerHTML = tableHtml;
  } else {
    const newRow = table.insertRow();
    newRow.innerHTML = tableHtml;
  }
};

const loadHTMLTable = (data) => {
  const table = document.querySelector("table tbody");

  if (data.length === 0) {
    table.innerHTML = "<tr><td class='no-data' colspan='5'>No Data</td></tr>";
    return;
  }
  let tableHtml = "";
  data.forEach(({ id, name, date_added }) => {
    tableHtml += `
      <tr>
        <td>${id}</td>
        <td>${name}</td>
        <td>${new Date(date_added).toLocaleString()}</td>
        <td><button class="deleteRowBtn" data-id=${id}>Delete</button></td>
        <td><button class="editRowBtn" data-id=${id}>Edit</button></td>
      </tr>
    `;
  });
  table.innerHTML = tableHtml;
};
