import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js';

// ---------------------------------------------------------
// Scene Setup with Fog for Depth
// ---------------------------------------------------------
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a1f);
scene.fog = new THREE.FogExp2(0x0a0a1f, 0.0008);

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    10000
);
camera.position.z = 50;
camera.rotation.y = Math.PI;

const renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.5;
document.body.appendChild(renderer.domElement);

// Add ambient light with a cosmic tint
const ambientLight = new THREE.AmbientLight(0x0055ff, 0.3);
scene.add(ambientLight);

// Add point lights near camera for depth and glow
const pointLight1 = new THREE.PointLight(0x00ffff, 1.2, 5000);
pointLight1.position.set(100, 100, 200);
pointLight1.castShadow = true;
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0xff00ff, 0.8, 5000);
pointLight2.position.set(-100, -100, 200);
pointLight2.castShadow = true;
scene.add(pointLight2);

// Add directional light for cosmic rays effect
const dirLight = new THREE.DirectionalLight(0x00ff88, 0.4);
dirLight.position.set(500, 500, 500);
scene.add(dirLight);

// ---------------------------------------------------------
// Enhanced Star Field with Colors and Twinkling
// ---------------------------------------------------------
function createStars(count = 25000) {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const scales = new Float32Array(count);

    for (let i = 0; i < count; i++) {
        positions[i * 3]     = (Math.random() - 0.5) * 7000;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 7000;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 7000;

        const colorType = Math.random();
        if (colorType < 0.65) {
            colors[i * 3] = 1;
            colors[i * 3 + 1] = 1;
            colors[i * 3 + 2] = 1;
        } else if (colorType < 0.82) {
            colors[i * 3] = 0.6;
            colors[i * 3 + 1] = 0.85;
            colors[i * 3 + 2] = 1;
        } else if (colorType < 0.95) {
            colors[i * 3] = 1;
            colors[i * 3 + 1] = 0.92;
            colors[i * 3 + 2] = 0.6;
        } else {
            colors[i * 3] = 1;
            colors[i * 3 + 1] = 0.5;
            colors[i * 3 + 2] = 0.7;
        }

        scales[i] = Math.random() * 2 + 0.8;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    const material = new THREE.PointsMaterial({
        size: 2.5,
        vertexColors: true,
        sizeAttenuation: true,
        transparent: false,
        fog: false
    });

    return new THREE.Points(geometry, material);
}

// Create multiple star layers for infinite regeneration
const starLayers = [];
for (let i = 0; i < 4; i++) {
    const stars = createStars(25000);
    stars.position.z = 500 + i * 2000;
    scene.add(stars);
    starLayers.push(stars);
}

// ---------------------------------------------------------
// Enhanced Nebula Clouds with Better Integration
// ---------------------------------------------------------
function createNebulaClouds() {
    const group = new THREE.Group();
    
    const nebulaColors = [
        { h: 0.45, s: 1.0, l: 0.6 },   // Bright Cyan
        { h: 0.50, s: 0.95, l: 0.65 }, // Electric Blue
        { h: 0.60, s: 0.9, l: 0.58 },  // Deep Blue
        { h: 0.70, s: 0.95, l: 0.62 }, // Vibrant Purple
        { h: 0.75, s: 1.0, l: 0.60 },  // Indigo
        { h: 0.80, s: 0.95, l: 0.65 }, // Magenta
        { h: 0.85, s: 0.98, l: 0.62 }, // Hot Magenta
        { h: 0.90, s: 0.9, l: 0.65 },  // Pink
        { h: 0.05, s: 0.95, l: 0.62 }, // Deep Pink/Red
        { h: 0.10, s: 0.9, l: 0.60 },  // Ruby
    ];
    
    // Create more varied nebula sizes and shapes
    for (let i = 0; i < 15; i++) { // Increased from 10 to 15 for better coverage
        const colorData = nebulaColors[i % nebulaColors.length];
        const color = new THREE.Color().setHSL(colorData.h, colorData.s, colorData.l);
        
        // Use different geometries for variety
        let geometry;
        const shapeType = Math.random();
        if (shapeType < 0.4) {
            geometry = new THREE.IcosahedronGeometry(300 + Math.random() * 400, 3);
        } else if (shapeType < 0.7) {
            geometry = new THREE.SphereGeometry(200 + Math.random() * 300, 8, 6);
        } else {
            geometry = new THREE.OctahedronGeometry(250 + Math.random() * 350, 2);
        }
        
        const material = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.15 + Math.random() * 0.15, // Slightly more opaque
            depthWrite: false,
            fog: true, // Enable fog for depth
            wireframe: true,
            blending: THREE.AdditiveBlending // Better blending for glow effect
        });

        const mesh = new THREE.Mesh(geometry, material);
        
        // Position nebulas throughout the space, including near galaxies
        mesh.position.set(
            (Math.random() - 0.5) * 10000,
            (Math.random() - 0.5) * 8000,
            -2000 - Math.random() * 8000 // Spread out more in Z
        );
        
        // More varied scales for depth perception
        const scale = 0.3 + Math.random() * 2.5;
        const scaleY = scale * (0.4 + Math.random() * 0.8); // More variation in Y scale
        mesh.scale.set(scale, scaleY, scale);
        
        // Random rotation
        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;
        mesh.rotation.z = Math.random() * Math.PI;

        group.add(mesh);
    }
    
    return group;
}

const nebulaClouds = createNebulaClouds();
scene.add(nebulaClouds);

// Track nebula spawn times for fade-in
const nebulaSpawnTimes = new Map();
nebulaClouds.children.forEach(cloud => {
    nebulaSpawnTimes.set(cloud, 0);
});

// ---------------------------------------------------------
// Enhanced Galaxy Generator with 3D Depth
// ---------------------------------------------------------
function createGalaxy(count = 100000, radius = 500) {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    // Varied galaxy color schemes
    const colorSchemes = [
        { hue: Math.random() * 0.2, saturation: 0.9, lightness: 0.6 },
        { hue: 0.3 + Math.random() * 0.2, saturation: 0.95, lightness: 0.65 },
        { hue: 0.6 + Math.random() * 0.15, saturation: 0.9, lightness: 0.62 },
        { hue: 0.75 + Math.random() * 0.2, saturation: 0.98, lightness: 0.65 },
        { hue: 0.9 + Math.random() * 0.1, saturation: 0.85, lightness: 0.6 },
    ];
    
    const scheme = colorSchemes[Math.floor(Math.random() * colorSchemes.length)];
    const hue = scheme.hue;
    const saturation = scheme.saturation;
    const lightness = scheme.lightness;

    // Choose a random galaxy shape type
    const galaxyType = Math.random();
    
    // 3D thickness parameters
    const coreThickness = radius * 0.4;
    const armThickness = radius * 0.15;
    const haloThickness = radius * 0.6;
    
    for (let i = 0; i < count; i++) {
        let x, y, z;
        let brightness;
        let starSize = 1;
        
        const starType = Math.random();
        let thickness = 0;
        
        if (galaxyType < 0.33) {
            // SPIRAL GALAXY - Enhanced 3D structure
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.pow(Math.random(), 0.35) * radius;
            const spiralArms = 2 + Math.random() * 1.5;
            const spiralRotation = (dist / radius) * Math.PI * 8 * spiralArms;
            
            x = Math.cos(angle + spiralRotation) * dist;
            z = Math.sin(angle + spiralRotation) * dist;
            
            if (dist < radius * 0.3) {
                thickness = coreThickness;
                starSize = 1.5;
            } else {
                thickness = armThickness;
                starSize = 1.0;
            }
            
            if (Math.random() < 0.1) {
                thickness = haloThickness;
                starSize = 0.7;
            }
            
            y = (Math.random() - 0.5) * thickness;
            brightness = 1 - (dist / radius) * 0.4;
            
        } else if (galaxyType < 0.66) {
            // ELLIPTICAL GALAXY - Make it truly 3D ellipsoid
            const u = Math.random();
            const v = Math.random();
            const theta = u * 2.0 * Math.PI;
            const phi = Math.acos(2.0 * v - 1.0);
            const r = Math.pow(Math.random(), 0.6) * radius;
            
            const ellipticityX = 1.0;
            const ellipticityY = 0.3 + Math.random() * 0.4;
            const ellipticityZ = 1.0;
            
            x = r * Math.sin(phi) * Math.cos(theta) * ellipticityX;
            z = r * Math.sin(phi) * Math.sin(theta) * ellipticityZ;
            y = r * Math.cos(phi) * ellipticityY;
            
            brightness = 1 - (r / radius) * 0.5;
            starSize = 1.2;
            
        } else {
            // IRREGULAR GALAXY - Volumetric chaotic structure
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * radius;
            const chaos = Math.sin(angle * 3) * Math.cos(angle * 5) * 0.3;
            const waveX = Math.sin(dist / radius * Math.PI) * radius * 0.4;
            
            x = Math.cos(angle) * dist + waveX + chaos * radius;
            z = Math.sin(angle) * dist + Math.sin(angle * 7) * radius * 0.3;
            
            thickness = coreThickness * (0.3 + Math.random() * 0.7);
            y = (Math.random() - 0.5) * thickness;
            
            brightness = 1 - (dist / radius) * 0.35;
            starSize = 1.0;
        }
        
        positions[i * 3]     = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        const depthFactor = 1 - Math.abs(y) / (thickness || coreThickness);
        const hueVariation = hue + (Math.random() - 0.5) * 0.08;
        const saturationVariation = saturation + (Math.random() - 0.5) * 0.15;
        
        const verticalDimming = 1 - (Math.abs(y) / (thickness || coreThickness)) * 0.3;
        const lightnessVariation = lightness * brightness * verticalDimming + (Math.random() - 0.5) * 0.12;
        
        const color = new THREE.Color().setHSL(
            hueVariation, 
            Math.max(0.25, saturationVariation), 
            Math.max(0.25, Math.min(0.9, lightnessVariation))
        );
        
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
        
        sizes[i] = starSize;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
        size: 4.0,
        vertexColors: true,
        transparent: true,
        opacity: 1,
        sizeAttenuation: true,
        fog: false
    });

    const galaxy = new THREE.Points(geometry, material);
    
    // Add a subtle glow effect
    const glowGeometry = new THREE.BufferGeometry();
    const glowPositions = new Float32Array(Math.floor(count * 0.1) * 3);
    const glowColors = new Float32Array(Math.floor(count * 0.1) * 3);
    
    for (let i = 0; i < Math.floor(count * 0.1); i++) {
        const idx = Math.floor(Math.random() * count);
        glowPositions[i * 3] = positions[idx * 3] * 1.2;
        glowPositions[i * 3 + 1] = positions[idx * 3 + 1] * 1.2;
        glowPositions[i * 3 + 2] = positions[idx * 3 + 2] * 1.2;
        
        glowColors[i * 3] = colors[idx * 3];
        glowColors[i * 3 + 1] = colors[idx * 3 + 1];
        glowColors[i * 3 + 2] = colors[idx * 3 + 2];
    }
    
    glowGeometry.setAttribute('position', new THREE.BufferAttribute(glowPositions, 3));
    glowGeometry.setAttribute('color', new THREE.BufferAttribute(glowColors, 3));
    
    const glowMaterial = new THREE.PointsMaterial({
        size: 8.0,
        vertexColors: true,
        transparent: true,
        opacity: 0.3,
        sizeAttenuation: true,
        fog: false,
        blending: THREE.AdditiveBlending
    });
    
    const glowLayer = new THREE.Points(glowGeometry, glowMaterial);
    galaxy.add(glowLayer);
    
    return galaxy;
}

// Galaxy rotation pattern types
const ROTATION_PATTERNS = {
    SLOW_STEADY: 'slow_steady',
    FAST_SPINNER: 'fast_spinner',
    COMPLEX: 'complex',
    WANDERING: 'wandering',
    BARREL_ROLL: 'barrel_roll',
    GENTLE_SWAY: 'gentle_sway'
};

// Create and place multiple galaxies with unique rotation patterns
const galaxies = [];
const galaxySpawnTimes = new Map();
const galaxyRotationData = new Map();
const FADE_IN_DURATION = 200;

for (let i = 0; i < 8; i++) {
    const g = createGalaxy(100000, 500);

    g.position.set(
        (Math.random() - 0.5) * 4000,
        (Math.random() - 0.5) * 3000,
        500 + i * 10000
    );

    g.rotation.z = Math.random() * Math.PI;
    g.rotation.x = Math.random() * Math.PI;
    g.rotation.y = Math.random() * Math.PI;

    const s = 1.5 + Math.random() * 2.0;
    g.scale.set(s, s, s);

    const rotationPattern = assignRotationPattern(g, i);
    galaxyRotationData.set(g, rotationPattern);

    scene.add(g);
    galaxies.push(g);
    galaxySpawnTimes.set(g, 0);
}

function assignRotationPattern(galaxy, index) {
    const patternTypes = Object.values(ROTATION_PATTERNS);
    const patternType = patternTypes[Math.floor(Math.random() * patternTypes.length)];
    
    let baseSpeed, xSpeed, ySpeed, zSpeed, axisStrength;
    
    switch (patternType) {
        case ROTATION_PATTERNS.SLOW_STEADY:
            baseSpeed = 0.0001;
            xSpeed = (Math.random() - 0.5) * baseSpeed;
            ySpeed = (Math.random() - 0.5) * baseSpeed;
            zSpeed = (Math.random() - 0.5) * baseSpeed;
            axisStrength = { x: 0.3, y: 0.3, z: 0.4 };
            break;
            
        case ROTATION_PATTERNS.FAST_SPINNER:
            baseSpeed = 0.0008;
            const dominantAxis = ['x', 'y', 'z'][Math.floor(Math.random() * 3)];
            xSpeed = dominantAxis === 'x' ? baseSpeed : (Math.random() - 0.5) * baseSpeed * 0.2;
            ySpeed = dominantAxis === 'y' ? baseSpeed : (Math.random() - 0.5) * baseSpeed * 0.2;
            zSpeed = dominantAxis === 'z' ? baseSpeed : (Math.random() - 0.5) * baseSpeed * 0.2;
            axisStrength = { x: 0.1, y: 0.1, z: 0.1 };
            axisStrength[dominantAxis] = 0.8;
            break;
            
        case ROTATION_PATTERNS.COMPLEX:
            baseSpeed = 0.0003;
            xSpeed = (Math.random() - 0.5) * baseSpeed * 1.5;
            ySpeed = (Math.random() - 0.5) * baseSpeed * 1.5;
            zSpeed = (Math.random() - 0.5) * baseSpeed * 1.5;
            axisStrength = { x: 0.4, y: 0.3, z: 0.3 };
            break;
            
        case ROTATION_PATTERNS.WANDERING:
            baseSpeed = 0.0002;
            xSpeed = (Math.random() - 0.5) * baseSpeed;
            ySpeed = (Math.random() - 0.5) * baseSpeed;
            zSpeed = (Math.random() - 0.5) * baseSpeed;
            axisStrength = { x: 0.25, y: 0.25, z: 0.5 };
            break;
            
        case ROTATION_PATTERNS.BARREL_ROLL:
            baseSpeed = 0.0006;
            const rollAxis = ['x', 'y'][Math.floor(Math.random() * 2)];
            xSpeed = rollAxis === 'x' ? baseSpeed : (Math.random() - 0.5) * baseSpeed * 0.1;
            ySpeed = rollAxis === 'y' ? baseSpeed : (Math.random() - 0.5) * baseSpeed * 0.1;
            zSpeed = (Math.random() - 0.5) * baseSpeed * 0.1;
            axisStrength = { x: 0.05, y: 0.05, z: 0.9 };
            axisStrength[rollAxis] = 0.8;
            break;
            
        case ROTATION_PATTERNS.GENTLE_SWAY:
            baseSpeed = 0.00005;
            xSpeed = (Math.random() - 0.5) * baseSpeed;
            ySpeed = (Math.random() - 0.5) * baseSpeed;
            zSpeed = (Math.random() - 0.5) * baseSpeed;
            axisStrength = { x: 0.2, y: 0.3, z: 0.5 };
            break;
            
        default:
            baseSpeed = 0.0002;
            xSpeed = (Math.random() - 0.5) * baseSpeed;
            ySpeed = (Math.random() - 0.5) * baseSpeed;
            zSpeed = (Math.random() - 0.5) * baseSpeed;
            axisStrength = { x: 0.33, y: 0.33, z: 0.34 };
    }
    
    return {
        patternType,
        speeds: { x: xSpeed, y: ySpeed, z: zSpeed },
        axisStrength,
        timeOffset: Math.random() * 1000,
        wobble: Math.random() * 0.0001,
        speedVariation: 0.1 + Math.random() * 0.3
    };
}

// ---------------------------------------------------------
// Animation Loop with Nebula Support
// ---------------------------------------------------------
let speed = 0.5;
let time = 0;
const maxSpeed = 100;
const keys = {};
let lastDebugLog = 0;

let totalDistance = 0;
const RESET_THRESHOLD = 100000;

function resetCameraPosition() {
    const cameraOffset = camera.position.z;
    
    starLayers.forEach(layer => {
        layer.position.z -= cameraOffset;
    });
    
    galaxies.forEach(g => {
        g.position.z -= cameraOffset;
    });
    
    nebulaClouds.children.forEach(cloud => {
        cloud.position.z -= cameraOffset;
    });
    
    camera.position.z = 50;
    
    console.log(`[RESET] Camera reset! Objects shifted by ${cameraOffset}`);
}

function animate() {
    requestAnimationFrame(animate);
    time += 1;

    // Keyboard input
    if (keys['w']) speed = Math.min(speed + 0.05, maxSpeed);
    if (keys['s']) speed = Math.max(speed - 0.05, 0);
    if (keys['e']) speed = Math.min(speed + 0.7, maxSpeed);
    if (keys['d']) speed = Math.max(speed - 0.7, 0);

    // Random speed variation
    if (Math.random() > 0.997) {
        speed += (Math.random() - 0.5) * 0.2;
        speed = Math.max(0, Math.min(speed, maxSpeed));
    }

    totalDistance += speed;
    camera.position.z += speed;
    
    if (camera.position.z > RESET_THRESHOLD) {
        resetCameraPosition();
    }

    const speedFactor = speed / maxSpeed;
    scene.fog.density = 0.0008 + speedFactor * 0.002;
    
    starLayers.forEach(layer => {
        layer.material.opacity = 0.95 - speedFactor * 0.15;
    });
    
    // Nebula glow increases with speed
    nebulaClouds.children.forEach(cloud => {
        if (cloud.material.opacity < 0.4) {
            cloud.material.opacity = Math.min(0.4, cloud.material.opacity + speedFactor * 0.02);
        }
    });

    const drift = 350;
    camera.position.x = Math.sin(time * 0.0002) * drift + Math.sin(time * 0.00008) * drift * 0.3;
    camera.position.y = Math.cos(time * 0.00012) * drift * 0.6 + Math.cos(time * 0.00006) * drift * 0.3;

    camera.rotation.order = 'YXZ';
    camera.rotation.y = Math.PI + camera.position.x * 0.0003;
    camera.rotation.z = Math.sin(time * 0.00006) * 0.15 + Math.sin(time * 0.00002) * 0.05;
    camera.rotation.x = camera.position.y * 0.0002;

    // Rotate star layers
    starLayers.forEach(layer => {
        layer.rotation.y += 0.00005 + speedFactor * 0.00005;
        layer.rotation.x += 0.00002 + speedFactor * 0.00002;
    });

    // Rotate nebula clouds
    nebulaClouds.children.forEach((cloud, idx) => {
        cloud.rotation.z += 0.00002 + speedFactor * 0.00003;
        cloud.rotation.x += 0.00001 + speedFactor * 0.00001;
        cloud.position.y += Math.sin(time * 0.0001 + idx) * 0.05;
    });

    // UNIQUE GALAXY ROTATION PATTERNS
    galaxies.forEach((g, idx) => {
        const rotationData = galaxyRotationData.get(g);
        if (!rotationData) return;

        const { speeds, axisStrength, timeOffset, wobble, speedVariation } = rotationData;
        
        const timeVar = (time + timeOffset) * 0.001;
        const speedMultiplier = 1 + Math.sin(timeVar) * speedVariation;
        
        g.rotation.x += speeds.x * axisStrength.x * speedMultiplier + Math.sin(timeVar * 0.7) * wobble;
        g.rotation.y += speeds.y * axisStrength.y * speedMultiplier + Math.cos(timeVar * 0.5) * wobble;
        g.rotation.z += speeds.z * axisStrength.z * speedMultiplier + Math.sin(timeVar * 0.3) * wobble;
        
        const travelBoost = speedFactor * 0.0001;
        g.rotation.x += travelBoost * axisStrength.x;
        g.rotation.y += travelBoost * axisStrength.y;
        g.rotation.z += travelBoost * axisStrength.z;
    });

    // Regenerate star layers
    starLayers.forEach((layer, idx) => {
        const dist = layer.position.z - camera.position.z;
        if (dist < -5000) {
            layer.position.z = camera.position.z + 8000 + idx * 4000;
        }
    });

    // Regenerate galaxies
    let galaxiesAhead = 0;
    galaxies.forEach((g, idx) => {
        const galaxyDist = g.position.z - camera.position.z;
        
        if (galaxyDist < -3000) {
            g.position.set(
                (Math.random() - 0.5) * 4000,
                (Math.random() - 0.5) * 3000,
                camera.position.z + 6000 + Math.random() * 8000
            );
            g.rotation.z = Math.random() * Math.PI;
            galaxySpawnTimes.set(g, 0);
            
            const newRotationPattern = assignRotationPattern(g, idx);
            galaxyRotationData.set(g, newRotationPattern);
        }
        
        let spawnTime = galaxySpawnTimes.get(g) || 0;
        spawnTime++;
        galaxySpawnTimes.set(g, spawnTime);
        
        const fadeProgress = Math.min(spawnTime / FADE_IN_DURATION, 1);
        g.material.opacity = 0.8 * fadeProgress;
        
        if (galaxyDist > -3000 && galaxyDist < 10000) {
            galaxiesAhead++;
        }
    });

    // Regenerate nebulas
    nebulaClouds.children.forEach((cloud, idx) => {
        const nebulaDist = cloud.position.z - camera.position.z;
        if (nebulaDist < -7000) {
            cloud.position.set(
                (Math.random() - 0.5) * 8000,
                (Math.random() - 0.5) * 6000,
                camera.position.z + 5000 + Math.random() * 10000
            );
            nebulaSpawnTimes.set(cloud, 0);
        }
        
        let spawnTime = nebulaSpawnTimes.get(cloud) || 0;
        spawnTime++;
        nebulaSpawnTimes.set(cloud, spawnTime);
        
        const fadeProgress = Math.min(spawnTime / FADE_IN_DURATION, 1);
        cloud.material.opacity = 0.3 * fadeProgress;
    });

    if (time - lastDebugLog > 500) {
        lastDebugLog = time;
        console.log(`Distance: ${(totalDistance / 100).toFixed(0)} LY | Speed: ${speed.toFixed(1)}x | Galaxies ahead: ${galaxiesAhead}`);
    }

    // Update HUD
    if (document.getElementById('speed')) {
        document.getElementById('speed').textContent = speed.toFixed(1);
    }
    if (document.getElementById('depth')) {
        document.getElementById('depth').textContent = Math.floor(totalDistance / 100);
    }

    renderer.render(scene, camera);
}

animate();

// ---------------------------------------------------------
// Keyboard Controls
// ---------------------------------------------------------
document.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
});

// ---------------------------------------------------------
// Responsive Resize
// ---------------------------------------------------------
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});