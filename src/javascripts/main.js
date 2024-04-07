import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'

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

let  mtlLoader = new THREE.MTLLoader();
mtlLoader.load('Town.mtl', function (MazeMaterials) {
    MazeMaterials.preload();

    let objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(MazeMaterials);
    objLoader.setPath('src/objects/');
    objLoader.load('MazeTown1.obj', function (mazeObject){
        mazeObject.position.y = 0;
        scene.add(mazeObject)
    });
});



let axes = new THREE.AxesHelper(10)
scene.add(axes)

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

// Floor
let floorGeo = new THREE.PlaneGeometry(50, 35)
let floorMat = new THREE.MeshPhongMaterial()

let floor = new THREE.Mesh(floorGeo, floorMat)

floor.position.set(0, 0, 0)
floor.material.color = new THREE.Color(1, 0, 1)
floor.rotateX(-Math.PI / 2)
scene.add(floor)

// Render
function animate() {
    camera.position.x = controls.radius * Math.sin(controls.theta) * Math.cos(controls.phi)
    camera.position.y = controls.radius * Math.cos(controls.theta)
    camera.position.z = controls.radius * Math.sin(controls.theta) * Math.sin(controls.phi)

    camera.lookAt(scene.position)
    renderer.render(scene, camera)
    cameraControls.update()
}

animate()