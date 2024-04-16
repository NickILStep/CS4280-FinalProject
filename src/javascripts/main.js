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


//Camera
let cameraControls = new OrbitControls(camera, renderer.domElement)
cameraControls.addEventListener("change", function(){
    renderer.render(scene, camera)
})

let controls = {
    radius: 400,
    theta: 1,
    phi: 1
}

// Lighting
let ambientLight = new THREE.AmbientLight(0xFFFFFF)
ambientLight.intensity = .9
scene.add(ambientLight)

// Ball
let ballGeo = new THREE.SphereBufferGeometry(2.5, 40, 40)
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

    //if a and not d then rotate x degrees left
    //if a and not d then move position 2piR(x/360) left

    //if d and not a then rotate x degrees right
    //if d and not a then move position 2piR(x/360) right

    //if w and not s then rotate x degrees forward
    //if w and not s then move position 2piR(x/360) forward

    //if s and not w then rotate x degrees backward
    //if s and not w then move position 2piR(x/360) backward





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