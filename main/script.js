let csvData = null;
const sendButton = document.getElementById("sendButton");

function sendMessage() {
    const userInput = document.getElementById("userInput").value;
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
        const requestData = {
            csv_data: csvData,
            user_input_message: userInput,
        };

        document.getElementById("loader").style.display = "block";
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
                // Hide loader and show response
                document.getElementById("loader").style.display = "none";
                document.getElementById("request").style.display = "block";
                document.getElementById("request").innerHTML =
                    "<span>User Input: </span>" + userInput;
                document.getElementById("response").style.display = "block";
                document.getElementById("response").innerHTML =
                    "<span>Answer: </span>" + data.answer;
                // Clear the input field
                document.getElementById("userInput").value = "";
                sendButton.removeAttribute("disabled");

            })
            .catch((error) => {
                console.error("Error:", error);
                // Hide loader and show error message
                document.getElementById("loader").style.display = "none";
                document.getElementById("response").style.display = "block";
                document.getElementById("response").textContent =
                    "API Request failed.";
            });
    }
}

document
    .getElementById("uploadButton")
    .addEventListener("click", function () {
        const fileInput = document.getElementById("csvFile");
        const file = fileInput.files[0];

        if (!file) {
            alert("Please select a CSV file to upload.");
            return;
        }

        if (file.name.endsWith(".csv")) {
            const reader = new FileReader();

            reader.onload = function (event) {
                csvData = event.target.result;
                console.log("CSV Data:", csvData);
                // Show a success message
                alert("CSV file uploaded successfully!");
            };

            reader.readAsText(file);
        } else {
            alert("Please upload a CSV file.");
        }
    });

document
    .getElementById("sendButton")
    .addEventListener("click", function () {
        sendMessage();
    });