// =================== VIDEO CAROUSEL ===================
let currentVideoIndex = 0;
let isPlaying = true;
const videos = document.querySelectorAll('.hero-video');
const dots = document.querySelectorAll('.dot');
const playIcon = document.getElementById('play-icon');
const pauseIcon = document.getElementById('pause-icon');

const videoData = [
    {
        title: "Welcome to our portfolio",
        description: "Discover the world of Bo & Morris"
    },
    {
        title: "Speed & Adrenaline",
        description: "Chasing the thrill with every turn"
    },
    {
        title: "Endurance & Elevation",
        description: "Rising higher, pushing further"
    }
];

// Initialize videos if they exist
if (videos.length > 0) {
    videos.forEach((video, index) => {
        video.addEventListener('ended', () => {
            if (index === currentVideoIndex) {
                changeVideo((index + 1) % videos.length);
            }
        });
    });
}

function changeVideo(index) {
    if (videos.length === 0) return;

    videos[currentVideoIndex].classList.remove('active');
    dots[currentVideoIndex].classList.remove('active');

    currentVideoIndex = index;

    videos[currentVideoIndex].classList.add('active');
    dots[currentVideoIndex].classList.add('active');

    // Update text content
    const titleEl = document.querySelector('.video-title');
    const descEl = document.querySelector('.video-description');

    if (titleEl && descEl) {
        titleEl.textContent = videoData[index].title;
        descEl.textContent = videoData[index].description;
    }

    if (isPlaying) {
        videos[currentVideoIndex].play();
    }
}

function togglePlayPause() {
    if (videos.length === 0) return;

    isPlaying = !isPlaying;

    if (isPlaying) {
        videos[currentVideoIndex].play();
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
    } else {
        videos[currentVideoIndex].pause();
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
    }
}

// =================== ANIMATED COUNTERS ===================
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.ceil(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };

    updateCounter();
}

document.addEventListener('DOMContentLoaded', function () {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.target.textContent === '0') {
                    animateCounter(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(stat => observer.observe(stat));
    }
});

// =================== SMOOTH SCROLL ===================
document.addEventListener('DOMContentLoaded', function () {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#about') return;

            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                const navLinks = document.querySelectorAll('.portfolio-nav a:not([style*="margin-right"])');
                navLinks.forEach(navLink => navLink.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
});

// =================== FILE UPLOAD ===================
function handleUpload(event, person) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const gallery = document.getElementById(person + '-gallery');
            if (gallery) {
                const newItem = document.createElement('div');
                newItem.className = 'hobby-item';
                newItem.innerHTML = `
                    <img src="${e.target.result}" alt="Uploaded image">
                    <div class="hobby-item-overlay"><p>Your Upload</p></div>
                `;
                newItem.style.opacity = '0';
                gallery.appendChild(newItem);
                setTimeout(() => {
                    newItem.style.transition = 'opacity 0.5s';
                    newItem.style.opacity = '1';
                }, 10);
            }
        };
        reader.readAsDataURL(file);
    } else if (file) {
        alert('Please upload an image file (JPG, PNG, GIF, etc.)');
    }
}

// =================== PHOTO GALLERY FILTER ===================
function filterGallery(category, event) {
    const photoItems = document.querySelectorAll('.photo-item');
    const categoryBtns = document.querySelectorAll('.category-btn');

    // Update active button
    categoryBtns.forEach(btn => btn.classList.remove('active'));
    if (event) event.target.classList.add('active');

    // Filter photos
    photoItems.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
            item.style.display = 'block';
            item.style.opacity = '0';
            setTimeout(() => {
                item.style.transition = 'opacity 0.5s';
                item.style.opacity = '1';
            }, 10);
        } else {
            item.style.display = 'none';
        }
    });
}

// =================== DRAG & DROP ===================
document.addEventListener('DOMContentLoaded', function () {
    const uploadAreas = document.querySelectorAll('.upload-area');
    uploadAreas.forEach(area => {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            area.addEventListener(eventName, preventDefaults, false);
            document.body.addEventListener(eventName, preventDefaults, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            area.addEventListener(eventName, () => {
                area.style.borderColor = '#fff';
                area.style.background = '#0a0a0a';
            }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            area.addEventListener(eventName, () => {
                area.style.borderColor = '#444';
                area.style.background = 'transparent';
            }, false);
        });

        area.addEventListener('drop', handleDrop, false);
    });
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length > 0) {
        const uploadArea = e.currentTarget;
        const input = uploadArea.querySelector('input[type="file"]');
        const person = input.id.includes('bo') ? 'bo' : 'morris';
        const mockEvent = { target: { files: files } };
        handleUpload(mockEvent, person);
    }
}

// =================== PARALLAX EFFECT ===================
document.addEventListener('DOMContentLoaded', function () {
    const profileImg = document.querySelector('.profile-img');
    if (profileImg) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;
            if (profileImg.getBoundingClientRect().top < window.innerHeight) {
                profileImg.style.transform = `translateY(${rate}px)`;
            }
        });
    }
});

// =================== PROJECT CARD HOVER ===================
document.addEventListener('DOMContentLoaded', function () {
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.boxShadow = '0 20px 60px rgba(255, 255, 255, 0.1)';
        });
        card.addEventListener('mouseleave', function () {
            this.style.boxShadow = 'none';
        });
    });
});


gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(SplitText);

let tlIntro = gsap.timeline({
  scrollTrigger: {
    trigger: ".intro-section",
    scrub: 1,
    pin: true,
  }
});

tlIntro.to('#text-wrapper', {scale: 130, xPercent: -410, transaformOrigin: "50% 50%"})


let split = new SplitText(".section-2 p", { type: "lines" });
let tlSection2 = gsap.timeline({
  scrollTrigger: {
    trigger: ".section-2",
    start: "30% 50%",
    toggleActions: 'play pause play reset',
  }
});
tlSection2.from(split.lines, {
  opacity: 0,
  y: 100,
  stagger: 0.1
});
