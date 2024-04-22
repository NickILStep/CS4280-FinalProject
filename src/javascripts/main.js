import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { Water } from 'three/examples/jsm/objects/Water2'

// Required by Webpack - do not touch
require.context('../', true, /\.(html|json|txt|dat)$/i)
require.context('../images/', true, /\.(gif|jpg|png|svg|eot|ttf|woff|woff2)$/i)
require.context('../stylesheets/', true, /\.(css|scss)$/i)

// First: Set up your name
let std_name = "Chance Hardman & Nicholas Stephenson"
document.querySelector('#std_name').innerHTML = `<strong>${std_name}</strong>`

//Then: comes everything else

// Setup and controls
let canvas = document.querySelector('#webgl-scene')
let scene = new THREE.Scene()
let renderer = new THREE.WebGLRenderer({canvas})
let camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientWidth, .1, 1000)

renderer.setSize(canvas.clientWidth, canvas.clientHeight)
renderer.setClearColor(0xEEEEEE)

// Loading textures
let texLoader = new THREE.TextureLoader()
let textures = {
    basketball: texLoader.load('./images/Basketball.png', function(){
        renderer.render(scene, camera)
    }),
    waterPaint: texLoader.load('./images/waterPaint.jpg', function(){
        renderer.render(scene, camera)
    }),
    water1: texLoader.load('./images/water_normal_1.jpg', function(){
        renderer.render(scene, camera)
    }),
    water2: texLoader.load('./images/water_normal_2.jpg', function(){
        renderer.render(scene, camera)
    })

}

let speed = 0.04;

let cameraControls = new OrbitControls(camera, renderer.domElement)

// Lighting
let ambientLight = new THREE.AmbientLight(0xFFFFFF)
ambientLight.intensity = .9
scene.add(ambientLight)

// Water Floor
let floorGeo = new THREE.PlaneGeometry(100, 100)
let floorMat = new THREE.MeshPhongMaterial({
    map: textures['waterPaint'] // Apply water paint texture
});

let floor = new THREE.Mesh(floorGeo, floorMat)

floor.position.set(0, 0.186, 0)
//floor.material.color = new THREE.Color(0, .5, .8)

floor.rotateX(-Math.PI / 2)
scene.add(floor)

//Water Texture
let waterGeometry = new THREE.PlaneBufferGeometry(500, 300)
let water = new Water(waterGeometry, {
    color: '#FFFFFF',
    scale: 4,
    flowDirection: new THREE.Vector2(1, 1),
    textureWidth: 1024,
    textureHeight: 1024,
    normalMap0: textures['water1'],
    normalMap1: textures['water2']
})

water.position.y = 0.187
water.rotation.x = Math.PI * -0.5;
scene.add(water)


// Ball
let ballGeo = new THREE.SphereBufferGeometry(.1, 40, 40)
let ballMat = new THREE.MeshPhongMaterial({
    map: textures['basketball'] // Apply water paint texture
});

let ball = new THREE.Mesh(ballGeo, ballMat)

ball.position.set(7.5, .7, 13)
ball.name = 'ball'


scene.add(ball)

// Maze
let mtl_file = './models/Town.mtl';
let obj_file = './models/MazeTown1.obj';

let  mtlLoader = new MTLLoader();
mtlLoader.load(
    mtl_file,
    function (materials) {
        materials.preload();

        var objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.load(
            obj_file,
            function (object){
                object.name = 'maze'
                scene.add(object);
            }
        );
    }
);


// Render
var won = false;

function updateCamera() {
    // Set camera position relative to the ball
    camera.position.set(ball.position.x, ball.position.y + 10, ball.position.z);

    // Make the camera look at the ball
    camera.lookAt(ball.position);
}

function animate() {

    updateCamera();
    renderer.render(scene, camera)
    cameraControls.update()


    requestAnimationFrame(animate)
    requestAnimationFrame(executeMovement)

    if (ball.position.x < -14.75 && ball.position.z < -8 && !won) {
        window.alert("You Win!");
        won = true;
        speed = 0;
    }


}

window.alert("Reach the tower in the North West corner of the map!");

animate()

var keyMap = [];
document.addEventListener("keydown", onDocumentKeyDown, true);
document.addEventListener("keyup", onDocumentKeyUp, true);

function onDocumentKeyDown(event){
    var keyCode = event.keyCode;
    keyMap[keyCode] = true;
    executeMovement();
}
function onDocumentKeyUp(event){
    var keyCode = event.keyCode;
    keyMap[keyCode] = false;

}
function executeMovement() {

    let movement = new THREE.Vector3(0, 0, 0);

    if (keyMap[87] && !keyMap[83]) {
        movement.z -= speed;
    }
    if (keyMap[83] && !keyMap[87]) {
        movement.z += speed;
    }
    if (keyMap[65] && !keyMap[68]) {
        movement.x -= speed;
    }
    if (keyMap[68] && !keyMap[65]) {
        movement.x += speed;
    }

    // Check if there's a collision before moving the ball
   if (!checkCollision(movement)) {
        ball.position.add(movement);
   }


}

function checkCollision(movement) {
    let mazeObject = scene.getObjectByName('maze');
    if (!mazeObject) return true; // Assume collision if maze object is not found

    let CheckDistance = 0.15; // Set your desired maximum distance for collision detection

    let forwardRaycaster = new THREE.Raycaster(ball.position, movement.clone().normalize());
    forwardRaycaster.far = CheckDistance; // Set the maximum distance for the ray

    let forwardIntersects = forwardRaycaster.intersectObject(mazeObject, true);

    if (forwardIntersects.length > 0) {
        // If collision in forward direction, check if moving backward is possible
        let reverseMovement = movement.clone().multiplyScalar(-1);
        let reverseRaycaster = new THREE.Raycaster(ball.position, reverseMovement.clone().normalize());
        reverseRaycaster.far = maxDistance; // Set the maximum distance for the reverse ray
        let reverseIntersects = reverseRaycaster.intersectObject(mazeObject, true);
        return reverseIntersects.length > 0;
    }

    // No collision detected in the forward direction
    return false;
}
