/**
 * Warning Sign Factory
 * @module objects/deforestation/WarningSign
 */

export function createWarningSign() {
    const sign = new THREE.Group();

    // Post
    const postGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1.5, 6);
    const postMaterial = new THREE.MeshStandardMaterial({
        color: 0x8b4513,
        roughness: 0.8
    });
    const post = new THREE.Mesh(postGeometry, postMaterial);
    post.position.y = 0.75;
    sign.add(post);

    // Sign board
    const boardGeometry = new THREE.BoxGeometry(0.8, 0.5, 0.05);
    const boardMaterial = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        roughness: 0.6
    });
    const board = new THREE.Mesh(boardGeometry, boardMaterial);
    board.position.y = 1.5;
    sign.add(board);

    // Warning text (simplified as white rectangle)
    const textGeometry = new THREE.PlaneGeometry(0.6, 0.08);
    const textMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff
    });
    const text = new THREE.Mesh(textGeometry, textMaterial);
    text.position.set(0, 1.5, 0.03);
    sign.add(text);

    return sign;
}
