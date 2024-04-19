import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';

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

// let axes = new THREE.AxesHelper(10)
// scene.add(axes)

let cameraControls = new OrbitControls(camera, renderer.domElement)
// cameraControls.addEventListener("change", function(){
//     renderer.render(scene, camera)
// })

let controls = {
    radius: 10,
    theta: 1,
    phi: 1
}

// Lighting
let ambientLight = new THREE.AmbientLight(0xFFFFFF)
ambientLight.intensity = .9
scene.add(ambientLight)

// Ball
let ballGeo = new THREE.SphereBufferGeometry(.2, 40, 40)
let ballMat = new THREE.MeshPhongMaterial()

let ball = new THREE.Mesh(ballGeo, ballMat)

ball.position.set(7.5, 1, 13)
ball.material.color = new THREE.Color(0, .8, .8)
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
var won = false;

function animate() {
    camera.position.x = controls.radius * Math.sin(controls.theta) * Math.cos(controls.phi)
    camera.position.y = controls.radius * Math.cos(controls.theta)
    camera.position.z = controls.radius * Math.sin(controls.theta) * Math.sin(controls.phi)

    camera.position.set(ball.position.x, ball.position.y + 10, ball.position.z)
    camera.lookAt(ball.position)
    renderer.render(scene, camera)
    cameraControls.update()

    requestAnimationFrame(animate)

    if (ball.position.x < -14 && ball.position.z < -8 && !won) {
        window.alert("You Win!");
        won = true;
    }
}

window.alert("Reach the tower in the North West corner of the map!");

animate()

document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event){
    var keyCode = event.which;
    var speed = .5;

    if (keyCode === 87) {
        ball.position.z -= speed;
    }
    else if (keyCode === 83) {
        ball.position.z += speed;
    }
    else if (keyCode === 65) {
        ball.position.x -= speed;
    }
    else if (keyCode === 68) {
        ball.position.x += speed;
    }

    console.log(ball.position)
}

