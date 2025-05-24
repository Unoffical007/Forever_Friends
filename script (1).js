// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Get audio element and set up
  const backgroundMusic = document.getElementById("background-music")
  backgroundMusic.volume = 0.7 // Set volume to 70%

  // Photo and lyric elements
  const photos = document.querySelectorAll(".photo-container img")
  const lyrics = document.querySelectorAll(".lyrics-container .lyric")
  let currentIndex = 0
  let isPlaying = true
  let isTransitioning = false

  // Control elements
  const prevBtn = document.getElementById("prev-btn")
  const playPauseBtn = document.getElementById("play-pause-btn")
  const nextBtn = document.getElementById("next-btn")
  const restartBtn = document.getElementById("restart-btn")
  const musicToggle = document.getElementById("music-toggle")
  const musicStatus = document.querySelector(".music-status")
  const currentSlideSpan = document.querySelector(".current-slide")
  const totalSlidesSpan = document.querySelector(".total-slides")

  // Set total slides
  totalSlidesSpan.textContent = photos.length

  // Enhanced function to show specific photo and lyric with advanced animations
  function showSlide(index, direction = 'none') {
    // Prevent rapid switching during transitions
    if (isTransitioning) return
    
    // Validate index
    if (index < 0 || index >= photos.length) return
    
    // If same slide, do nothing
    if (currentIndex === index) return

    isTransitioning = true
    console.log(`🎨 Switching to slide ${index + 1} with ${direction} animation`)

    const currentPhoto = photos[currentIndex]
    const currentLyric = lyrics[currentIndex]
    const nextPhoto = photos[index]
    const nextLyric = lyrics[index]

    // Remove all animation classes first
    photos.forEach(photo => {
      photo.classList.remove('slide-in-right', 'slide-in-left', 'slide-out-right', 'slide-out-left')
    })
    lyrics.forEach(lyric => {
      lyric.classList.remove('fade-in', 'fade-out')
    })

    // Animate out current elements
    if (direction === 'next') {
      currentPhoto.classList.add('slide-out-left')
      currentLyric.classList.add('fade-out')
    } else if (direction === 'prev') {
      currentPhoto.classList.add('slide-out-right')
      currentLyric.classList.add('fade-out')
    } else {
      // Default fade out
      currentPhoto.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out'
      currentPhoto.style.opacity = '0'
      currentPhoto.style.transform = 'scale(0.95)'
      currentLyric.classList.add('fade-out')
    }

    // Hide current elements after animation
    setTimeout(() => {
      currentPhoto.classList.remove('active')
      currentLyric.classList.remove('active')
      
      // Show next elements
      nextPhoto.classList.add('active')
      nextLyric.classList.add('active')

      // Animate in next elements
      if (direction === 'next') {
        nextPhoto.classList.add('slide-in-right')
        nextLyric.classList.add('fade-in')
      } else if (direction === 'prev') {
        nextPhoto.classList.add('slide-in-left')
        nextLyric.classList.add('fade-in')
      } else {
        // Default fade in
        setTimeout(() => {
          nextPhoto.style.transition = 'opacity 0.8s ease-in, transform 0.8s ease-in'
          nextPhoto.style.opacity = '1'
          nextPhoto.style.transform = 'scale(1)'
          nextLyric.classList.add('fade-in')
        }, 50)
      }

      currentIndex = index
      currentSlideSpan.textContent = currentIndex + 1

      // Reset transition flag after animation completes
      setTimeout(() => {
        isTransitioning = false
        // Clean up animation classes
        photos.forEach(photo => {
          photo.classList.remove('slide-in-right', 'slide-in-left', 'slide-out-right', 'slide-out-left')
        })
        lyrics.forEach(lyric => {
          lyric.classList.remove('fade-in', 'fade-out')
        })
      }, 800)

    }, direction === 'none' ? 600 : 600)
  }

  // Function to show the next photo and lyric
  function showNext() {
    if (isTransitioning) return
    const nextIndex = (currentIndex + 1) % photos.length
    showSlide(nextIndex, 'next')
    
    // Add button animation
    addRippleEffect(nextBtn)
  }

  // Function to show the previous photo and lyric
  function showPrevious() {
    if (isTransitioning) return
    const prevIndex = (currentIndex - 1 + photos.length) % photos.length
    showSlide(prevIndex, 'prev')
    
    // Add button animation
    addRippleEffect(prevBtn)
  }

  // Function to restart everything
  function restart() {
    backgroundMusic.currentTime = 0
    showSlide(0, 'none')
    if (isPlaying) {
      backgroundMusic.play()
    }
    
    // Add button animation
    addRippleEffect(restartBtn)
  }

  // Function to toggle music
  function toggleMusic() {
    if (backgroundMusic.paused) {
      backgroundMusic
        .play()
        .then(() => {
          musicToggle.querySelector('span').textContent = "🎵"
          musicToggle.classList.remove("paused")
          musicStatus.textContent = "Music Playing"
        })
        .catch((error) => {
          console.log("❌ Error playing music:", error)
        })
    } else {
      backgroundMusic.pause()
      musicToggle.querySelector('span').textContent = "🔇"
      musicToggle.classList.add("paused")
      musicStatus.textContent = "Music Paused"
    }
    
    // Add button animation
    addRippleEffect(musicToggle)
  }

  // Function to toggle play/pause
  function togglePlayPause() {
    if (isPlaying) {
      backgroundMusic.pause()
      playPauseBtn.querySelector('span').textContent = "▶"
    } else {
      backgroundMusic.play()
      playPauseBtn.querySelector('span').textContent = "⏸"
    }
    isPlaying = !isPlaying
    
    // Add button animation
    addRippleEffect(playPauseBtn)
  }

  // Enhanced ripple effect function
  function addRippleEffect(button) {
    const ripple = button.querySelector('.btn-ripple')
    const rect = button.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    
    ripple.style.width = ripple.style.height = size + 'px'
    ripple.style.left = '50%'
    ripple.style.top = '50%'
    ripple.style.transform = 'translate(-50%, -50%) scale(0)'
    
    // Trigger animation
    ripple.style.animation = 'none'
    ripple.offsetHeight // Trigger reflow
    ripple.style.animation = 'ripple 0.6s linear'
  }

  // Auto-play music when page loads
  function initializeMusic() {
    backgroundMusic.preload = "auto"
    backgroundMusic.load()

    const playPromise = backgroundMusic.play()

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          musicToggle.querySelector('span').textContent = "🎵"
          musicStatus.textContent = "Music Playing"
          console.log("🎵 Music started playing automatically")
        })
        .catch((error) => {
          console.log("⚠️ Auto-play prevented, user interaction required")
          musicToggle.querySelector('span').textContent = "🔇"
          musicToggle.classList.add("paused")
          musicStatus.textContent = "Click 🎵 to Play Music"
        })
    }
  }

  // Event Listeners
  prevBtn.addEventListener("click", showPrevious)
  nextBtn.addEventListener("click", showNext)
  playPauseBtn.addEventListener("click", togglePlayPause)
  restartBtn.addEventListener("click", restart)
  musicToggle.addEventListener("click", toggleMusic)

  // Keyboard controls for better user experience
  document.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
      e.preventDefault()
      showPrevious()
    } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
      e.preventDefault()
      showNext()
    } else if (e.code === 'Space') {
      e.preventDefault()
      togglePlayPause()
    } else if (e.code === 'KeyR') {
      e.preventDefault()
      restart()
    }
  })

  // Touch/swipe support for mobile
  let touchStartX = 0
  let touchEndX = 0

  document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX
  })

  document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX
    handleSwipe()
  })

  function handleSwipe() {
    const swipeThreshold = 50
    const diff = touchStartX - touchEndX

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swiped left - show next
        showNext()
      } else {
        // Swiped right - show previous
        showPrevious()
      }
    }
  }

  // Enable user interaction to start music
  document.body.addEventListener(
    "click",
    () => {
      if (backgroundMusic.paused && isPlaying) {
        backgroundMusic
          .play()
          .then(() => {
            musicToggle.querySelector('span').textContent = "🎵"
            musicToggle.classList.remove("paused")
            musicStatus.textContent = "Music Playing"
          })
          .catch((error) => {
            console.log("❌ Error starting music:", error)
          })
      }
    },
    { once: true }
  )

  // Initialize everything
  initializeMusic()

  // Show first slide immediately
  showSlide(0, 'none')

  // Enhanced confetti animation
  const canvas = document.getElementById("confetti-canvas")
  const ctx = canvas.getContext("2d")

  function resizeCanvas() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }

  resizeCanvas()
  window.addEventListener("resize", resizeCanvas)

  const particles = []
  const particleCount = 40
  const colors = ["#ff6b6b", "#ff8e8e", "#ffb8b8", "#ffd8d8", "#f5a9b8", "#d0bdf4", "#a0d2eb", "#d4f0f0"]

  function drawHeart(ctx, x, y, size) {
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.bezierCurveTo(x, y - size / 3, x - size, y - size / 3, x - size, y + size / 3)
    ctx.bezierCurveTo(x - size, y + size, x, y + size * 1.3, x, y + size * 1.3)
    ctx.bezierCurveTo(x, y + size * 1.3, x + size, y + size, x + size, y + size / 3)
    ctx.bezierCurveTo(x + size, y - size / 3, x, y - size / 3, x, y)
    ctx.closePath()
    ctx.fill()
  }

  function createParticles() {
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 3 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 0.8 + 0.4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 1.2,
        isHeart: Math.random() > 0.6,
      })
    }
  }

  function updateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]

      p.y += p.speed
      p.rotation += p.rotationSpeed

      if (p.y > canvas.height + p.size) {
        p.y = -p.size
        p.x = Math.random() * canvas.width
      }

      ctx.fillStyle = p.color
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate((p.rotation * Math.PI) / 180)

      if (p.isHeart) {
        drawHeart(ctx, 0, 0, p.size)
      } else {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size / 2)
      }

      ctx.restore()
    }

    requestAnimationFrame(updateParticles)
  }

  createParticles()
  updateParticles()

  console.log("🎉 Manual slideshow initialized! Use buttons, keyboard (←/→/Space/R), or swipe to control.")
})