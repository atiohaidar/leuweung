/**
 * Logger Figure Factory
 * @module objects/deforestation/LoggerFigure
 */

export function createLogger(hasChainsaw = false) {
    const logger = new THREE.Group();

    // Body
    const bodyGeometry = new THREE.CylinderGeometry(0.2, 0.25, 0.6, 8);
    const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0xff6600, // Orange safety vest
        roughness: 0.7
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 1;
    logger.add(body);

    // Head
    const headGeometry = new THREE.SphereGeometry(0.15, 8, 8);
    const headMaterial = new THREE.MeshStandardMaterial({
        color: 0xffcc99,
        roughness: 0.8
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.45;
    logger.add(head);

    // Hard hat
    const hatGeometry = new THREE.CylinderGeometry(0.18, 0.2, 0.1, 8);
    const hatMaterial = new THREE.MeshStandardMaterial({
        color: 0xffff00, // Yellow hard hat
        roughness: 0.5
    });
    const hat = new THREE.Mesh(hatGeometry, hatMaterial);
    hat.position.y = 1.6;
    logger.add(hat);

    // Legs
    const legGeometry = new THREE.CylinderGeometry(0.08, 0.1, 0.7, 6);
    const legMaterial = new THREE.MeshStandardMaterial({
        color: 0x333333,
        roughness: 0.8
    });

    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(-0.1, 0.35, 0);
    logger.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(0.1, 0.35, 0);
    logger.add(rightLeg);

    // Arms
    const armGeometry = new THREE.CylinderGeometry(0.05, 0.06, 0.4, 6);
    const armMaterial = new THREE.MeshStandardMaterial({
        color: 0xff6600,
        roughness: 0.7
    });

    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-0.25, 1, 0.1);
    leftArm.rotation.z = 0.5;
    leftArm.rotation.x = -0.3;
    logger.add(leftArm);

    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(0.25, 1, 0.1);
    rightArm.rotation.z = -0.5;
    rightArm.rotation.x = -0.3;
    logger.add(rightArm);

    // Chainsaw (if applicable)
    if (hasChainsaw) {
        const chainsaw = createChainsaw();
        chainsaw.position.set(0.3, 0.8, 0.3);
        chainsaw.rotation.x = -0.5;
        logger.add(chainsaw);
    } else {
        // Axe
        const axe = createAxe();
        axe.position.set(0.3, 0.9, 0.2);
        axe.rotation.z = -0.3;
        logger.add(axe);
    }

    return logger;
}

function createChainsaw() {
    const chainsaw = new THREE.Group();

    // Body
    const bodyGeometry = new THREE.BoxGeometry(0.3, 0.15, 0.1);
    const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0xff4400,
        roughness: 0.5
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    chainsaw.add(body);

    // Blade
    const bladeGeometry = new THREE.BoxGeometry(0.4, 0.05, 0.02);
    const bladeMaterial = new THREE.MeshStandardMaterial({
        color: 0x888888,
        roughness: 0.3,
        metalness: 0.5
    });
    const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
    blade.position.set(0.35, 0, 0);
    chainsaw.add(blade);

    return chainsaw;
}

function createAxe() {
    const axe = new THREE.Group();

    // Handle
    const handleGeometry = new THREE.CylinderGeometry(0.02, 0.025, 0.5, 6);
    const handleMaterial = new THREE.MeshStandardMaterial({
        color: 0x8b4513,
        roughness: 0.8
    });
    const handle = new THREE.Mesh(handleGeometry, handleMaterial);
    axe.add(handle);

    // Head
    const headGeometry = new THREE.BoxGeometry(0.15, 0.1, 0.03);
    const headMaterial = new THREE.MeshStandardMaterial({
        color: 0x666666,
        roughness: 0.4,
        metalness: 0.6
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 0.25;
    axe.add(head);

    return axe;
}
