const bathroomBedroomOne = document.getElementById("bathroomBedroomOne");
const bathroomBedroomTwo = document.getElementById("bathroomBedroomTwo");
const mainBedroom = document.getElementById("mainBedroom");
const bedroomTwo = document.getElementById("bedroomTwo");
const bedroomThree = document.getElementById("bedroomThree");
const hall = document.getElementById("hall");
const kitchen = document.getElementById("kitchen");
const livingRoom = document.getElementById("livingRoom");
const laundry = document.getElementById("laundry");
const balcony = document.getElementById("balcony");

const principalDoor = document.getElementById("principalDoor");
const bathroomBedroomOneDoor = document.getElementById(
  "bathroomBedroomOneDoor"
);
const bathroomBedroomTwoDoor = document.getElementById(
  "bathroomBedroomTwoDoor"
);
const mainBedroomDoor = document.getElementById("mainBedroomDoor");
const bedroomTwoDoor = document.getElementById("bedroomTwoDoor");
const bedroomThreeDoor = document.getElementById("bedroomThreeDoor");
const balconyDoor = document.getElementById("balconyDoor");
const laundryDoor = document.getElementById("laundryDoor");

let cameraStatus = false;

const rooms = {
  bathroomBedroomOne,
  bathroomBedroomTwo,
  bedroomTwo,
  bedroomThree,
  mainBedroom,
  hall,
  kitchen,
  livingRoom,
  laundry,
  balcony,
};

const doorsAndWindows = {
  principalDoor,
  bathroomBedroomOneDoor,
  bathroomBedroomTwoDoor,
  mainBedroomDoor,
  bedroomTwoDoor,
  bedroomThreeDoor,
  balconyDoor,
  laundryDoor,
};

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
      cameraStatus = true;
    })
    .catch(function (error) {
      console.error("Error al obtener acceso a la cámara:", error);
    });
};

const stopCamera = () => {
  if (videoElement.srcObject) {
    videoElement.pause();
    videoElement.srcObject = null;
    cameraStatus = false;
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
        const text =
          event.results[event.results.length - 1][0].transcript.toLowerCase(); // Hola Javier, prende la luz por favor
        console.log(text);
        // Si text incluye "prende la luz"
        // Entonces prende la luz
        let actionType = "";
        let action = "";
        let elementId = "";
        let actionDoor = null;

        console.log(text);

        if (
          text.includes("enciende") ||
          text.includes("prende") ||
          text.includes("prenda") ||
          text.includes("ilumina") ||
          text.includes("encender")
        ) {
          actionType = "light";
          action = "add";
        } else if (
          text.includes("apaga") ||
          text.includes("apagar") ||
          text.includes("oscurece") ||
          text.includes("oscurecer")
        ) {
          actionType = "light";
          action = "remove";
        } else if (text.includes("abre") || text.includes("abrir")) {
          actionType = "doorsAndWindows";
          action = "add";
        } else if (text.includes("cierra") || text.includes("cerrar")) {
          actionType = "doorsAndWindows";
          action = "remove";
        }

        if (action != null) {
          if (text.includes("habitación")) {
            if (text.includes("uno") || text.includes("principal")) {
              elementId = "mainBedroom";
            } else if (text.includes("dos") || text.includes("segunda")) {
              elementId = "bedroomTwo";
            } else if (text.includes("tres") || text.includes("tercera")) {
              elementId = "bedroomThree";
            }
          } else if (text.includes("baño")) {
            if (text.includes("uno") || text.includes("principal")) {
              elementId = "bathroomBedroomOne";
            } else if (
              text.includes("dos") ||
              text.includes("social") ||
              text.includes("pasillo")
            ) {
              elementId = "bathroomBedroomTwo";
            }
          } else if (text.includes("cocina")) {
            elementId = "kitchen";
          } else if (text.includes("sala")) {
            elementId = "livingRoom";
          } else if (text.includes("pasillo")) {
            elementId = "hall";
          } else if (text.includes("lavandería")) {
            elementId = "laundry";
          } else if (text.includes("balcón")) {
            elementId = "balcony";
          } else if (text.includes("cámara")) {
            if (action === "add") {
              startCamera();
            } else if (action === "remove") {
              stopCamera();
            }
          } else if (text.includes("todas las luces")) {
            Object.keys(rooms).forEach((roomId) => {
              rooms[roomId].classList[action]("lights-on");
            });
          } else if (text.includes("puerta principal")) {
            elementId = "principalDoor";
          } else if (text.includes("todas las puertas")) {
            Object.keys(doorsAndWindows).forEach((roomId) => {
              doorsAndWindows[roomId].classList[action]("open");
            });
          }

          if (elementId) {
            if (text.includes("puerta principal")) {
              doorsAndWindows[elementId].classList[action]("open");
            } else if (text.includes("puerta")) {
              elementId += "Door";
            }
          }
        }

        console.log(action);
        console.log(actionType);
        console.log(elementId);

        if (action && actionType && elementId) {
          if (actionType === "light") {
            rooms[elementId].classList[action]("lights-on");
          } else if (actionType === "doorsAndWindows") {
            doorsAndWindows[elementId].classList[action]("open");
          }
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

const toggleCamera = () => {
  if (cameraStatus) {
    stopCamera();
  } else {
    startCamera();
  }
};

const toggleLight = (roomId) => {
  rooms[roomId].classList.toggle("lights-on");
};
