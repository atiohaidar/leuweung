/**
 * Stump Factory
 * @module objects/deforestation/Stump
 */

export function createStump() {
    const stump = new THREE.Group();

    // Main stump
    const stumpGeometry = new THREE.CylinderGeometry(0.4, 0.5, 0.3, 12);
    const stumpMaterial = new THREE.MeshStandardMaterial({
        color: 0x8b7355,
        roughness: 0.9
    });
    const stumpMesh = new THREE.Mesh(stumpGeometry, stumpMaterial);
    stumpMesh.position.y = 0.15;
    stump.add(stumpMesh);

    // Tree rings on top
    const ringsGeometry = new THREE.CircleGeometry(0.38, 16);
    const ringsMaterial = new THREE.MeshStandardMaterial({
        color: 0xa08060,
        roughness: 0.8
    });
    const rings = new THREE.Mesh(ringsGeometry, ringsMaterial);
    rings.rotation.x = -Math.PI / 2;
    rings.position.y = 0.31;
    stump.add(rings);

    // Add some wood chips around
    for (let i = 0; i < 5; i++) {
        const chipGeometry = new THREE.BoxGeometry(0.1, 0.02, 0.05);
        const chip = new THREE.Mesh(chipGeometry, stumpMaterial);
        const angle = (i / 5) * Math.PI * 2;
        chip.position.set(
            Math.cos(angle) * (0.5 + Math.random() * 0.3),
            0.01,
            Math.sin(angle) * (0.5 + Math.random() * 0.3)
        );
        chip.rotation.y = Math.random() * Math.PI;
        stump.add(chip);
    }

    return stump;
}
