// ========================================================
// Restaurant Management System - Week 2 (JS-only CRUD)
// ========================================================

// 1. Our temporary "Database" (Array of objects)
let foodMenu = [];

// State variables to track if we are editing an existing item
let isEditMode = false;
let editItemId = null;

// 2. Select DOM Elements
const foodForm = document.getElementById('foodForm');
const tableBody = document.getElementById('foodTableBody');
const submitBtn = document.getElementById('submitBtn');

// Select input fields
const nameInput = document.getElementById('name');
const priceInput = document.getElementById('price');
const categoryInput = document.getElementById('category');
const descInput = document.getElementById('description');

// 3. Handle Form Submission (Create & Update)
foodForm.addEventListener('submit', function(event) {
    // Prevent the page from refreshing on submit
    event.preventDefault();

    // Fetch and clean data from inputs
    const name = nameInput.value.trim();
    const price = parseFloat(priceInput.value);
    const category = categoryInput.value;
    const description = descInput.value.trim();

    // 4. Custom JavaScript Validation
    if (name === '' || isNaN(price) || price <= 0 || category === '' || description === '') {
        alert("Please fill out all fields. Price must be a valid number greater than 0.");
        return; 
    }

    // 5. Logic to either Update or Add a new item
    if (isEditMode) {
        // Find the item in our array and update its values
        const itemIndex = foodMenu.findIndex(item => item.id === editItemId);
        if (itemIndex !== -1) {
            foodMenu[itemIndex].name = name;
            foodMenu[itemIndex].price = price;
            foodMenu[itemIndex].category = category;
            foodMenu[itemIndex].description = description;
        }
        
        // Reset the form state back to normal
        isEditMode = false;
        editItemId = null;
        submitBtn.innerText = "Save Item"; 
    } else {
        // Create a new food object with a unique timestamp ID
        const newFoodItem = {
            id: Date.now(), 
            name: name,
            price: price,
            category: category,
            description: description
        };
        
        // Push the new object into our array
        foodMenu.push(newFoodItem);
    }

    // Clear the form inputs for the next entry
    foodForm.reset();

    // Render the updated array to the HTML table
    renderTable();
});

// 6. Function to Read/Display the array data in the HTML table
function renderTable() {
    // Clear out the current table rows first
    tableBody.innerHTML = '';

    // Loop through the array and create a row for each item
    foodMenu.forEach(function(item) {
        const tr = document.createElement('tr');

        // Build the HTML structure for the row, including action buttons
        tr.innerHTML = `
            <td><strong>${item.name}</strong></td>
            <td>₹${item.price}</td>
            <td>${item.category}</td>
            <td>${item.description}</td>
            <td>
                <button type="button" class="action-btn edit-btn" onclick="editItem(${item.id})">Edit</button>
                <button type="button" class="action-btn delete-btn" onclick="deleteItem(${item.id})">Delete</button>
            </td>
        `;

        tableBody.appendChild(tr);
    });
}

// 7. Function to Delete an item
function deleteItem(id) {
    // Confirm before deleting (good UX practice)
    if (confirm("Are you sure you want to remove this item?")) {
        // Filter out the item that matches the ID
        foodMenu = foodMenu.filter(item => item.id !== id);
        renderTable();
    }
}

// 8. Function to Edit an item
function editItem(id) {
    // Find the specific item in the array
    const itemToEdit = foodMenu.find(item => item.id === id);
    
    if (itemToEdit) {
        // Populate the form with the existing data
        nameInput.value = itemToEdit.name;
        priceInput.value = itemToEdit.price;
        categoryInput.value = itemToEdit.category;
        descInput.value = itemToEdit.description;

        // Switch form into edit mode
        isEditMode = true;
        editItemId = itemToEdit.id;
        
        // Change the button text so the user knows they are updating
        submitBtn.innerText = "Update Item";
        
        // Smooth scroll to the top of the form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}