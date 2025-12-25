/**
 * Animal Interaction - Clickable animals with info popups
 * @module AnimalInteraction
 */

export class AnimalInteraction {
    constructor(sceneManager, pointsOfInterest) {
        this.sceneManager = sceneManager;
        this.scene = sceneManager.getScene();
        this.camera = sceneManager.getCamera();
        this.pointsOfInterest = pointsOfInterest;

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.clickableObjects = [];
        this.popup = null;

        this.animalInfo = {
            deer: {
                name: '🦌 Rusa Hutan',
                description: 'Rusa adalah mamalia herbivora yang hidup berkelompok. Mereka memiliki peran penting dalam menjaga keseimbangan ekosistem hutan.',
                fact: 'Tahukah kamu? Tanduk rusa jantan bisa tumbuh hingga 1 cm per hari!'
            },
            butterfly: {
                name: '🦋 Kupu-kupu',
                description: 'Kupu-kupu adalah serangga penyerbuk yang penting untuk reproduksi tanaman berbunga.',
                fact: 'Kupu-kupu bisa melihat warna ultraviolet yang tidak terlihat oleh mata manusia.'
            },
            firefly: {
                name: '✨ Kunang-kunang',
                description: 'Kunang-kunang menghasilkan cahaya melalui proses bioluminesensi di perut mereka.',
                fact: 'Kunang-kunang menggunakan pola cahaya unik untuk berkomunikasi dan mencari pasangan.'
            }
        };

        this.createPopup();
        this.registerClickableObjects();
        this.bindEvents();
    }

    createPopup() {
        this.popup = document.createElement('div');
        this.popup.className = 'animal-popup';
        this.popup.style.cssText = `
            position: fixed;
            padding: 20px;
            background: rgba(10, 26, 15, 0.95);
            border: 2px solid #a8e6cf;
            border-radius: 15px;
            color: #e8f5e9;
            max-width: 300px;
            z-index: 1000;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease, transform 0.3s ease;
            transform: scale(0.9);
            box-shadow: 0 10px 40px rgba(0,0,0,0.5);
        `;
        this.popup.innerHTML = `
            <h3 class="popup-title" style="color: #a8e6cf; margin-bottom: 10px;"></h3>
            <p class="popup-description" style="margin-bottom: 10px; line-height: 1.6;"></p>
            <p class="popup-fact" style="font-style: italic; color: #88d8b0; font-size: 0.9rem;"></p>
            <button class="popup-close" style="
                position: absolute;
                top: 10px;
                right: 10px;
                background: none;
                border: none;
                color: #a8e6cf;
                font-size: 1.2rem;
                cursor: pointer;
            ">✕</button>
        `;
        document.body.appendChild(this.popup);

        // Close button
        this.popup.querySelector('.popup-close').addEventListener('click', () => {
            this.hidePopup();
        });
    }

    registerClickableObjects() {
        // Register deer from wildlife area
        if (this.pointsOfInterest && this.pointsOfInterest.points.wildlife) {
            const wildlife = this.pointsOfInterest.points.wildlife.object;
            wildlife.children.forEach(child => {
                if (child.children.length > 5) { // Deer has many parts
                    child.userData.animalType = 'deer';
                    child.userData.clickable = true;
                    this.clickableObjects.push(child);
                } else if (child.children.length === 3) { // Butterfly
                    child.userData.animalType = 'butterfly';
                    child.userData.clickable = true;
                    this.clickableObjects.push(child);
                }
            });
        }
    }

    bindEvents() {
        window.addEventListener('click', (e) => this.onClick(e));
    }

    onClick(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);

        // Check for intersections with clickable objects
        const intersects = this.raycaster.intersectObjects(this.clickableObjects, true);

        if (intersects.length > 0) {
            // Find the parent group with animal data
            let clickedObject = intersects[0].object;
            while (clickedObject.parent && !clickedObject.userData.animalType) {
                clickedObject = clickedObject.parent;
            }

            if (clickedObject.userData.animalType) {
                this.showPopup(clickedObject.userData.animalType, event.clientX, event.clientY);

                // Animate the animal
                this.animateAnimal(clickedObject);
            }
        } else {
            this.hidePopup();
        }
    }

    showPopup(animalType, x, y) {
        const info = this.animalInfo[animalType];
        if (!info) return;

        this.popup.querySelector('.popup-title').textContent = info.name;
        this.popup.querySelector('.popup-description').textContent = info.description;
        this.popup.querySelector('.popup-fact').textContent = info.fact;

        // Position popup
        const popupWidth = 300;
        const popupHeight = 200;
        let posX = x + 20;
        let posY = y - 100;

        // Keep popup in viewport
        if (posX + popupWidth > window.innerWidth) {
            posX = x - popupWidth - 20;
        }
        if (posY < 20) posY = 20;
        if (posY + popupHeight > window.innerHeight) {
            posY = window.innerHeight - popupHeight - 20;
        }

        this.popup.style.left = posX + 'px';
        this.popup.style.top = posY + 'px';
        this.popup.style.opacity = '1';
        this.popup.style.pointerEvents = 'auto';
        this.popup.style.transform = 'scale(1)';
    }

    hidePopup() {
        this.popup.style.opacity = '0';
        this.popup.style.pointerEvents = 'none';
        this.popup.style.transform = 'scale(0.9)';
    }

    animateAnimal(animal) {
        // Simple bounce animation
        const startY = animal.position.y;
        const duration = 500;
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Bounce effect
            const bounce = Math.sin(progress * Math.PI) * 0.3;
            animal.position.y = startY + bounce;

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }
}
