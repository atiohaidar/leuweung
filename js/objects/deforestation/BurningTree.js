/**
 * Burning Tree Factory
 * @module objects/deforestation/BurningTree
 */

export function createBurningTree() {
    const tree = new THREE.Group();

    // Charred trunk
    const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.5, 4, 8);
    const trunkMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        roughness: 1
    });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = 2;
    tree.add(trunk);

    // Burning foliage (orange/red)
    const foliageGeometry = new THREE.ConeGeometry(1.5, 3, 8);
    const foliageMaterial = new THREE.MeshStandardMaterial({
        color: 0x8b2500,
        emissive: 0xff4400,
        emissiveIntensity: 0.5,
        roughness: 0.8
    });
    const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
    foliage.position.y = 4;
    tree.add(foliage);

    // Fire particles
    const fireGroup = new THREE.Group();
    fireGroup.name = 'fireParticles';

    for (let i = 0; i < 15; i++) {
        const particleGeometry = new THREE.SphereGeometry(0.1 + Math.random() * 0.15, 6, 6);
        const particleMaterial = new THREE.MeshBasicMaterial({
            color: Math.random() > 0.5 ? 0xff6600 : 0xffcc00,
            transparent: true,
            opacity: 0.8
        });
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        particle.position.set(
            (Math.random() - 0.5) * 1.5,
            3 + Math.random() * 3,
            (Math.random() - 0.5) * 1.5
        );
        particle.userData = {
            baseY: particle.position.y,
            speed: 1 + Math.random() * 2,
            phase: Math.random() * Math.PI * 2
        };
        fireGroup.add(particle);
    }
    tree.add(fireGroup);

    // Point light for fire glow
    const fireLight = new THREE.PointLight(0xff4400, 2, 8);
    fireLight.position.y = 4;
    tree.add(fireLight);

    return tree;
}
