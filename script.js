let socket;
let statusElement = document.getElementById('connectionStatus');
let accelDataElement = document.getElementById('accelData');
let accelData = { x: 0, y: 0, z: 0 };  // Initialize accelerometer data

// Function to establish WebSocket connection
function connectWebSocket() {
    const port = 7890; // Match this with the port used in Unity
    const webSocketURL = `ws://${window.location.hostname}:${port}/game`; 

    socket = new WebSocket(webSocketURL);  // Adjust this if your Unity server is on a different port or IP

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
function sendToUnity() {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(accelData));
        console.log('Data sent to Unity:', accelData);
    }
}

// Event listener for accelerometer data
window.addEventListener("devicemotion", function(event) {
    const acceleration = event.accelerationIncludingGravity;

    // Update the accelerometer data
    accelData.x = acceleration.x || 0;  // Default to 0 if undefined
    accelData.y = acceleration.y || 0;  // Default to 0 if undefined
    accelData.z = acceleration.z || 0;  // Default to 0 if undefined

    // Display the accelerometer data on the page
    accelDataElement.textContent = `X: ${accelData.x.toFixed(2)}, Y: ${accelData.y.toFixed(2)}, Z: ${accelData.z.toFixed(2)}`;
});

// Establish WebSocket connection on page load
window.onload = function() {
    connectWebSocket();
    
    // Send data every 100 ms
    setInterval(sendToUnity, 100);
    console.log("WebSocket client is ready.");
};
