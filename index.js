const form = document.getElementById("form");
const tableBody = document.querySelector("#userTable tbody");
const searchInput = document.getElementById("searchbar");
const cityFilter = document.getElementById("cityd");

let editRow = null;

let currentPage = 1;
const rowsPerPage = 10;

const prevBtn = document.getElementById("prevPage");
const nextBtn = document.getElementById("nextPage");
const pageInfo = document.getElementById("pageInfo");


// for form handle 
form.addEventListener("submit", function (e) {
    e.preventDefault();

    let fname = document.getElementById("fname").value.trim();
    let lname = document.getElementById("lname").value.trim();
    let city = document.getElementById("city").value.trim();
    let address = document.getElementById("address").value.trim();
    let contact = document.getElementById("contact").value.trim();
    let hobbie = document.getElementById("hobbie").value.trim();
    let gender = document.getElementById("gender").value.trim();
    let email = document.getElementById("email").value.trim();

    let valid = true;

    if (fname === "") {
        document.getElementById("fname").nextElementSibling.innerText = " enter first name";
        valid = false;
    } else {
        document.getElementById("fname").nextElementSibling.innerText = "";
    }

    if (lname === "") {
        document.getElementById("lname").nextElementSibling.innerText = " enter last name";
        valid = false;
    } else {
        document.getElementById("lname").nextElementSibling.innerText = "";
    }

    if (city === "") {
        document.getElementById("city").nextElementSibling.innerText = " enter something city";
        valid = false;
    } else {
        document.getElementById("city").nextElementSibling.innerText = "";
    }

    if (address === "") {
        document.getElementById("address").nextElementSibling.innerText = " enter address";
        valid = false;
    } else {
        document.getElementById("address").nextElementSibling.innerText = "";
    }

    let phoneregex = /^\d{10}$/;
    if (contact === "") {
        document.getElementById("contact").nextElementSibling.innerText = " enter contact";
        valid = false;
    }
    else if (!phoneregex.test(contact)) {
        document.getElementById("contact").nextElementSibling.innerText = " not valid contact";
        valid = false;
    }

    else {
        document.getElementById("contact").nextElementSibling.innerText = "";
    }

    if (hobbie === "") {
        document.getElementById("hobbie").nextElementSibling.innerText = " enter hobbie";
        valid = false;
    } else {
        document.getElementById("hobbie").nextElementSibling.innerText = "";
    }

    if (gender === "") {
        document.getElementById("gender").nextElementSibling.innerText = " enter gender";
        valid = false;
    } else {
        document.getElementById("gender").nextElementSibling.innerText = "";
    }

    let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (email === "") {
        document.getElementById("email").nextElementSibling.innerText = "enter email";
        valid = false;
    } else if (!regex.test(email)) {
        document.getElementById("email").nextElementSibling.innerText = "Invalid email format";
        valid = false;
    } else {
        document.getElementById("email").nextElementSibling.innerText = "";
    }

    if (!valid) return;
    
    // if edit = row hoy to
    if (editRow) {
        editRow.cells[0].textContent = fname;
        editRow.cells[1].textContent = lname;
        editRow.cells[2].textContent = city;
        editRow.cells[3].textContent = address;
        editRow.cells[4].textContent = contact;
        editRow.cells[5].textContent = hobbie;
        editRow.cells[6].textContent = gender;
        editRow.cells[7].textContent = email;
        editRow.dataset.visible = "true";
        editRow = null;
    } else {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${fname}</td>
            <td>${lname}</td>
            <td>${city}</td>
            <td>${address}</td>
            <td>${contact}</td>
            <td>${hobbie}</td>
            <td>${gender}</td>
            <td>${email}</td>
            <td>
                <button class="editbtn">Edit</button>
                <button class="dltbtn">Delete</button>
            </td>
        `;

        row.dataset.visible = "true";
        tableBody.appendChild(row);
        addRowEvents(row);
    }

    form.reset();
    currentPage = 1;
    updatePagination();
});


// table's buttons
function addRowEvents(row) {
    const dltbtn = row.querySelector(".dltbtn");
    const editbtn = row.querySelector(".editbtn");

    if (dltbtn) {
        dltbtn.addEventListener("click", function () {
            row.remove();
            updatePagination();
        });
    }
    
    // move data to inputs 
    if (editbtn) {
        editbtn.addEventListener("click", function () {
            editRow = row;
            document.getElementById("fname").value = row.cells[0].textContent;
            document.getElementById("lname").value = row.cells[1].textContent;
            document.getElementById("city").value = row.cells[2].textContent;
            document.getElementById("address").value = row.cells[3].textContent;
            document.getElementById("contact").value = row.cells[4].textContent;
            document.getElementById("hobbie").value = row.cells[5].textContent;
            document.getElementById("gender").value = row.cells[6].textContent;
            document.getElementById("email").value = row.cells[7].textContent;
        });
    }
}


// search and droplist
searchInput.addEventListener("input", checkSearch);
cityFilter.addEventListener("change", checkDrop);

function checkSearch() {
    let svalue = searchInput.value.toLowerCase();

    tableBody.querySelectorAll("tr").forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(svalue)) {
            row.dataset.visible = "true";
        } else {
            row.dataset.visible = "false";
        }
    });

    currentPage = 1;
    updatePagination();
}

function checkDrop() {
    let dvalue = cityFilter.value.toLowerCase();

    tableBody.querySelectorAll("tr").forEach(row => {
        const city = row.cells[2].textContent.toLowerCase();
        if (dvalue === "" || city === dvalue) {
            row.dataset.visible = "true";
        } else {
            row.dataset.visible = "false";
        }
    });

    currentPage = 1;
    updatePagination();
}


// for pagination 
function updatePagination() {

    let allRows = tableBody.querySelectorAll("tr");

    let visibleRows = [];

    allRows.forEach(row => {
        if (row.dataset.visible === "true") {
            visibleRows.push(row);
        }
    });

    let totalPages = Math.ceil(visibleRows.length / rowsPerPage);
    if (totalPages === 0) totalPages = 1;

    if (currentPage > totalPages) {
        currentPage = totalPages;
    }

    let start = (currentPage - 1) * rowsPerPage;
    let end = start + rowsPerPage;

    allRows.forEach(row => {
        row.style.display = "none";
    });

    for (let i = start; i < end; i++) {
        if (visibleRows[i]) {
            visibleRows[i].style.display = "";
        }
    }

    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
}


prevBtn.addEventListener("click", function () {
    if (currentPage > 1) {
        currentPage--;
        updatePagination();
    }
});

nextBtn.addEventListener("click", function () {
    currentPage++;
    updatePagination();
});

document.querySelectorAll("#userTable tbody tr").forEach(row => {
    row.dataset.visible = "true";
    addRowEvents(row);
});

updatePagination();
