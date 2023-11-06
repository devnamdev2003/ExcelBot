// Initialize csvData as null
let csvData = null;

// Function to send user input and CSV data to an API endpoint
function sendMessage() {
    // Get the user input and send button from the document
    const userInput = document.getElementById("userInput").value;
    const sendButton = document.getElementById("sendButton");

    // Check if csvData and userInput are both empty
    if (!csvData && !userInput) {
        // Alert the user to upload a CSV file and enter a message before sending
        alert("Please upload a CSV file and enter a message before sending.");
    }
    // Check if csvData is empty
    else if (!csvData) {
        // Alert the user to upload a CSV file before sending
        alert("Please upload a CSV file before sending.");
    }
    // Check if userInput is empty
    else if (!userInput) {
        // Alert the user to enter a message before sending
        alert("Please enter a message before sending.");
    }
    else {
        // Disable the send button and show a loading spinner
        sendButton.setAttribute("disabled", "disabled");
        sendButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...';

        // Create a data object to send to the API
        const requestData = {
            csv_data: csvData,
            user_input_message: userInput,
        };

        // Hide the request and response elements
        document.getElementById("request").style.display = "none";
        document.getElementById("response").style.display = "none";

        // Send the data to the API endpoint
        fetch("http://127.0.0.1:8000/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
        })
            .then((response) => response.json())
            .then((data) => {
                // Show the user input and the API response
                document.getElementById("request").style.display = "block";
                document.getElementById("request").innerHTML = "<span>User Input: </span>" + userInput;
                document.getElementById("response").style.display = "block";
                document.getElementById("response").innerHTML = "<span>Answer: </span>" + marked.parse(data.answer);

                // Clear the input field and enable the send button
                document.getElementById("userInput").value = "";
                sendButton.removeAttribute("disabled");
                sendButton.innerText = "Send your message";
            })
            .catch((error) => {
                // Log and display an error message if the request fails
                console.error("Error:", error);
                document.getElementById("response").style.display = "block";
                document.getElementById("response").textContent = "Request failed. please try again";
                sendButton.removeAttribute("disabled");
                sendButton.innerText = "Send your message";
            });
    }
}

// Function to load and display a CSV file
function loadCSV() {
    // Get the file input and CSV table from the document
    const fileInput = document.getElementById("csvFileInput");
    const csvTable = document.getElementById("csvTable");
    const file = fileInput.files[0];

    // Check if no file is selected
    if (!file) {
        // Alert the user to select a CSV file to upload
        alert("Please select a CSV file to upload.");
        csvData = null;
        csvTable.innerHTML = "";
        return;
    }

    // Check if the file has a .csv extension
    if (file.name.endsWith(".csv")) {
        // Read the file as text and display the contents in a table
        const reader = new FileReader();
        reader.onload = function (e) {
            csvData = e.target.result;
            const contents = e.target.result;
            const lines = contents.split("\n");
            let html = "<thead><tr>";

            // Populate the table header with the column names
            for (let i = 0; i < lines[0].split(",").length; i++) {
                html += "<th>" + lines[0].split(",")[i] + "</th>";
            }
            html += "</tr></thead><tbody>";

            // Populate the table body with the data rows
            for (let i = 1; i < lines.length; i++) {
                html += "<tr>";
                const row = lines[i].split(",");
                for (const value of row) {
                    html += "<td>" + value + "</td>";
                }
                html += "</tr>";
            }
            html += "</tbody>";
            csvTable.innerHTML = html;
        };
        reader.readAsText(file);
    }
    else {
        // Alert the user to upload a CSV file
        alert("Please upload a CSV file.");
        csvData = null;
        csvTable.innerHTML = "";
    }
}
