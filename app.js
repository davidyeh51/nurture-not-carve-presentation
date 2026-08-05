/* Presentation App Logic */
document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.slide-card');
  const navItems = document.querySelectorAll('.nav-item');
  const progressBar = document.getElementById('progressBar');
  const slideCounter = document.getElementById('slideCounter');
  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');
  const btnModeSlide = document.getElementById('btnModeSlide');
  const btnModeScroll = document.getElementById('btnModeScroll');
  const searchInput = document.getElementById('searchInput');
  const filterBtns = document.querySelectorAll('.tag-btn');

  let currentIndex = 0;
  let isSlideMode = true;

  // Initialize
  function updateUI() {
    slides.forEach((slide, idx) => {
      if (isSlideMode) {
        slide.classList.toggle('active-slide', idx === currentIndex);
      } else {
        slide.classList.add('active-slide');
      }
    });

    navItems.forEach((item, idx) => {
      const targetId = item.getAttribute('data-target');
      const slideId = slides[currentIndex]?.id;
      item.classList.toggle('active', isSlideMode && targetId === slideId);
    });

    // Progress bar
    const total = slides.length;
    const progress = total > 1 ? (currentIndex / (total - 1)) * 100 : 100;
    if (progressBar) progressBar.style.width = `${progress}%`;

    // Counter text
    if (slideCounter) {
      slideCounter.textContent = `${currentIndex + 1} / ${total}`;
    }

    // Scroll to top of current slide in slide mode
    if (isSlideMode && slides[currentIndex]) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function goToSlide(index) {
    if (index < 0) index = 0;
    if (index >= slides.length) index = slides.length - 1;
    currentIndex = index;
    updateUI();
  }

  function nextSlide() {
    if (currentIndex < slides.length - 1) {
      goToSlide(currentIndex + 1);
    }
  }

  function prevSlide() {
    if (currentIndex > 0) {
      goToSlide(currentIndex - 1);
    }
  }

  // Mode Switchers
  if (btnModeSlide && btnModeScroll) {
    btnModeSlide.addEventListener('click', () => {
      isSlideMode = true;
      document.body.classList.add('mode-slide');
      btnModeSlide.classList.add('active');
      btnModeScroll.classList.remove('active');
      updateUI();
    });

    btnModeScroll.addEventListener('click', () => {
      isSlideMode = false;
      document.body.classList.remove('mode-slide');
      btnModeScroll.classList.add('active');
      btnModeSlide.classList.remove('active');
      updateUI();
    });
  }

  // Nav Item Clicks
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = item.getAttribute('data-target');
      const targetIndex = Array.from(slides).findIndex(s => s.id === targetId);
      if (targetIndex !== -1) {
        if (!isSlideMode) {
          document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
        } else {
          goToSlide(targetIndex);
        }
      }
    });
  });

  // Prev / Next Buttons
  if (btnPrev) btnPrev.addEventListener('click', prevSlide);
  if (btnNext) btnNext.addEventListener('click', nextSlide);

  // Keyboard Navigation
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    if (isSlideMode) {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      }
    }
  });

  // Search Input Filter
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      slides.forEach(slide => {
        const text = slide.textContent.toLowerCase();
        const matches = text.includes(query);
        if (query) {
          slide.style.display = matches ? 'block' : 'none';
        } else {
          slide.style.display = '';
        }
      });
    });
  }

  // Filter Buttons by Priority
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      navItems.forEach(item => {
        const priority = item.getAttribute('data-priority');
        if (filter === 'all' || priority === filter) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Initial State
  document.body.classList.add('mode-slide');
  updateUI();
});
