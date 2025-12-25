/**
 * Logging Truck Factory
 * @module objects/deforestation/Truck
 */

export function createLoggingTruck() {
    const truck = new THREE.Group();

    // Cabin
    const cabinGeometry = new THREE.BoxGeometry(1.5, 1.2, 1.2);
    const cabinMaterial = new THREE.MeshStandardMaterial({
        color: 0x8b0000,
        roughness: 0.6
    });
    const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
    cabin.position.set(-1, 0.8, 0);
    truck.add(cabin);

    // Windshield
    const windshieldGeometry = new THREE.PlaneGeometry(0.8, 0.5);
    const windshieldMaterial = new THREE.MeshStandardMaterial({
        color: 0x87ceeb,
        roughness: 0.1,
        metalness: 0.3
    });
    const windshield = new THREE.Mesh(windshieldGeometry, windshieldMaterial);
    windshield.position.set(-0.2, 1, 0);
    windshield.rotation.y = Math.PI / 2;
    truck.add(windshield);

    // Flatbed
    const flatbedGeometry = new THREE.BoxGeometry(3, 0.2, 1.4);
    const flatbedMaterial = new THREE.MeshStandardMaterial({
        color: 0x444444,
        roughness: 0.8
    });
    const flatbed = new THREE.Mesh(flatbedGeometry, flatbedMaterial);
    flatbed.position.set(1, 0.5, 0);
    truck.add(flatbed);

    // Wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16);
    const wheelMaterial = new THREE.MeshStandardMaterial({
        color: 0x222222,
        roughness: 0.9
    });

    const wheelPositions = [
        { x: -1.2, z: 0.7 },
        { x: -1.2, z: -0.7 },
        { x: 0.5, z: 0.7 },
        { x: 0.5, z: -0.7 },
        { x: 1.8, z: 0.7 },
        { x: 1.8, z: -0.7 }
    ];

    wheelPositions.forEach(pos => {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.position.set(pos.x, 0.3, pos.z);
        wheel.rotation.x = Math.PI / 2;
        truck.add(wheel);
    });

    // Logs on truck
    const logMaterial = new THREE.MeshStandardMaterial({
        color: 0x5a4738,
        roughness: 0.9
    });

    for (let i = 0; i < 5; i++) {
        const logGeometry = new THREE.CylinderGeometry(0.15, 0.18, 2.5, 8);
        const log = new THREE.Mesh(logGeometry, logMaterial);
        log.position.set(1, 0.8 + i * 0.25, (i % 2 - 0.5) * 0.3);
        log.rotation.z = Math.PI / 2;
        truck.add(log);
    }

    return truck;
}
