const cube = document.querySelector(".cube");
let xRotation = 0;
let yRotation = 0;

function animateCube() {
  xRotation += 1;
  yRotation += 1;
  cube.style.transform = `rotateX(${xRotation}deg) rotateY(${yRotation}deg)`;

  requestAnimationFrame(animateCube);
}

requestAnimationFrame(animateCube);
