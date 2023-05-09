const bedroomLamp = document.getElementById("light-bedroom");
const bedroom = document.getElementById("bedroom");
const bathroom = document.getElementById("bathroom");
// Obtén el contenedor del video y el elemento de video
const videoContainer = document.getElementById("video-container");
const videoElement = document.getElementById("video-element");
// Solicita acceso a la cámara del usuario
const startCamera = () => {
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then(function (stream) {
      // Muestra el video en el elemento de video

      videoElement.srcObject = stream;
      videoElement.play();

      // Inserta el elemento de video dentro del contenedor
      videoContainer.appendChild(videoElement);
    })
    .catch(function (error) {
      console.error("Error al obtener acceso a la cámara:", error);
    });
};

const stopCamera = () => {
  if (videoElement.srcObject) {
    videoElement.pause();
    videoElement.srcObject = null;
  }
};
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
      recognition.continuous = true;

      // Handle recognition events
      recognition.addEventListener("result", function (event) {
        console.log(event);
        // TODO Quitar caracteres especiales, tildes!
        const text = event.results[event.results.length - 1][0].transcript; // Hola Javier, prende la luz por favor
        console.log(text);
        // Si text incluye "prende la luz"
        // Entonces prende la luz
        if (text.includes("prende la luz de la habitación")) {
          bedroom.classList.add("lights-on");
          bedroomLamp.classList.add("light-room--on");
        } else if (text.includes("apaga la luz de la habitación")) {
          bedroom.classList.remove("lights-on");
          bedroomLamp.classList.remove("light-room--on");
        } else if (text.includes("prende la luz del baño")) {
          bathroom.classList.add("lights-on");
        } else if (text.includes("apaga la luz del baño")) {
          bathroom.classList.remove("lights-on");
        } else if (text.includes("prende la cámara")) {
          startCamera();
        } else if (text.includes("apaga la cámara")) {
          stopCamera();
        }
        console.log("Recognized text:", text);

        // Do something with the recognized text, such as toggling lights on and off
      });

      recognition.start();

      // Get the start and stop buttons
      const startButton = document.getElementById("start-button");
      const stopButton = document.getElementById("stop-button");
    } catch (error) {}
  })
  .catch(function (error) {
    console.error("Error getting user media:", error);
  });
