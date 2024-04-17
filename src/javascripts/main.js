import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';

// Required by Webpack - do not touch
require.ncontext('../', true, /\.(html|json|txt|dat)$/i)
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

let axes = new THREE.AxesHelper(10)
scene.add(axes)

//ball radius variable for easy control
let ballRadius = 2.5;


//keyboard
let keyboard = {};

//Camera
let cameraControls = new OrbitControls(camera, renderer.domElement)
cameraControls.addEventListener("change", function(){
    renderer.render(scene, camera)
})

let controls = {
    radius: 400,
    theta: 1,
    phi: 1,
    rotationSpeed: 1
}

// Lighting
let ambientLight = new THREE.AmbientLight(0xFFFFFF)
ambientLight.intensity = .9
scene.add(ambientLight)

// Ball
let ballGeo = new THREE.SphereBufferGeometry(ballRadius, 40, 40)
let ballMat = new THREE.MeshPhongMaterial()

let ball = new THREE.Mesh(ballGeo, ballMat)

ball.position.set(-3, 2.5, -.5)
ball.material.color = new THREE.Color(0, .8, .8)
scene.add(ball)

// Maze
let mtl_file = './models/Town.mtl';
let obj_file = './models/MazeTown1.obj';

let  mtlLoader = new MTLLoader();
// mtlLoader.setPath('src/textures');
mtlLoader.load(
    mtl_file,
    function (materials) {
        materials.preload();

        var objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        // objLoader.setPath('src/objects/');
        objLoader.load(
            obj_file,
            function (object){
                object.name = 'maze'
                scene.add(object);
            }
        );
    }
);

// ------------ Professor's code ------------------
// let mtl_file = './models/pokemon/charizar.mtl';
// let obj_file = './models/pokemon/charizar.obj';
//
// var mtlLoader = new MTLLoader();
// mtlLoader.load(mtl_file,
//     function(materials){
//
//         materials.preload()
//
//         var objLoader = new OBJLoader();
//         objLoader.setMaterials(materials)
//         objLoader.load(
//             obj_file,
//             function (object){
//                 object.name = 'charizard'
//                 scene.add(object);
//             });
//     });
// ------------------------------------------------

// Render
function animate() {


    //psuecode for ball moving R = ball.radius
    //keyboard[87] W key
    //keyboard[83] S key
    //keyboard[65] A key
    //keyboard[68] D key


    if(keyboard[65] && !keyboard[83]) { // A key and not D
    //rotate x degrees left
    ball.rotation.x -= controls.rotationSpeed
    //move position 2piR(x/360) left
    ball.position.x -= 2 * Math.PI * ballRadius * (controls.rotationSpeed/360)
    }

    if(keyboard[68] && !keyboard[65]) { // D key and not A
    //rotate x degrees right
    ball.rotation.x += controls.rotationSpeed
    //move position 2piR(x/360) right
    ball.position.x += 2 * Math.PI * ballRadius * (controls.rotationSpeed/360)
    }

    if(keyboard[87] && !keyboard[83]) { // W key and not S
    //rotate x degrees forward
    ball.rotation.y += controls.rotationSpeed
    //move position 2piR(x/360) forward
    ball.position.y += 2 * Math.PI * ballRadius * (controls.rotationSpeed/360)
    }

    if(keyboard[83] && !keyboard[87]) { // S key and not W
    //rotate x degrees backward
    ball.rotation.y -= controls.rotationSpeed
    //move position 2piR(x/360) backward
    ball.position.y -= 2 * Math.PI * ballRadius * (controls.rotationSpeed/360)
    }




    camera.position.x = controls.radius * Math.sin(controls.theta) * Math.cos(controls.phi)
    camera.position.y = controls.radius * Math.cos(controls.theta)
    camera.position.z = controls.radius * Math.sin(controls.theta) * Math.sin(controls.phi)
    //camera.position.x = ball.position.x
    //camera.position.y = ball.position.y
    //camera.position.z = ball.position.z + controls.radius

    camera.lookAt(scene.position)
    //camera.lookAt(ball.position)
    renderer.render(scene, camera)
    //remove line
    cameraControls.update()
}

animate()

function keyDown(event){
    keyboard[event.keyCode] = true;
}

function keyUp(event){
    keyboard[event.keyCode] = false;
}

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);