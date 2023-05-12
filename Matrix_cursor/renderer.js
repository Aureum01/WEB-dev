const cube = document.querySelector(".cube");
let xRotation = 0;
let yRotation = 0;
let randomRotation = true;

function animateCube() {
  if (randomRotation) {
    xRotation += 1;
    yRotation += 1;
  }
  cube.style.transform = `rotateX(${xRotation}deg) rotateY(${yRotation}deg)`;

  requestAnimationFrame(animateCube);
}

animateCube();

cube.addEventListener("mousedown", (e) => {
  randomRotation = false;
  const startX = e.clientX;
  const startY = e.clientY;

  function onMouseMove(e) {
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    xRotation += dy * 0.5;
    yRotation += dx * 0.5;
  }

  function onMouseUp() {
    randomRotation = true;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  }

  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
});

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const audioInput = document.getElementById("song-input");

audioInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    audioContext.decodeAudioData(e.target.result, (buffer) => {
      const source = audioContext.createBufferSource();
      const analyser = audioContext.createAnalyser();

      source.buffer = buffer;
      source.connect(analyser);
      analyser.connect(audioContext.destination);
      source.start(0);

      const beatThreshold = 0.1; // Increase or decrease this value to adjust beat detection sensitivity
      const frequencyData = new Uint8Array(analyser.frequencyBinCount);

      function checkBeat() {
        analyser.getByteFrequencyData(frequencyData);
        const average = frequencyData.reduce((a, b) => a + b) / frequencyData.length;

        if (average > beatThreshold) {
          cube.classList.add("beat");
        } else {
          cube.classList.remove("beat");
        }

        requestAnimationFrame(checkBeat);
      }

      checkBeat();
    });
  };
  reader.readAsArrayBuffer(file);
});
