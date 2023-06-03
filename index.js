const roomsIds = [
  "bathroomBedroomOne",
  "bathroomBedroomTwo",
  "mainBedroom",
  "bedroomTwo",
  "bedroomThree",
  "hall",
  "kitchen",
  "livingRoom",
  "laundry",
  "balcony",
];

const doorsAndWindowsIds = [
  "principalDoor",
  "bathroomBedroomOneDoor",
  "bathroomBedroomTwoDoor",
  "mainBedroomDoor",
  "bedroomTwoDoor",
  "bedroomThreeDoor",
  "balconyDoor",
  "laundryDoor",
  "mainBedroomWindow",
  "bedroomTwoWindow",
  "kitchenWindow",
  "livingRoomWindow",
];

var nombreInput = document.getElementById("nombreInput");
var lucesCheckbox = document.getElementById("lucesCheckbox");
var puertasCheckbox = document.getElementById("puertasCheckbox");
var cameraCheckbox = document.getElementById("cameraCheckbox");
var reconocimientoCheckbox = document.getElementById("reconocimientoCheckbox");

const rooms = {};
const doorsAndWindows = {};

roomsIds.forEach((roomId) => {
  rooms[roomId] = document.getElementById(roomId);
});

doorsAndWindowsIds.forEach((doorsAndWindowsId) => {
  doorsAndWindows[doorsAndWindowsId] =
    document.getElementById(doorsAndWindowsId);
});

let cameraStatus = false;

function guardarConfiguracion() {
  var nombreUsuario = nombreInput.value;
  var lucesActivadas = lucesCheckbox.checked;
  var puertasAbiertas = puertasCheckbox.checked;
  var reconocimientoActivado = reconocimientoCheckbox.checked;
  var cameraActivada = cameraCheckbox.checked;

  // Aquí puedes hacer lo que necesites con las configuraciones guardadas y el nombre del usuario

  var panel = document.getElementById("panel");
  panel.style.display = "none";

  // Reproducir el nombre del usuario en forma de mensaje de voz
  var mensajeVoz = new SpeechSynthesisUtterance();
  mensajeVoz.text =
    "Hola " + nombreUsuario + ", tu configuración ha sido guardada.";
  speechSynthesis.speak(mensajeVoz);

  if (cameraActivada) {
    // Resto del código relacionado con la cámara
    startCamera(cameraActivada);
  }
  if (lucesActivadas) {
    funtionLight(lucesActivadas);
  }
  if (puertasAbiertas) {
    funtionDoors(puertasAbiertas);
  }
  window.onload = function () {
    var panel = document.getElementById("panel");
    panel.style.display = "flex";
  };
}
// Obtén el contenedor del video y el elemento de video
const videoContainer = document.getElementById("video-container");
const videoElement = document.getElementById("video-element");
const modalElement = document.getElementById("modal");
const modalTextElement = document.getElementById("modalText");

// Solicita acceso a la cámara del usuario

const startCamera = (cameraActivada) => {
  if (cameraActivada) {
    // Cargar el modelo de detección de objetos
    cocoSsd.load().then((model) => {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(function (stream) {
          // Muestra el video en el elemento de video

          videoElement.srcObject = stream;
          videoElement.play();

          // Inserta el elemento de video dentro del contenedor
          videoContainer.appendChild(videoElement);
          cameraStatus = true;
          setInterval(() => {
            model.detect(videoElement).then((predictions) => {
              console.log(predictions);
              // Verificar si se detectó un perro o un humano
              const hasDog = predictions.some(
                (prediction) => prediction.class === "dog"
              );
              const hasPerson = predictions.some(
                (prediction) => prediction.class === "person"
              );

              // Mostrar el modal y reproducir la voz si se detecta un perro o un humano
              if (hasDog || hasPerson) {
                modalTextElement.textContent = `${hasDog ? "Perro " : ""}${
                  hasDog && hasPerson ? "y " : ""
                }${hasPerson ? "Humano" : ""} detectado`;
                modalElement.style.display = "block";

                // Reproducir voz
                const utterance = new SpeechSynthesisUtterance(
                  modalTextElement.textContent
                );
                speechSynthesis.speak(utterance);
              } else {
                modalElement.style.display = "none";
              }
            });
          }, 5000);
        })
        .catch(function (error) {
          console.error("Error al obtener acceso a la cámara:", error);
        });
    });
  }
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
        // Si text incluye "prende la luz"
        // Entonces prende la luz
        let actionType = "";
        let action = "";
        let elementId = "";

        console.log(text);

        const activationWords =
          /(enciende|prende|prenda|ilumina|encender|activa|activar)/i;

        const deactivationWords =
          /(apaga|apagar|oscurece|oscurecer|desactiva|desactivar)/i;

        if (deactivationWords.test(text)) {
          actionType = "light";
          action = "remove";
        } else if (activationWords.test(text)) {
          actionType = "light";
          action = "add";
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
              if (roomId.includes("Door")) {
                doorsAndWindows[roomId].classList[action]("open");
              }
            });
          } else if (text.includes("todas las ventanas")) {
            Object.keys(doorsAndWindows).forEach((roomId) => {
              if (roomId.includes("Window")) {
                doorsAndWindows[roomId].classList[action]("open");
              }
            });
          }

          if (elementId) {
            if (text.includes("puerta principal")) {
              doorsAndWindows[elementId].classList[action]("open");
            } else if (text.includes("puerta")) {
              elementId += "Door";
            } else if (text.includes("ventana")) {
              elementId += "Window";
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

const saveName = () => {
  const input = document.getElementById("MyNameIs");
  const name = input.value;
  console.log(name);
  if (name.length > 4) {
    const textSpeech = `Hola mi nombre es ${name} pero todos me dicen Giorgio`;
    const utterance = new SpeechSynthesisUtterance(textSpeech);
    speechSynthesis.speak(utterance);
    input.value = "";
  }
};

const toggleCamera = () => {
  if (cameraStatus) {
    stopCamera();
  } else {
    startCamera();
  }
};

let funtionLight = (lucesActivadas) => {
  if (lucesActivadas) {
    toggleLight = (roomId) => {
      rooms[roomId].classList.toggle("lights-on");
    };
  }
};

let funtionDoors = (puertasAbiertas) => {
  if (puertasAbiertas) {
    toggleDoorsAndWindows = (roomId) => {
      doorsAndWindows[roomId].classList.toggle("open");
    };
  }
};

const hideModal = () => {
  modalElement.style.display = "none";
};
