class SparkleAnimation {
    constructor(container) {
        this.container = container;
        this.sparkles = [];
        this.boundary = {
            left: -10,
            right: 110,
            top: -10,
            bottom: 110
        };
        this.init();
    }

    init() {
        for (let i = 0; i < 20; i++) {
            this.createSparkle();
        }
        this.animate();
    }

    createSparkle() {
        const sparkle = document.createElement('div');
        sparkle.classList.add('sparkle');

        // Position aléatoire dans les limites
        const startX = Math.random() * 80 + 10;
        const startY = Math.random() * 80 + 10;

        sparkle.style.left = `${startX}%`;
        sparkle.style.top = `${startY}%`;
        sparkle.size = Math.random() * 4 + 4;
        sparkle.style.width = `${sparkle.size}px`;
        sparkle.style.height = `${sparkle.size}px`;

        // Propriétés de scintillement aléatoires
        sparkle.frequency = Math.random() * 3 + 1; // 1 à 4 Hz
        sparkle.phase = Math.random() * Math.PI * 2; // Décalage aléatoire

        // Vitesse réduite
        sparkle.velocity = {
            x: (Math.random() - 0.5) * 1.2,
            y: (Math.random() - 0.5) * 1.2,
            rotation: (Math.random() - 0.5) * 120
        };

        sparkle.life = Math.random() * 2 + 1;
        sparkle.age = 0;

        this.container.appendChild(sparkle);
        this.sparkles.push(sparkle);
    }

    animate() {
        const now = performance.now();
        const deltaTime = (now - (this.lastTime || now)) / 1000;
        this.lastTime = now;

        this.sparkles.forEach((sparkle, index) => {
            if (!sparkle.parentElement) return;

            let x = parseFloat(sparkle.style.left);
            let y = parseFloat(sparkle.style.top);

            // Contrôle des limites avec rebond
            if (x < this.boundary.left) {
                x = this.boundary.left;
                sparkle.velocity.x *= -0.6;
            }
            if (x > this.boundary.right) {
                x = this.boundary.right;
                sparkle.velocity.x *= -0.6;
            }
            if (y < this.boundary.top) {
                y = this.boundary.top;
                sparkle.velocity.y *= -0.6;
            }
            if (y > this.boundary.bottom) {
                y = this.boundary.bottom;
                sparkle.velocity.y *= -0.6;
            }

            // Mise à jour position
            x += sparkle.velocity.x;
            y += sparkle.velocity.y;

            // Rotation et scale avec scintillement
            const rotation = parseFloat(sparkle.style.rotate || 0) + sparkle.velocity.rotation * deltaTime;
            const scintillement = Math.sin(sparkle.age * sparkle.frequency * 2 * Math.PI + sparkle.phase);
            const scale = 0.8 + scintillement * 0.2;
            const opacity = 0.6 + scintillement * 0.4;

            sparkle.style.transform = `rotate(${rotation}deg) scale(${scale})`;
            sparkle.style.left = `${x}%`;
            sparkle.style.top = `${y}%`;
            sparkle.style.opacity = opacity;

            // Gestion durée de vie
            sparkle.age += deltaTime;
            if (sparkle.age > sparkle.life) {
                sparkle.remove();
                this.sparkles.splice(index, 1);
                this.createSparkle();
            }
        });

        requestAnimationFrame(() => this.animate());
    }
}