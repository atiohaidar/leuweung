/**
 * Earth - Creates a stylized Earth for the final zoom-out effect
 * @module Earth
 */

export class Earth {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.earthGroup = null;
        this.earth = null;
        this.clouds = null;
        this.atmosphere = null;

        this.create();
    }

    create() {
        this.earthGroup = new THREE.Group();

        // Earth sphere
        const earthGeometry = new THREE.SphereGeometry(50, 64, 64);
        const earthMaterial = new THREE.MeshStandardMaterial({
            color: 0x1e90ff,
            roughness: 0.8,
            metalness: 0.1
        });
        this.earth = new THREE.Mesh(earthGeometry, earthMaterial);
        this.earthGroup.add(this.earth);

        // Add continents (simplified green patches)
        this.addContinents();

        // Clouds layer
        const cloudsGeometry = new THREE.SphereGeometry(51, 32, 32);
        const cloudsMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.3
        });
        this.clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
        this.earthGroup.add(this.clouds);

        // Atmosphere glow
        const atmosphereGeometry = new THREE.SphereGeometry(55, 32, 32);
        const atmosphereMaterial = new THREE.MeshBasicMaterial({
            color: 0x87ceeb,
            transparent: true,
            opacity: 0.15,
            side: THREE.BackSide
        });
        this.atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        this.earthGroup.add(this.atmosphere);

        // Position Earth - visible when camera is at Y:300 looking down
        // Camera ends at Y:300, Z:-140, looking at Y:-120, Z:-150
        this.earthGroup.position.set(0, -80, -150);

        // Add stars around Earth
        this.addStars();

        this.sceneManager.add(this.earthGroup);
    }

    addContinents() {
        // Create multiple green patches as continents
        const continentMaterial = new THREE.MeshStandardMaterial({
            color: 0x228b22,
            roughness: 0.9
        });

        const continents = [
            { lat: 40, lon: -100, scale: 15 },  // North America
            { lat: -10, lon: -60, scale: 12 },  // South America
            { lat: 50, lon: 10, scale: 10 },    // Europe
            { lat: 10, lon: 20, scale: 18 },    // Africa
            { lat: 50, lon: 90, scale: 20 },    // Asia
            { lat: -25, lon: 135, scale: 8 },   // Australia
        ];

        continents.forEach(cont => {
            const continentGeometry = new THREE.SphereGeometry(cont.scale, 16, 16);
            const continent = new THREE.Mesh(continentGeometry, continentMaterial);

            // Convert lat/lon to 3D position on sphere surface
            const phi = (90 - cont.lat) * Math.PI / 180;
            const theta = (cont.lon + 180) * Math.PI / 180;

            continent.position.set(
                50.5 * Math.sin(phi) * Math.cos(theta),
                50.5 * Math.cos(phi),
                50.5 * Math.sin(phi) * Math.sin(theta)
            );

            // Scale to flatten onto surface
            continent.scale.set(1, 0.1, 1);
            continent.lookAt(0, 0, 0);

            this.earthGroup.add(continent);
        });

        // Add ice caps
        const iceMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.5
        });

        // North pole
        const northPole = new THREE.SphereGeometry(12, 16, 8, 0, Math.PI * 2, 0, Math.PI / 4);
        const northIce = new THREE.Mesh(northPole, iceMaterial);
        northIce.position.y = 48;
        this.earthGroup.add(northIce);

        // South pole
        const southPole = new THREE.SphereGeometry(10, 16, 8, 0, Math.PI * 2, Math.PI * 0.75, Math.PI / 4);
        const southIce = new THREE.Mesh(southPole, iceMaterial);
        southIce.position.y = -48;
        southIce.rotation.x = Math.PI;
        this.earthGroup.add(southIce);
    }

    addStars() {
        // Create stars around the Earth for space effect
        const starCount = 500;
        const starGeometry = new THREE.BufferGeometry();
        const starPositions = new Float32Array(starCount * 3);

        for (let i = 0; i < starCount * 3; i += 3) {
            // Spread stars in a large sphere around
            const radius = 200 + Math.random() * 300;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;

            starPositions[i] = radius * Math.sin(phi) * Math.cos(theta);
            starPositions[i + 1] = radius * Math.cos(phi) - 100; // Offset down
            starPositions[i + 2] = radius * Math.sin(phi) * Math.sin(theta) - 150;
        }

        starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));

        const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 1,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        const stars = new THREE.Points(starGeometry, starMaterial);
        this.sceneManager.add(stars);
    }

    update(time) {
        // Slow rotation
        if (this.earthGroup) {
            this.earthGroup.rotation.y = time * 0.05;
        }
        if (this.clouds) {
            this.clouds.rotation.y = time * 0.03;
        }
    }

    getPosition() {
        return this.earthGroup.position;
    }

    getEarthGroup() {
        return this.earthGroup;
    }
}
