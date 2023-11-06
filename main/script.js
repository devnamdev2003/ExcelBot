let csvData = null;


function sendMessage() {
    const userInput = document.getElementById("userInput").value;
    const sendButton = document.getElementById("sendButton");
    if (!csvData && !userInput) {
        alert(
            "Please upload a CSV file and enter a message before sending."
        );
    } else if (!csvData) {
        alert("Please upload a CSV file before sending.");
    } else if (!userInput) {
        alert("Please enter a message before sending.");
    } else {
        sendButton.setAttribute("disabled", "disabled");
        sendButton.innerHTML ='<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...'
        const requestData = {
            csv_data: csvData,
            user_input_message: userInput,
        };

        document.getElementById("request").style.display = "none";
        document.getElementById("response").style.display = "none";

        // Send the data to your API endpoint
        fetch("https://excel-bot.onrender.com/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
        })
            .then((response) => response.json())
            .then((data) => {
                document.getElementById("request").style.display = "block";
                document.getElementById("request").innerHTML =
                    "<span>User Input: </span>" + userInput;
                document.getElementById("response").style.display = "block";
                document.getElementById("response").innerHTML =
                    "<span>Answer: </span>" + marked.parse(data.answer);
                // Clear the input field
                document.getElementById("userInput").value = "";
                sendButton.removeAttribute("disabled");
                sendButton.innerText="Send your message"

            })
            .catch((error) => {
                console.error("Error:", error);
                document.getElementById("response").style.display = "block";
                document.getElementById("response").textContent =
                    "Request failed. please refresh the page";
            });
    }
}

function loadCSV() {
    const fileInput = document.getElementById("csvFileInput");
    const csvTable = document.getElementById("csvTable");
    const file = fileInput.files[0];
    if (!file) {
        alert("Please select a CSV file to upload.");
        return;
    }
    if (file.name.endsWith(".csv")) {
        const reader = new FileReader();
        reader.onload = function (e) {
            csvData = e.target.result;
            // console.log("CSV Data:", csvData);
            const contents = e.target.result;
            const lines = contents.split("\n");
            let html = "<thead><tr>";
            for (let i = 0; i < lines[0].split(",").length; i++) {
                html += "<th>" + lines[0].split(",")[i] + "</th>";
            }
            html += "</tr></thead><tbody>";
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
        alert("Please upload a CSV file.");
    }
}
