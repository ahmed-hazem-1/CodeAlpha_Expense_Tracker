let savedExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
const expensesList = document.getElementById('expenses');
const expenseForm = document.getElementById('expense-form');
 

// ---------------save list function-----------------  //
savedExpenses.forEach(expense => {
    displayExpense(expense);
});


// ---------------add expense function-----------------  //
function addExpense() {
    const description = document.getElementById('description').value.trim();
    const amount = parseFloat(document.getElementById('amount').value);

    if (!description || isNaN(amount) || amount <= 0) {
        alert('Please enter a valid description and amount.');
        return;
    }

    const newExpense = {
        id: new Date().getTime(),
        description: description,
        amount: amount.toFixed(2),
    };

    displayExpense(newExpense);

    savedExpenses.push(newExpense);
    localStorage.setItem('expenses', JSON.stringify(savedExpenses));

    document.getElementById('description').value = '';
    document.getElementById('amount').value = '';

    expensesList.classList.remove('hidden');
}

function displayExpense(expense) {
    const li = document.createElement('li');
    li.setAttribute('data-expense-id', expense.id);
    li.innerHTML = `
        <span class="description">${expense.description}</span>
        <span class="amount">$${expense.amount}</span>
        <button class="delete-button" onclick="deleteExpense(${expense.id})">Delete</button>
    `;
    expensesList.appendChild(li);
}




// ----------print list function-----------------  //

function printList() {
    const printContent = document.getElementById('expenses').cloneNode(true);
    const originalContent = document.body.innerHTML;

    try {
        const deleteButtons = printContent.getElementsByClassName('delete-button');
        Array.from(deleteButtons).forEach(button => button.remove());

        const totalAmount = calculateTotalAmount(printContent);
        const header = createHeader(totalAmount);
        printContent.insertBefore(header, printContent.firstChild);

        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = './styles.css';
        printContent.appendChild(cssLink);

        document.body.innerHTML = printContent.innerHTML;
        window.print();
    } catch (error) {
        console.error('Error during printing:', error);
    } finally {
        document.body.innerHTML = originalContent;
    }
}



// ---------------format output-----------------  //
function createHeader(totalAmount) {
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();
    const authorName = "Ahmed Hazem";
    const additionalText = "Additional Information: Your Custom Text Here";

    const header = document.createElement('div');
    header.innerHTML = `
        <h3>Expense List</h3>
        <p>Date and Time: ${currentDate} ${currentTime}</p>
        <p>Author: ${authorName}</p>
        <p>Total Amount: $${totalAmount.toFixed(2)}</p>
        <p>${additionalText}</p>
    `;

    return header;
}

function calculateTotalAmount(expensesList) {
    const amountElements = expensesList.querySelectorAll('.amount');
    let totalAmount = 0;

    amountElements.forEach(amountElement => {
        const amountText = amountElement.textContent.trim();
        const amount = parseFloat(amountText.replace('$', '').replace(',', ''));

        if (!isNaN(amount)) {
            totalAmount += amount;
        }
    });

    return totalAmount;
}



// ---------------download list function-----------------  //
function downloadList() {
    let csvContent = "data:text/csv;charset=utf-8," + "Description,Amount\n";
    const savedExpenses = getSavedExpenses(); 

    try {
        savedExpenses.forEach((expense) => {
            const row = `${expense.description},${expense.amount}\n`;
            csvContent += row;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "expense_list.csv");
        document.body.appendChild(link);
        link.click();
    } catch (error) {
        console.error('Error during CSV creation:', error);
    } finally {
        document.body.removeChild(link);
    }
}

// ---------------delete expense function-----------------  //
function deleteExpense(expenseId) {
    const savedExpenses = getSavedExpenses();
    const updatedExpenses = savedExpenses.filter(expense => expense.id !== expenseId);
    saveExpenses(updatedExpenses);

    const expenseElement = document.querySelector(`[data-expense-id="${expenseId}"]`);
    expenseElement.remove();

    const expenseList = document.getElementById('expenses');
    if (updatedExpenses.length === 0) {
        expenseList.classList.add('hidden');
    }
}

function getSavedExpenses() {
    return JSON.parse(localStorage.getItem('expenses')) || [];
}


function saveExpenses(expenses) {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}


// ---------------delete all expenses function-----------------  //
function deleteAllExpenses() {
    const confirmed = confirm('Are you sure you want to delete all expenses?');
    if (!confirmed) {
      return;
    }
  
    expensesList.innerHTML = '';
    savedExpenses = []; // Update the variable directly
    saveExpenses(savedExpenses); // Save the empty array to localStorage (optional)
    checkExpenseList(); // Call after deleting expenses
    alert('All expenses have been deleted.');
  }
  

document.addEventListener("DOMContentLoaded", function () {
    checkExpenseList();

 
const checkInterval = 100; // Check every 100ms
function checkExpenseList() {
    const savedExpenses = getSavedExpenses(); // Fetch latest data
    const deleteAllButton = document.getElementById("deleteAllButton");
    deleteAllButton.style.display = savedExpenses.length > 0 ? "block" : "none";
  }
  
setInterval(checkExpenseList, checkInterval);

});
