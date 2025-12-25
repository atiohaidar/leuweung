/**
 * Fallen Tree Factory
 * @module objects/deforestation/FallenTree
 */

export function createFallenTree() {
    const tree = new THREE.Group();

    // Trunk
    const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.4, 4, 8);
    const trunkMaterial = new THREE.MeshStandardMaterial({
        color: 0x5a4738,
        roughness: 0.9
    });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.rotation.z = Math.PI / 2;
    trunk.position.set(2, 0.3, 0);
    tree.add(trunk);

    // Dead foliage (brown)
    const foliageGeometry = new THREE.ConeGeometry(1.2, 2, 8);
    const foliageMaterial = new THREE.MeshStandardMaterial({
        color: 0x4a3a2a,
        roughness: 0.9
    });
    const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
    foliage.rotation.z = Math.PI / 2;
    foliage.position.set(4, 0.5, 0);
    tree.add(foliage);

    // Broken branches
    for (let i = 0; i < 3; i++) {
        const branchGeometry = new THREE.CylinderGeometry(0.05, 0.08, 0.8, 6);
        const branch = new THREE.Mesh(branchGeometry, trunkMaterial);
        branch.position.set(
            1 + i * 1.2,
            0.4,
            (Math.random() - 0.5) * 0.5
        );
        branch.rotation.z = Math.random() * 0.5;
        branch.rotation.x = (Math.random() - 0.5) * 0.5;
        tree.add(branch);
    }

    return tree;
}
