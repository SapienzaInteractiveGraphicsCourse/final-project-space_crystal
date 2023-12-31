import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

var space;
var space_station;

var torus;
var crystal_base;
var crystal;
var stand;

var figure_model;
var figure;

var torso;
var rightUpperLeg;
var rightLowerLeg; 
var leftUpperLeg;
var leftLowerLeg;
var rightUpperArm;
var rightLowerArm;
var leftUpperArm;
var leftLowerArm;

var drone_1;
var drone_2;
var drone_3;
var drone_4;

var ambientLight;
var directionalLight;

var scene;
var camera;
var renderer;

var orbit;
var keyboard = {};


loadings();

function loadings() {

    const loaderManager = new THREE.LoadingManager();

    loaderManager.onLoad = () => {
        init();
    };

    const spaceTex = new THREE.CubeTextureLoader(loaderManager)
    .setPath('./textures/space/')
    .load(
        [
            'left.png',
            'right.png',
            'top.png',
            'bottom.png',
            'back.png',
            'front.png'
        ],
        (cubeTexture) => {
            space = spaceTex;
        }
    );


    var crystalTex = new THREE.TextureLoader(loaderManager).load('./textures/titan_texture.jpg');

    var crystal_material_inner = new THREE.MeshPhysicalMaterial({
        reflectivity: 1.0,
        map: crystalTex,
        side: THREE.DoubleSide,
        roughness: 0.3,
        metalness: 1.0
    });

    var crystal_material_outer = new THREE.MeshPhysicalMaterial({
        color: 0xa0000,
        reflectivity: 1.0,
        side: THREE.DoubleSide,
        metalness: 1.0
    });
    

    const modelLoader = new GLTFLoader(loaderManager);

    modelLoader.load( './models/space_station/scene.gltf', function (gltf) {
        space_station = gltf.scene;

        space_station.traverse(function (child) {
            if (child.isMesh) {
                space_station.castShadow = true;
                space_station.receiveShadow = true;
            }

            if (child.isMesh && child.name === 'Cube_0') { 
                child.material = crystal_material_inner;
            }

            if (child.isMesh && child.name === 'Cube_1') { 
                child.material = crystal_material_outer;
            }
        });

        torus = space_station.getObjectByName('Torus004'); 
        crystal_base = space_station.getObjectByName('Sphere001');
        crystal = space_station.getObjectByName('Cube'); 

        stand = space_station.getObjectByName('Circle'); 
        stand.position.set(25, -20, 2);
        stand.rotation.set(0, 0, 4);

        drone_1 = space_station.getObjectByName('Cube002');
        drone_1.scale.set(0.5, 0.5, 0.5);
        drone_1.position.set(0, 3, 5)

        drone_2 = space_station.getObjectByName('Cube003');
        drone_2.scale.set(0.5, 0.5, 0.5);
        drone_2.position.set(5, 4, -5)

        drone_3 = space_station.getObjectByName('Cube004');
        drone_3.scale.set(0.5, 0.5, 0.5);
        drone_3.position.set(-5, 5, 0)

        drone_4 = space_station.getObjectByName('Cube005');
        drone_4.scale.set(0.5, 0.5, 0.5);
        drone_4.position.set(5, 6, 5)

    }, undefined, function (error) {

        console.error(error);

    });

    modelLoader.load( './models/figure/scene.gltf', function (gltf) {
        figure_model = gltf.scene;

        figure_model.traverse(function (child) {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        torso = figure_model.getObjectByName('Root');

        rightUpperArm = figure_model.getObjectByName("upperarm_r_F_MED_NeonCat_Body_T_03ao")
        rightLowerArm = figure_model.getObjectByName("lowerarm_r_F_MED_NeonCat_Body_T_03ao")
        leftUpperArm = figure_model.getObjectByName("upperarm_l_F_MED_NeonCat_Body_T_03ao")
        leftLowerArm = figure_model.getObjectByName("lowerarm_l_F_MED_NeonCat_Body_T_03ao")

        rightUpperLeg = figure_model.getObjectByName("thigh_r_F_MED_NeonCat_Body_T_03ao")
        rightLowerLeg = figure_model.getObjectByName('calf_r_F_MED_NeonCat_Body_T_03ao')
        leftUpperLeg = figure_model.getObjectByName("thigh_l_F_MED_NeonCat_Body_T_03ao")
        leftLowerLeg = figure_model.getObjectByName('calf_l_F_MED_NeonCat_Body_T_03ao')

        rightUpperArm.rotation.z += Math.PI * 0.10;
        leftUpperArm.rotation.z -= Math.PI * 0.10;

        rightUpperLeg.rotation.z += Math.PI * 0.17;
        leftUpperLeg.rotation.z -= Math.PI * 0.17;

    }, undefined, function (error) {

        console.error(error);

    });
}

function init() {
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // renderer.setClearColor(0xFEFEFE);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    // Sets orbit control to move the camera around
    orbit = new OrbitControls(camera, renderer.domElement);

    // Camera positioning
    camera.position.set(5, 2, 15);
    orbit.update();

    scene.background = space;

    figure = new THREE.Mesh();
    figure.scale.set(0.025, 0.025, 0.025);
    figure.position.set(2, 0, -9);
    figure.add(figure_model);
    
    scene.add(space_station);
    scene.add(drone_1);
    scene.add(drone_2);
    scene.add(drone_3);
    scene.add(drone_4);
    scene.add(figure);


    ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    ambientLight.position.set(0, 20, 0);
    scene.add(ambientLight);

    const directLight1 = new THREE.DirectionalLight(0xaea04b, 3, 100);
    directLight1.position.set(20, 20, -20);
    directLight1.castShadow = true
    directLight1.shadow.camera.near = 10
    directLight1.shadow.camera.far = 100
    directLight1.shadow.camera.left = -50
    directLight1.shadow.camera.right = 50
    directLight1.shadow.camera.top = 50
    directLight1.shadow.camera.bottom = -50
    scene.add(directLight1);
    
    const directLight2 = new THREE.DirectionalLight(0xaea04b, 3, 100);
    directLight2.position.set(-20, 20, -20);
    directLight2.castShadow = true
    directLight2.shadow.camera.near = 10
    directLight2.shadow.camera.far = 100
    directLight2.shadow.camera.left = -50
    directLight2.shadow.camera.right = 50
    directLight2.shadow.camera.top = 50
    directLight2.shadow.camera.bottom = -50
    scene.add(directLight2);
    
    const directLight3 = new THREE.DirectionalLight(0xaea04b, 3, 100);
    directLight3.position.set(-20, -20, 20);
    directLight3.castShadow = true
    directLight3.shadow.camera.near = 10
    directLight3.shadow.camera.far = 100
    directLight3.shadow.camera.left = -50
    directLight3.shadow.camera.right = 50
    directLight3.shadow.camera.top = 50
    directLight3.shadow.camera.bottom = -50
    scene.add(directLight3);

    const directLight4 = new THREE.DirectionalLight(0xaea04b, 3, 100);
    directLight4.position.set(20, -20, 20);
    directLight4.castShadow = true
    directLight4.shadow.camera.near = 10
    directLight4.shadow.camera.far = 100
    directLight4.shadow.camera.left = -50
    directLight4.shadow.camera.right = 50
    directLight4.shadow.camera.top = 50
    directLight4.shadow.camera.bottom = -50
    scene.add(directLight4);
    

    // User interaction
    document.addEventListener('keydown', function(event) {
        keyboard[event.code] = true;
    });
    document.addEventListener('keyup', function(event) {
        keyboard[event.code] = false;
    });


    // Legs animation
    var frame_time = 500;

    var rightUpperLeg_tween = new TWEEN.Tween(rightUpperLeg.rotation)
    .to({z:rightUpperLeg.rotation.z - Math.PI * 0.30 }, frame_time)
    .easing(TWEEN.Easing.Quadratic.Out)
    .repeat(Infinity)
    .yoyo(true);

    var rightLowerLeg_tween = new TWEEN.Tween(rightLowerLeg.rotation)
    .to({z:rightLowerLeg.rotation.z - Math.PI * 0.15 }, frame_time)
    .easing(TWEEN.Easing.Quadratic.Out)
    .repeat(Infinity)
    .yoyo(true);

    var leftUpperLeg_tween = new TWEEN.Tween(leftUpperLeg.rotation)
    .to({z:leftUpperLeg.rotation.z + Math.PI * 0.30 }, frame_time)
    .easing(TWEEN.Easing.Quadratic.Out)
    .repeat(Infinity)
    .yoyo(true);

    var leftLowerLeg_tween = new TWEEN.Tween(leftLowerLeg.rotation)
    .to({z:leftLowerLeg.rotation.z - Math.PI * 0.15 }, frame_time)
    .easing(TWEEN.Easing.Quadratic.Out)
    .repeat(Infinity)
    .yoyo(true);

    rightUpperLeg_tween.start();
    rightLowerLeg_tween.start(); 
    leftUpperLeg_tween.start();
    leftLowerLeg_tween.start();   


    // Arms animation
    var rightUpperArm_tween = new TWEEN.Tween(rightUpperArm.rotation)
    .to({z: rightUpperArm.rotation.z - Math.PI * 0.10 }, frame_time)
    .easing(TWEEN.Easing.Quadratic.Out)
    .repeat(Infinity)
    .yoyo(true);

    var rightLowerArm_tween = new TWEEN.Tween(rightLowerArm.rotation)
    .to({z: rightLowerArm.rotation.z - Math.PI * 0.10 }, frame_time)
    .easing(TWEEN.Easing.Quadratic.Out)
    .repeat(Infinity)
    .yoyo(true);

    var leftUpperArm_tween = new TWEEN.Tween(leftUpperArm.rotation)
    .to({z: leftUpperArm.rotation.z + Math.PI * 0.10 }, frame_time)
    .easing(TWEEN.Easing.Quadratic.Out)
    .repeat(Infinity)
    .yoyo(true);
    
    var leftLowerArm_tween = new TWEEN.Tween(leftLowerArm.rotation)
    .to({z: leftLowerArm.rotation.z - Math.PI * 0.10 }, frame_time)
    .easing(TWEEN.Easing.Quadratic.Out)
    .repeat(Infinity)
    .yoyo(true);

    rightUpperArm_tween.start();
    rightLowerArm_tween.start();
    leftUpperArm_tween.start();
    leftLowerArm_tween.start();

    // DRONE 1
    var drone_1_tween1 = new TWEEN.Tween(drone_1.position)
    .to({x: 5, y: 3, z: 0 }, 1000)
    .easing(TWEEN.Easing.Circular.InOut)

    var drone_1_tween2 = new TWEEN.Tween(drone_1.position)
    .to({x: 5, y: 3, z: 0 }, 1000)
    .easing(TWEEN.Easing.Circular.InOut)

    var drone_1_tween3 = new TWEEN.Tween(drone_1.position)
    .to({x: 0, y: 3, z: -5 }, 1000)
    .easing(TWEEN.Easing.Circular.InOut)

    var drone_1_tween4 = new TWEEN.Tween(drone_1.position)
    .to({x: -5, y: 3, z: 0 }, 1000)
    .easing(TWEEN.Easing.Circular.InOut)

    var drone_1_tween5 = new TWEEN.Tween(drone_1.position)
    .to({x: 0, y: 3, z: 5 }, 1000)
    .easing(TWEEN.Easing.Circular.InOut)

    drone_1_tween1.chain(drone_1_tween2)
    drone_1_tween2.chain(drone_1_tween3)
    drone_1_tween3.chain(drone_1_tween4)
    drone_1_tween4.chain(drone_1_tween5)
    drone_1_tween5.chain(drone_1_tween1)
    drone_1_tween1.start();


    // DRONE 2
    var drone_2_tween1 = new TWEEN.Tween(drone_2.position)
    .to({x: 5, y: 4, z: -5 }, 1000)
    .easing(TWEEN.Easing.Circular.InOut)

    var drone_2_tween2 = new TWEEN.Tween(drone_2.position)
    .to({x: -5, y: 4, z: -5 }, 1000)
    .easing(TWEEN.Easing.Circular.InOut)

    var drone_2_tween3 = new TWEEN.Tween(drone_2.position)
    .to({x: -5, y: 4, z: 5 }, 1000)
    .easing(TWEEN.Easing.Circular.InOut)

    var drone_2_tween4 = new TWEEN.Tween(drone_2.position)
    .to({x: 5, y: 4, z: 5 }, 1000)
    .easing(TWEEN.Easing.Circular.InOut)

    var drone_2_tween5 = new TWEEN.Tween(drone_2.position)
    .to({x: 5, y: 4, z: -5 }, 1000)
    .easing(TWEEN.Easing.Circular.InOut)

    drone_2_tween1.chain(drone_2_tween2)
    drone_2_tween2.chain(drone_2_tween3)
    drone_2_tween3.chain(drone_2_tween4)
    drone_2_tween4.chain(drone_2_tween5)
    drone_2_tween5.chain(drone_2_tween1)
    drone_2_tween1.start();


    // DRONE 3
    var drone_3_tween1 = new TWEEN.Tween(drone_3.position)
    .to({x: -5, y: 5, z: 0 }, 1000)
    .easing(TWEEN.Easing.Circular.InOut)

    var drone_3_tween2 = new TWEEN.Tween(drone_3.position)
    .to({x: 0, y: 5, z: 5 }, 1000)
    .easing(TWEEN.Easing.Circular.InOut)

    var drone_3_tween3 = new TWEEN.Tween(drone_3.position)
    .to({x: 5, y: 5, z: 0 }, 1000)
    .easing(TWEEN.Easing.Circular.InOut)

    var drone_3_tween4 = new TWEEN.Tween(drone_3.position)
    .to({x: 0, y: 5, z: -5 }, 1000)
    .easing(TWEEN.Easing.Circular.InOut)

    var drone_3_tween5 = new TWEEN.Tween(drone_3.position)
    .to({x: -5, y: 5, z: 0 }, 1000)
    .easing(TWEEN.Easing.Circular.InOut)

    drone_3_tween1.chain(drone_3_tween2)
    drone_3_tween2.chain(drone_3_tween3)
    drone_3_tween3.chain(drone_3_tween4)
    drone_3_tween4.chain(drone_3_tween5)
    drone_3_tween5.chain(drone_3_tween1)
    drone_3_tween1.start();


     // DRONE 4
    var drone_4_tween1 = new TWEEN.Tween(drone_4.position)
    .to({x: 5, y: 6, z: 5 }, 1000)
    .easing(TWEEN.Easing.Circular.InOut)

    var drone_4_tween2 = new TWEEN.Tween(drone_4.position)
    .to({x: 5, y: 6, z: -5 }, 1000)
    .easing(TWEEN.Easing.Circular.InOut)

    var drone_4_tween3 = new TWEEN.Tween(drone_4.position)
    .to({x: -5, y: 6, z: -5 }, 1000)
    .easing(TWEEN.Easing.Circular.InOut)

    var drone_4_tween4 = new TWEEN.Tween(drone_4.position)
    .to({x: -5, y: 6, z: 5 }, 1000)
    .easing(TWEEN.Easing.Circular.InOut)

    var drone_4_tween5 = new TWEEN.Tween(drone_4.position)
    .to({x: 5, y: 6, z: 5 }, 1000)
    .easing(TWEEN.Easing.Circular.InOut)

    drone_4_tween1.chain(drone_4_tween2)
    drone_4_tween2.chain(drone_4_tween3)
    drone_4_tween3.chain(drone_4_tween4)
    drone_4_tween4.chain(drone_4_tween5)
    drone_4_tween5.chain(drone_4_tween1)
    drone_4_tween1.start();

    
    // Crystal, torus and base animations
    var torus_tween = new TWEEN.Tween(torus.rotation)
    .to({z:torus.rotation.z + Math.PI * 2 }, 6000)
    .easing(TWEEN.Easing.Linear.None)
    .repeat(Infinity);

    var crystal_base_tween = new TWEEN.Tween(crystal_base.rotation)
    .to({z:crystal_base.rotation.z + Math.PI * 2 }, 6000)
    .easing(TWEEN.Easing.Linear.None)
    .repeat(Infinity);

    var crystal_tween = new TWEEN.Tween(crystal.rotation)
    .to({z:crystal.rotation.z + Math.PI * -2 }, 12000)
    .easing(TWEEN.Easing.Linear.None)
    .repeat(Infinity);

    torus_tween.start();
    crystal_base_tween.start();
    crystal_tween.start();

    animate();
}


function collision(scene, figure, drone_1, drone_2, drone_3, drone_4) {

    var figure_box = new THREE.Box3().setFromObject(figure);

    var drone_1_box = new THREE.Box3().setFromObject(drone_1);
    var drone_2_box = new THREE.Box3().setFromObject(drone_2);
    var drone_3_box = new THREE.Box3().setFromObject(drone_3);
    var drone_4_box = new THREE.Box3().setFromObject(drone_4);

    var counter = 0;
    if (figure_box.intersectsBox(drone_1_box)) {
        scene.remove(drone_1)
        counter += 1
    }

    if (figure_box.intersectsBox(drone_2_box)) {
        scene.remove(drone_2)
        counter += 1
    }

    if (figure_box.intersectsBox(drone_3_box)) {
        scene.remove(drone_3)
        counter += 1
    }

    if (figure_box.intersectsBox(drone_4_box)) {
        scene.remove(drone_4)
        counter += 1
    }

    if(counter > 0) {

        let element = document.getElementById("fail");
        element.removeAttribute("hidden");
    }
} 


function animate() {
    requestAnimationFrame( animate );

    TWEEN.update();  

    if (keyboard['ArrowUp']) {

        figure.position.z -= 0.05;
        torso.rotation.z = Math.PI;;
        TWEEN.update();  
    }
    
    if (keyboard['ArrowDown']) {
    
        figure.position.z += 0.05;
        torso.rotation.z = 0;
        TWEEN.update(); 
    }

    if (keyboard['ArrowLeft']) {

        figure.position.x -= 0.05;
        torso.rotation.z = -(Math.PI/2); 
        TWEEN.update(); 
    }

    if (keyboard['ArrowRight']) {
        
        figure.position.x += 0.05;
        torso.rotation.z = (Math.PI/2);
        TWEEN.update(); 
    }

    if (keyboard['Space']) {
        
        figure.position.x += 0.05;
        torso.rotation.z = (Math.PI/2);
        TWEEN.update(); 
    }

    collision(scene, figure, drone_1, drone_2, drone_3, drone_4);

    renderer.render(scene, camera);
}


