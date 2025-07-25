/**
 * Luxe Image Slider - Premium Interactive Gallery
 * Features: Auto-play, keyboard navigation, fullscreen, thumbnails, progress bar
 * Author: Claude AI
 */

class LuxeImageSlider {
    constructor() {
        // Image data with high-quality Unsplash images
        this.images = [
            {
                src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
                title: 'Mountain Serenity',
                description: 'Breathtaking alpine landscape at golden hour'
            },
            {
                src: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
                title: 'Ocean Dreams',
                description: 'Pristine tropical waters meeting endless horizon'
            },
            {
                src: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
                title: 'Urban Elegance',
                description: 'Modern architecture against twilight sky'
            },
            {
                src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
                title: 'Forest Sanctuary',
                description: 'Ancient woodland bathed in morning light'
            },
            {
                src: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
                title: 'Desert Majesty',
                description: 'Vast dunes sculpted by timeless winds'
            },
            {
                src: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
                title: 'Coastal Reflection',
                description: 'Serene shoreline with mirror-like waters'
            }
        ];

        // Current state
        this.currentIndex = 0;
        this.isPlaying = true;
        this.autoplayInterval = null;
        this.autoplaySpeed = 3000; // 3 seconds
        this.isFullscreen = false;
        this.progressInterval = null;
        this.startTime = null;

        // DOM elements
        this.currentImage = document.getElementById('currentImage');
        this.imageTitle = document.getElementById('imageTitle');
        this.imageDescription = document.getElementById('imageDescription');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.fullscreenBtn = document.getElementById('fullscreenBtn');
        this.speedRange = document.getElementById('speedRange');
        this.speedValue = document.getElementById('speedValue');
        this.currentIndexEl = document.getElementById('currentIndex');
        this.totalImagesEl = document.getElementById('totalImages');
        this.progressFill = document.getElementById('progressFill');
        this.thumbnailContainer = document.getElementById('thumbnailContainer');
        this.indicatorsContainer = document.getElementById('indicators');
        this.loadingSpinner = document.getElementById('loadingSpinner');
        this.shortcutsToggle = document.getElementById('shortcutsToggle');
        this.shortcutsPanel = document.getElementById('shortcutsPanel');
        this.sliderContainer = document.getElementById('sliderContainer');

        // Initialize the slider
        this.init();
    }

    /**
     * Initialize the slider with all components
     */
    init() {
        this.createThumbnails();
        this.createIndicators();
        this.updateCounter();
        this.displayImage(0);
        this.setupEventListeners();
        this.startAutoplay();
        this.preloadImages();
    }

    /**
     * Create thumbnail navigation
     */
    createThumbnails() {
        this.thumbnailContainer.innerHTML = '';
        this.images.forEach((image, index) => {
            const thumbnail = document.createElement('div');
            thumbnail.className = 'thumbnail';
            thumbnail.innerHTML = `<img src="${image.src}" alt="${image.title}">`;
            thumbnail.addEventListener('click', () => this.goToSlide(index));
            this.thumbnailContainer.appendChild(thumbnail);
        });
    }

    /**
     * Create slide indicators
     */
    createIndicators() {
        this.indicatorsContainer.innerHTML = '';
        this.images.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.className = 'indicator';
            indicator.addEventListener('click', () => this.goToSlide(index));
            this.indicatorsContainer.appendChild(indicator);
        });
    }

    /**
     * Update the image counter display
     */
    updateCounter() {
        this.currentIndexEl.textContent = this.currentIndex + 1;
        this.totalImagesEl.textContent = this.images.length;
    }

    /**
     * Display image at given index with smooth transition
     */
    displayImage(index, direction = 'next') {
        this.showLoading();
        
        const image = this.images[index];
        
        // Create new image element for smooth transition
        const newImage = new Image();
        newImage.onload = () => {
            // Add transition class based on direction
            this.currentImage.style.transform = direction === 'next' ? 
                'translateX(-100%)' : 'translateX(100%)';
            
            setTimeout(() => {
                this.currentImage.src = image.src;
                this.currentImage.alt = image.title;
                this.imageTitle.textContent = image.title;
                this.imageDescription.textContent = image.description;
                this.currentImage.style.transform = 'translateX(0)';
                
                this.hideLoading();
                this.updateActiveStates();
                this.updateCounter();
                this.resetProgress();
            }, 300);
        };
        
        newImage.src = image.src;
    }

    /**
     * Update active states for thumbnails and indicators
     */
    updateActiveStates() {
        // Update thumbnails
        const thumbnails = this.thumbnailContainer.querySelectorAll('.thumbnail');
        thumbnails.forEach((thumb, index) => {
            thumb.classList.toggle('active', index === this.currentIndex);
        });

        // Update indicators
        const indicators = this.indicatorsContainer.querySelectorAll('.indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentIndex);
        });
    }

    /**
     * Go to next slide
     */
    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.displayImage(this.currentIndex, 'next');
    }

    /**
     * Go to previous slide
     */
    prevSlide() {
        this.currentIndex = this.currentIndex === 0 ? this.images.length - 1 : this.currentIndex - 1;
        this.displayImage(this.currentIndex, 'prev');
    }

    /**
     * Go to specific slide
     */
    goToSlide(index) {
        if (index === this.currentIndex) return;
        
        const direction = index > this.currentIndex ? 'next' : 'prev';
        this.currentIndex = index;
        this.displayImage(this.currentIndex, direction);
    }

    /**
     * Start automatic slideshow
     */
    startAutoplay() {
        if (this.autoplayInterval) return;
        
        this.isPlaying = true;
        this.startTime = Date.now();
        this.updatePlayPauseButton();
        this.updateProgressBar();
        
        this.autoplayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoplaySpeed);
    }

    /**
     * Stop automatic slideshow
     */
    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
        
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
        
        this.isPlaying = false;
        this.updatePlayPauseButton();
        this.progressFill.style.width = '0%';
    }

    /**
     * Toggle play/pause state
     */
    togglePlayPause() {
        if (this.isPlaying) {
            this.stopAutoplay();
        } else {
            this.startAutoplay();
        }
    }

    /**
     * Update play/pause button appearance
     */
    updatePlayPauseButton() {
        const icon = this.playPauseBtn.querySelector('i');
        const text = this.playPauseBtn.querySelector('span');
        
        if (this.isPlaying) {
            icon.className = 'fas fa-pause';
            text.textContent = 'Pause';
        } else {
            icon.className = 'fas fa-play';
            text.textContent = 'Play';
        }
    }

    /**
     * Update progress bar animation
     */
    updateProgressBar() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
        }
        
        this.startTime = Date.now();
        this.progressFill.style.width = '0%';
        
        this.progressInterval = setInterval(() => {
            const elapsed = Date.now() - this.startTime;
            const progress = (elapsed / this.autoplaySpeed) * 100;
            
            if (progress >= 100) {
                this.progressFill.style.width = '100%';
                clearInterval(this.progressInterval);
            } else {
                this.progressFill.style.width = progress + '%';
            }
        }, 50);
    }

    /**
     * Reset progress bar
     */
    resetProgress() {
        if (this.isPlaying) {
            this.updateProgressBar();
        }
    }

    /**
     * Handle speed control changes
     */
    updateSpeed() {
        const speed = parseInt(this.speedRange.value);
        this.autoplaySpeed = speed * 1000;
        this.speedValue.textContent = speed + 's';
        
        if (this.isPlaying) {
            this.stopAutoplay();
            this.startAutoplay();
        }
    }

    /**
     * Toggle fullscreen mode
     */
    toggleFullscreen() {
        if (!this.isFullscreen) {
            this.enterFullscreen();
        } else {
            this.exitFullscreen();
        }
    }

    /**
     * Enter fullscreen mode
     */
    enterFullscreen() {
        this.sliderContainer.classList.add('fullscreen');
        this.isFullscreen = true;
        
        const icon = this.fullscreenBtn.querySelector('i');
        const text = this.fullscreenBtn.querySelector('span');
        icon.className = 'fas fa-compress';
        text.textContent = 'Exit Fullscreen';
        
        // Request fullscreen API if available
        if (this.sliderContainer.requestFullscreen) {
            this.sliderContainer.requestFullscreen();
        } else if (this.sliderContainer.webkitRequestFullscreen) {
            this.sliderContainer.webkitRequestFullscreen();
        } else if (this.sliderContainer.msRequestFullscreen) {
            this.sliderContainer.msRequestFullscreen();
        }
    }

    /**
     * Exit fullscreen mode
     */
    exitFullscreen() {
        this.sliderContainer.classList.remove('fullscreen');
        this.isFullscreen = false;
        
        const icon = this.fullscreenBtn.querySelector('i');
        const text = this.fullscreenBtn.querySelector('span');
        icon.className = 'fas fa-expand';
        text.textContent = 'Fullscreen';
        
        // Exit fullscreen API if available
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }

    /**
     * Show loading spinner
     */
    showLoading() {
        this.loadingSpinner.classList.add('show');
    }

    /**
     * Hide loading spinner
     */
    hideLoading() {
        this.loadingSpinner.classList.remove('show');
    }

    /**
     * Preload all images for smooth transitions
     */
    preloadImages() {
        this.images.forEach(image => {
            const img = new Image();
            img.src = image.src;
        });
    }

    /**
     * Toggle shortcuts panel
     */
    toggleShortcuts() {
        this.shortcutsPanel.classList.toggle('show');
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Navigation buttons
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());

        // Control buttons
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());

        // Speed control
        this.speedRange.addEventListener('input', () => this.updateSpeed());

        // Shortcuts toggle
        this.shortcutsToggle.addEventListener('click', () => this.toggleShortcuts());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.prevSlide();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case ' ':
                    e.preventDefault();
                    this.togglePlayPause();
                    break;
                case 'f':
                case 'F':
                    e.preventDefault();
                    this.toggleFullscreen();
                    break;
                case 'Escape':
                    if (this.isFullscreen) {
                        this.exitFullscreen();
                    }
                    break;
            }
        });

        // Mouse wheel navigation
        this.sliderContainer.addEventListener('wheel', (e) => {
            e.preventDefault();
            if (e.deltaY > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        });

        // Touch/swipe navigation
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;

        this.sliderContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        this.sliderContainer.addEventListener('touchmove', (e) => {
            e.preventDefault();
        });

        this.sliderContainer.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            
            const deltaX = startX - endX;
            const deltaY = startY - endY;
            
            // Check if horizontal swipe is greater than vertical
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (Math.abs(deltaX) > 50) { // Minimum swipe distance
                    if (deltaX > 0) {
                        this.nextSlide();
                    } else {
                        this.prevSlide();
                    }
                }
            }
        });

        // Fullscreen change events
        document.addEventListener('fullscreenchange', () => {
            if (!document.fullscreenElement && this.isFullscreen) {
                this.exitFullscreen();
            }
        });

        document.addEventListener('webkitfullscreenchange', () => {
            if (!document.webkitFullscreenElement && this.isFullscreen) {
                this.exitFullscreen();
            }
        });

        // Click outside to close shortcuts panel
        document.addEventListener('click', (e) => {
            if (!this.shortcutsToggle.contains(e.target) && !this.shortcutsPanel.contains(e.target)) {
                this.shortcutsPanel.classList.remove('show');
            }
        });

        // Pause on hover
        this.sliderContainer.addEventListener('mouseenter', () => {
            if (this.isPlaying) {
                this.stopAutoplay();
            }
        });

        this.sliderContainer.addEventListener('mouseleave', () => {
            if (!this.isPlaying) {
                this.startAutoplay();
            }
        });

        // Window resize handling
        window.addEventListener('resize', () => {
            if (this.isFullscreen) {
                this.sliderContainer.style.height = '100vh';
            }
        });
    }
}

/**
 * Initialize the slider when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    new LuxeImageSlider();
});

/**
 * Add smooth scrolling and page transitions
 */
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Add entrance animations
    const elements = document.querySelectorAll('.header, .slider-wrapper, .control-panel');
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 200);
    });
});

/**
 * Add advanced cursor effects
 */
document.addEventListener('mousemove', (e) => {
    const cursor = document.querySelector('.cursor');
    if (!cursor) {
        const cursorEl = document.createElement('div');
        cursorEl.className = 'cursor';
        cursorEl.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, rgba(212, 175, 55, 0.8) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s ease;
        `;
        document.body.appendChild(cursorEl);
    }
    
    const cursor2 = document.querySelector('.cursor');
    cursor2.style.left = e.clientX - 10 + 'px';
    cursor2.style.top = e.clientY - 10 + 'px';
});

/**
 * Add performance optimization
 */
let ticking = false;

function updateSlider() {
    // Optimize animations and transitions
    ticking = false;
}

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateSlider);
        ticking = true;
    }
}

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LuxeImageSlider;
}