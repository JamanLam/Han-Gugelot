//Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

//Create a Three.JS Scene
const scene = new THREE.Scene();
//create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 3000);

//Keep the 3D object on a global variable so we can access it later
let object;

//OrbitControls allow the camera to move around the scene
let controls;

//Set which object to render
let objToRender = 'sk4';

//Instantiate a loader for the .gltf file
const loader = new GLTFLoader();

//Keep track of the mouse position, so we can make the eye move
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

//Load the file
loader.load(
  `models/${objToRender}/scene.gltf`,
  function (gltf) {
    //If the file is loaded, add it to the scene
    object = gltf.scene;
    scene.add(object);
  },
  function (xhr) {
    //While it is loading, log the progress
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    //If there is an error, log it
    console.error(error);
  }
);



//Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true }); //Alpha: true allows for the transparent background
renderer.setSize(window.innerWidth, window.innerHeight) ;

//Add the renderer to the DOM
document.getElementById("container3D").appendChild(renderer.domElement);

//Set how far the camera will be from the 3D model
camera.position.z = objToRender === "dino" ? 25 : 500;

//Add lights to the scene, so we can actually see the 3D model
const topLight = new THREE.DirectionalLight(0xffffff, 5); // (color, intensity)
 //top-left-ish
topLight.position.set(500, 800, 500)
topLight.castShadow = true;

const sideLight = new THREE.DirectionalLight(0xffffff, 1); // (color, intensity)
 sideLight.position.set(400, 50, 500)
 sideLight.castShadow = true;
 sideLight.penumbra = 0.5; // Soft edge

scene.add(sideLight);

const skyColor = 0xffffff; // light orange
const groundColor = 0xffffff; // brown
const hemisphereLight = new THREE.HemisphereLight(skyColor, groundColor, 1);
scene.add(hemisphereLight);

const ambientLight = new THREE.AmbientLight(0x333333, objToRender === "sk4" ? 2 : 1);
scene.add(ambientLight);


//Render the scene
function animate() {
  requestAnimationFrame(animate);
  //Here we could add some code to update the scene, adding some automatic movement
  const time = Date.now() * 0.001;
  //Make the eye move
  if (object && objToRender === "sk4") {
    //I've played with the constants here until it looked good 
    object.rotation.y = -.8 + Math.sin(time) * 0.04;
    object.rotation.x = .32;
    object.rotation.z = -.2;
    object.position.y = 5;
    object.position.x = 32;
  }
  renderer.render(scene, camera);
}

//This adds controls to the camera, so we can rotate / zoom it with the mouse
if (objToRender === "sk4") {
  controls = new OrbitControls(camera, renderer.domElement);
}


//Add a listener to the window, so we can resize the window and the camera
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

//add mouse position listener, so we can make the eye move
document.onmousemove = (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
}


//Start the 3D rendering
animate();

const openButton = document.querySelector('.features');
const overlay = document.querySelector('.overlay');

openButton.addEventListener('click', () => {
  overlay.style.transform = 'translateX(100%)';
});

const backButton = document.querySelector('.back');

backButton.addEventListener('click', () => {
  overlay.style.transform = 'translateX(-100%)';
});

function goBack() {
  window.history.back();
}


const carousel = document.querySelector('.carousel');
const carouselItems = document.querySelectorAll('.carousel-item');
const prevButton = carousel.querySelector('.carousel-control-prev');
const nextButton = carousel.querySelector('.carousel-control-next');
let currentIndex = 0;

function showSlide(index) {
  carouselItems.forEach(item => item.classList.remove('active'));
  carouselItems[index].classList.add('active');
}

function nextSlide() {
  currentIndex++;
  if (currentIndex >= carouselItems.length) {
    currentIndex = 0;
  }
  showSlide(currentIndex);
}

function prevSlide() {
  currentIndex--;
  if (currentIndex < 0) {
    currentIndex = carouselItems.length - 1;
  }
  showSlide(currentIndex);
}

prevButton.addEventListener('click', prevSlide);
nextButton.addEventListener('click', nextSlide);
