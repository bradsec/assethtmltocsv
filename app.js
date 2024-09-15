function showNotification(message, type) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000); // Hide the notification after 3 seconds
}

function convertToCSV() {
    const htmlInput = document.getElementById('htmlInput').value;
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlInput, 'text/html');

    let csvData = [];

    doc.querySelectorAll("div.col-4[data-name='memberAssets']").forEach(card => {
        const employeeIDElement = card.querySelector(".card-header");
        let employeeID = "";
        let fullName = "";
        if (employeeIDElement) {
            const headerText = employeeIDElement.textContent.trim();
            const parts = headerText.split(" ");
            if (parts.length > 0) {
                employeeID = parts[0];
                fullName = parts.slice(1).join(" ");
            }
        }

        card.querySelectorAll(".card-body table tbody tr").forEach(row => {
            const cells = row.querySelectorAll("td");
            if (cells.length > 0) {
                const serialNumber = cells[0].textContent.trim();
                const type = cells[1].textContent.trim();
                const make = cells[2].textContent.trim();
                const model = cells[3].textContent.trim();
                const rowData = [serialNumber, type, make, model, employeeID, fullName];
                csvData.push(rowData);
            }
        });
    });

    if (csvData.length === 0) {
        showNotification('No results found.', 'info');
        document.getElementById('csvOutput').value = '';
        return;
    }

    let csvContent = "Serial Number,Type,Make,Model,Employee ID,Full Name\n";
    csvData.forEach(row => {
        csvContent += row.join(",") + "\n";
    });

    document.getElementById('csvOutput').value = csvContent;
    showNotification('Content processed successfully.', 'success');
}


function saveCSV() {
    const csvContent = document.getElementById('csvOutput').value;
    
    if (!csvContent) {
        showNotification('No CSV content to save!', 'error');
        return;
    }
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'output.csv');
    link.click();

    showNotification('CSV file saved successfully.', 'success');
}

function copyToClipboard() {
    const csvContent = document.getElementById('csvOutput').value;
    
    if (!csvContent) {
        showNotification('No CSV content to copy!', 'error');
        return;
    }
    
    // Create a temporary textarea to copy the content
    const tempTextarea = document.createElement('textarea');
    tempTextarea.value = csvContent;
    document.body.appendChild(tempTextarea);
    tempTextarea.select();
    document.execCommand('copy');
    document.body.removeChild(tempTextarea);
    
    showNotification('CSV content copied to clipboard.', 'success');
}
