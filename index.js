// actions
var curQuestion = 1;
var totalQuestions = 5;

$('.previous').css('cursor', 'default')
$('.code').css('cursor', 'default')

$('.question1').css('visibility', 'visible');

for (var i = 1; i <= 5; i++) {
    if (i != 1) {
        $('.question' + i).hide();
    }

    $('.question' + i).css('visibility', 'visible');

    if (i != 5) {
        new SimpleBar($('.question' + i)[0], {autoHide: false})
    }
}

$(window).on('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
})

$(document).on('click', '.next', function() {
    if (curQuestion == 1) {
        $('.previous').css('cursor', 'pointer')
    } else if (curQuestion == totalQuestions) {
        $('.next').css('cursor', 'default')

        return;
    }
    
    $('.question' + curQuestion).hide();
    curQuestion++;
    $('.question' + curQuestion).show();

    if (curQuestion == 5) {
        $('.number').text('4');
    } else {
        $('.number').text(curQuestion);
    }
});

$(document).on('click', '.previous', function() {
    if (curQuestion == totalQuestions) {
        $('.next').css('cursor', 'pointer')
    } else if (curQuestion == 1) {
        $('.previous').css('cursor', 'default')

        return;
    }
    
    $('.question' + curQuestion).hide();
    curQuestion--;
    $('.question' + curQuestion).show();

    $('.number').text(curQuestion);
});

$(document).on('click', '.code', function() {
    if (curQuestion == 3 || curQuestion == 4 || curQuestion == 5) {
        $('.code').css('cursor', 'pointer')

        var link;

        if (curQuestion == 3) {
            link = 'https://github.com/Kalamitous/ign-code-foo-2018/tree/master/question_3';
        } else if (curQuestion == 4) {
            link = 'https://github.com/Kalamitous/ign-code-foo-2018/tree/master/question_4/backend';
        } else if (curQuestion == 5) {
            link = 'https://github.com/Kalamitous/ign-code-foo-2018/tree/master/question_4/frontend';
        }

        window.open(link);
    } else {
        $('.code').css('cursor', 'default')

        return;
    }
}); 

// setup
var scene = new THREE.Scene();
scene.background = new THREE.Color(0x17252A);

var camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 5)

var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// lights
var ambientLight = new THREE.AmbientLight(0xffffff, 0.75)
scene.add(ambientLight);

var directionalLight = new THREE.DirectionalLight(0xffffff, 0.25);
directionalLight.position.set(0, 0, 5).normalize();
scene.add(directionalLight);

var pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.set(0, 0, 5).normalize();
scene.add(pointLight);

// stationary cubes
var cubeColor = 0x3AAFA9;

var geometry = new THREE.BoxGeometry(2, 2, 2);
var material = new THREE.MeshLambertMaterial({color: cubeColor});
var bodyCube = new THREE.Mesh(geometry, material);
scene.add(bodyCube);

bodyCube.rotation.set(0, 0, -0.1);

var geometry = new THREE.BoxGeometry(0.8, 0.3, 0.3);
var material = new THREE.MeshLambertMaterial({color: cubeColor});
var titleCube = new THREE.Mesh(geometry, material);
scene.add(titleCube);

titleCube.position.set(-1.75, 1.2, 0);

var geometry = new THREE.BoxGeometry(0.8, 0.3, 0.3);
var nextMaterial = new THREE.MeshLambertMaterial({color: cubeColor, transparent: true});
var nextCube = new THREE.Mesh(geometry, nextMaterial);
scene.add(nextCube);

nextCube.position.set(1.75, -1.2, 0);

var geometry = new THREE.BoxGeometry(0.8, 0.3, 0.3);
var previousMaterial = new THREE.MeshLambertMaterial({color: cubeColor, transparent: true, opacity: 0});
var previousCube = new THREE.Mesh(geometry, previousMaterial);
scene.add(previousCube);

previousCube.position.set(-1.75, 0.8, 0);

var geometry = new THREE.BoxGeometry(0.8, 0.3, 0.3);
var codeMaterial = new THREE.MeshLambertMaterial({color: cubeColor, transparent: true, opacity: 0});
var codeCube = new THREE.Mesh(geometry, codeMaterial);
scene.add(codeCube);

codeCube.position.set(1.75, -0.8, 0);

// load textures
THREE.ImageUtils.crossOrigin = '';
var ign = THREE.ImageUtils.loadTexture('images/ign.png');
var codeFoo = THREE.ImageUtils.loadTexture('images/code_foo.png');
codeFoo.anisotropy = renderer.getMaxAnisotropy();
ign.anisotropy = renderer.getMaxAnisotropy();

// moving cubes
var geometry = new THREE.PlaneGeometry(0.4, 0.4, 0.4);
var material = new THREE.MeshBasicMaterial({map: ign, transparent: true});
var leftPlane = new THREE.Mesh(geometry, material);
scene.add(leftPlane);

var geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
var material = new THREE.MeshLambertMaterial({color: cubeColor});
var leftSmall = new THREE.Mesh(geometry, material);
scene.add(leftSmall);

var geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
var material = new THREE.MeshLambertMaterial({color: cubeColor});
var leftMedium = new THREE.Mesh(geometry, material);
scene.add(leftMedium);

var geometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
var material = new THREE.MeshLambertMaterial({color: cubeColor});
var leftLarge = new THREE.Mesh(geometry, material);
scene.add(leftLarge);

var geometry = new THREE.PlaneGeometry(0.4, 0.4, 0.4);
var material = new THREE.MeshBasicMaterial({map: codeFoo, transparent: true});
var rightPlane = new THREE.Mesh(geometry, material);
scene.add(rightPlane);

var geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
var material = new THREE.MeshLambertMaterial({color: cubeColor});
var rightSmall = new THREE.Mesh(geometry, material);
scene.add(rightSmall);

var geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
var material = new THREE.MeshLambertMaterial({color: cubeColor});
var rightMedium = new THREE.Mesh(geometry, material);
scene.add(rightMedium);

var geometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
var material = new THREE.MeshLambertMaterial({color: cubeColor});
var rightLarge = new THREE.Mesh(geometry, material);
scene.add(rightLarge);

var frames = 0;
function animate() {
    frames++;

    leftSmall.position.set(
        -1.7 + 0.025 * Math.sin(frames / 125),
        -0.45 + 0.05 * Math.cos(frames / 125),
        0 + 0.075 * Math.sin(frames / 125)
    )
    
    leftSmall.rotation.set(
        0.025 * Math.cos(frames / 125),
        0.05 * Math.sin(frames / 125),
        0.075 * Math.cos(frames / 125)
    )

    leftMedium.position.set(
        -2.2 + 0.025 * Math.cos(frames / 150),
        -0.8 + 0.05 * Math.sin(frames / 150),
        -0.4 + 0.075 * Math.cos(frames / 150)
    )
    
    leftMedium.rotation.set(
        0.025 * Math.cos(frames / 150),
        0.05 * Math.sin(frames / 150),
        0.075 * Math.cos(frames / 150)
    )

    leftLarge.position.set(
        -1.7 + 0.025 * Math.sin(frames / 200),
        -0.9 + 0.05 * Math.cos(frames / 200),
        -0.2 + 0.075 * Math.sin(frames / 200)
    )
    
    leftLarge.rotation.set(
        0.025 * Math.sin(frames / 200),
        0.05 * Math.cos(frames / 200),
        0.075 * Math.sin(frames / 200)
    )

    leftPlane.position.set(
        -1.7 + 0.025 * Math.sin(frames / 200),
        -0.9 + 0.05 * Math.cos(frames / 200),
        0.001 + 0.075 * Math.sin(frames / 200)
    )
    
    leftPlane.rotation.set(
        0.025 * Math.sin(frames / 200),
        0.05 * Math.cos(frames / 200),
        0.075 * Math.sin(frames / 200)
    )

    rightSmall.position.set(
        1.7 + 0.025 * Math.cos(frames / 125),
        0.45 + 0.05 * Math.sin(frames / 125),
        0 + 0.075 * Math.cos(frames / 125)
    )
    
    rightSmall.rotation.set(
        -0.025 * Math.sin(frames / 125),
        -0.05 * Math.cos(frames / 125),
        -0.075 * Math.sin(frames / 125)
    )

    rightMedium.position.set(
        2.2 + 0.025 * Math.sin(frames / 150),
        0.8 + 0.05 * Math.cos(frames / 150),
        -0.4 + 0.075 * Math.sin(frames / 150)
    )
    
    rightMedium.rotation.set(
        -0.025 * Math.sin(frames / 150),
        -0.05 * Math.cos(frames / 150),
        -0.075 * Math.sin(frames / 150)
    )

    rightLarge.position.set(
        1.7 + 0.025 * Math.cos(frames / 200),
        0.9 + 0.05 * Math.sin(frames / 200),
        -0.2 + 0.075 * Math.cos(frames / 200)
    )
    
    rightLarge.rotation.set(
        -0.025 * Math.cos(frames / 200),
        -0.05 * Math.sin(frames / 200),
        -0.075 * Math.cos(frames / 200)
    )

    rightPlane.position.set(
        1.7 + 0.025 * Math.cos(frames / 200),
        0.9 + 0.05 * Math.sin(frames / 200),
        0.001 + 0.075 * Math.cos(frames / 200)
    )
    
    rightPlane.rotation.set(
        -0.025 * Math.cos(frames / 200),
        -0.05 * Math.sin(frames / 200),
        -0.075 * Math.cos(frames / 200)
    )

    if (curQuestion == totalQuestions) {
        nextMaterial.opacity = Math.max(nextMaterial.opacity - 0.1, 0);
        $('.next').css('opacity', 0);
    } else {
        nextMaterial.opacity = Math.min(nextMaterial.opacity + 0.1, 1);
        $('.next').css('opacity', 1);
    }

    if (curQuestion == 1) {
        previousMaterial.opacity = Math.max(previousMaterial.opacity - 0.1, 0);
        $('.previous').css('opacity', 0);
    } else {
        previousMaterial.opacity = Math.min(previousMaterial.opacity + 0.1, 1);
        $('.previous').css('opacity', 1);
    }

    if (curQuestion != 3 && curQuestion != 4 && curQuestion != 5) {
        codeMaterial.opacity = Math.max(codeMaterial.opacity - 0.1, 0);
        $('.code').css('opacity', 0);
    } else {
        codeMaterial.opacity = Math.min(codeMaterial.opacity + 0.1, 1);
        $('.code').css('opacity', 1);
    }

	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}

animate();