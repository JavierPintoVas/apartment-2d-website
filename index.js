const myBulb = document.getElementById("myBulb");
// Request permission to use the microphone
navigator.mediaDevices
  .getUserMedia({ audio: true })
  .then(function (stream) {
    try {
      // Create a new SpeechRecognition object
      const recognition = new window.webkitSpeechRecognition();
      console.log(recognition);
      // Configure the recognition object
      recognition.lang = "es-US";

      // Handle recognition events
      recognition.addEventListener("result", function (event) {
        const text = event.results[0][0].transcript; // Hola Javier, prende la luz por favor
        recognition.stop();
        // Si text incluye "prende la luz"
        // Entonces prende la luz
        if (text.includes("prende la luz")) {
          myBulb.style.backgroundColor = "yellow";
        } else if (text.includes("apaga la luz")) {
          myBulb.style.backgroundColor = "black";
        } else {
          alert("no reconoci el comando");
        }
        console.log("Recognized text:", text);

        // Do something with the recognized text, such as toggling lights on and off
      });

      // Get the start and stop buttons
      const startButton = document.getElementById("start-button");
      const stopButton = document.getElementById("stop-button");

      // Add event listeners to the buttons
      startButton.addEventListener("click", function () {
        console.log("Start");
        recognition.start();
      });

      stopButton.addEventListener("click", function () {
        console.log("Close");
        recognition.stop();
      });
    } catch (error) {}
  })
  .catch(function (error) {
    console.error("Error getting user media:", error);
  });
