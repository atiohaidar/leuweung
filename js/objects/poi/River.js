/**
 * River - Water shader and environment
 * @module poi/River
 */

export class River {
    constructor() {
        this.group = new THREE.Group();
        this.createRiver();
    }

    createRiver() {
        // River bed
        const riverGeometry = new THREE.PlaneGeometry(8, 100, 20, 50);

        // Add wave deformation
        const vertices = riverGeometry.attributes.position.array;
        for (let i = 0; i < vertices.length; i += 3) {
            vertices[i] += Math.sin(vertices[i + 1] * 0.2) * 0.5;
        }
        riverGeometry.attributes.position.needsUpdate = true;

        const riverMaterial = new THREE.MeshStandardMaterial({
            color: 0x1e90ff,
            transparent: true,
            opacity: 0.7,
            roughness: 0.1,
            metalness: 0.3
        });

        const river = new THREE.Mesh(riverGeometry, riverMaterial);
        river.rotation.x = -Math.PI / 2;
        river.position.y = -0.3;
        this.group.add(river);

        // River rocks
        for (let i = 0; i < 20; i++) {
            const rockGeometry = new THREE.DodecahedronGeometry(0.2 + Math.random() * 0.3, 0);
            const rockMaterial = new THREE.MeshStandardMaterial({
                color: 0x696969,
                roughness: 0.9
            });
            const rock = new THREE.Mesh(rockGeometry, rockMaterial);
            rock.position.set(
                (Math.random() - 0.5) * 6,
                -0.2,
                (Math.random() - 0.5) * 40
            );
            rock.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            this.group.add(rock);
        }

        // Water sparkles
        const sparkleCount = 100;
        const sparkleGeometry = new THREE.BufferGeometry();
        const sparklePositions = new Float32Array(sparkleCount * 3);

        for (let i = 0; i < sparkleCount * 3; i += 3) {
            sparklePositions[i] = (Math.random() - 0.5) * 6;
            sparklePositions[i + 1] = 0;
            sparklePositions[i + 2] = (Math.random() - 0.5) * 60;
        }

        sparkleGeometry.setAttribute('position', new THREE.BufferAttribute(sparklePositions, 3));

        const sparkleMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.1,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        const sparkles = new THREE.Points(sparkleGeometry, sparkleMaterial);
        sparkles.userData.isSparkle = true;
        this.group.add(sparkles);
    }

    getObject() {
        return this.group;
    }
}
