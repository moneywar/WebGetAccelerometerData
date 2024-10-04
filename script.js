let socket;
let statusElement = document.getElementById('connectionStatus');
let accelDataElement = document.getElementById('accelData');

// Function to establish WebSocket connection
function connectWebSocket() {
    socket = new WebSocket('ws://192.168.216.146:8080/game');  // Adjust this if your Unity server is on a different port or IP

    socket.onopen = function() {
        statusElement.textContent = 'WebSocket Connected';
        statusElement.className = 'status connected';
    };

    socket.onerror = function(error) {
        console.log('WebSocket error: ', error);
    };

    socket.onclose = function() {
        statusElement.textContent = 'WebSocket Disconnected';
        statusElement.className = 'status disconnected';
    };

    socket.onmessage = function(event) {
        console.log('Message from Unity: ', event.data);
    };
}

// Function to send accelerometer data to Unity
function sendToUnity(accelData) {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(accelData));
        console.log('Data sent to Unity:', accelData);
    }
}

// Event listener for accelerometer data
window.addEventListener("devicemotion", function(event) {
    const acceleration = event.accelerationIncludingGravity;
    const accelData = {
        x: acceleration.x,
        y: acceleration.y,
        z: acceleration.z
    };

    // Display the accelerometer data on the page
    accelDataElement.textContent = `X: ${accelData.x.toFixed(2)}, Y: ${accelData.y.toFixed(2)}, Z: ${accelData.z.toFixed(2)}`;

    // Send the data to Unity
    sendToUnity(accelData);
});

// Establish WebSocket connection on page load
window.onload = function() {
    connectWebSocket();
};
