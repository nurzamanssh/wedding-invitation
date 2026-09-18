/**
 * The Wedding of Nurjaman & Nabilah
 * Interactive Script - Indonesian Spring Romance Theme
 */

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------
  // 1. GUEST NAME PERSONALIZATION (?to=Nama+Tamu)
  // -------------------------------------------------------------
  function setupGuestName() {
    const urlParams = new URLSearchParams(window.location.search);
    const guestParam = urlParams.get('to') || urlParams.get('guest') || urlParams.get('u');
    const guestNameEl = document.getElementById('guest-name');

    if (guestParam && guestNameEl) {
      // Decode and sanitize basic text
      const cleanName = decodeURIComponent(guestParam.replace(/\+/g, ' ')).trim();
      if (cleanName.length > 0) {
        guestNameEl.textContent = cleanName;
      }
    }
  }
  setupGuestName();

  // -------------------------------------------------------------
  // 2. AUDIO & MUSIC SYSTEM (Audio Tag + Web Audio Fallback)
  // -------------------------------------------------------------
  const audioEl = document.getElementById('wedding-audio');
  const audioToggleBtn = document.getElementById('audio-toggle-btn');
  const audioIcon = document.getElementById('audio-icon');
  const audioControl = document.getElementById('audio-control');
  const bottomNav = document.getElementById('bottom-nav');
  let isPlaying = false;
  let synthAudioCtx = null;
  let synthInterval = null;

  // Web Audio API Fallback Synthesizer (Sweet Romantic Chimes & Harp Arpeggios)
  function startHarpChimes() {
    if (synthAudioCtx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      synthAudioCtx = new AudioCtx();

      // Romantic pentatonic chord notes (C major / A minor scale) in Hz
      // C4, E4, G4, B4, C5, E5, G5, A5
      const notes = [261.63, 329.63, 392.00, 493.88, 523.25, 659.25, 783.99, 880.00];
      let step = 0;

      function playChime(freq, delaySec = 0) {
        if (!synthAudioCtx) return;
        const osc = synthAudioCtx.createOscillator();
        const gain = synthAudioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, synthAudioCtx.currentTime + delaySec);

        // Soft bell-like decay envelope
        gain.gain.setValueAtTime(0.001, synthAudioCtx.currentTime + delaySec);
        gain.gain.exponentialRampToValueAtTime(0.08, synthAudioCtx.currentTime + delaySec + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, synthAudioCtx.currentTime + delaySec + 2.2);

        osc.connect(gain);
        gain.connect(synthAudioCtx.destination);

        osc.start(synthAudioCtx.currentTime + delaySec);
        osc.stop(synthAudioCtx.currentTime + delaySec + 2.3);
      }

      // Play soft arpeggios every 2.4 seconds
      synthInterval = setInterval(() => {
        if (!isPlaying || !synthAudioCtx) return;
        const baseNote = notes[step % notes.length];
        const secondNote = notes[(step + 2) % notes.length];
        const thirdNote = notes[(step + 4) % notes.length];
        playChime(baseNote, 0);
        playChime(secondNote, 0.35);
        playChime(thirdNote, 0.7);
        step++;
      }, 2400);

    } catch (e) {
      console.warn('Web Audio fallback unavailable:', e);
    }
  }

  function stopHarpChimes() {
    if (synthInterval) {
      clearInterval(synthInterval);
      synthInterval = null;
    }
    if (synthAudioCtx) {
      synthAudioCtx.close().catch(() => { });
      synthAudioCtx = null;
    }
  }

  function playMusic() {
    isPlaying = true;
    audioIcon.className = 'fa-solid fa-compact-disc spin';
    audioToggleBtn.setAttribute('title', 'Jeda Musik');

    if (audioEl) {
      audioEl.play().catch((err) => {
        console.log('HTML5 Audio playback prevented, starting synthesized harp chimes:', err);
        startHarpChimes();
      });
    } else {
      startHarpChimes();
    }
  }

  function pauseMusic() {
    isPlaying = false;
    audioIcon.className = 'fa-solid fa-circle-pause';
    audioToggleBtn.setAttribute('title', 'Putar Musik');

    if (audioEl) {
      audioEl.pause();
    }
    stopHarpChimes();
  }

  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => {
      if (isPlaying) {
        pauseMusic();
      } else {
        playMusic();
      }
    });
  }

  // -------------------------------------------------------------
  // 3. COVER SCREEN "BUKA UNDANGAN" TRIGGER
  // -------------------------------------------------------------
  const openBtn = document.getElementById('open-invitation-btn');
  const coverScreen = document.getElementById('cover-screen');
  const mainContent = document.getElementById('main-content');

  if (openBtn) {
    openBtn.addEventListener('click', () => {
      // 1. Reveal main content
      mainContent.classList.remove('locked');

      // 2. Play background music
      playMusic();

      // 3. Show floating controls
      audioControl.classList.remove('hidden');
      bottomNav.classList.remove('hidden');

      // 4. Animate cover transition
      coverScreen.classList.add('opened');

      // 5. Scroll smoothly to hero top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // -------------------------------------------------------------
  // 4. FALLING PETALS CANVAS (Indonesian Spring Blossom Atmosphere)
  // -------------------------------------------------------------
  const canvas = document.getElementById('petals-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const petalColors = [
      'rgba(247, 212, 215, 0.75)', // Soft blush sakura pink
      'rgba(255, 235, 238, 0.85)', // Light ivory blossom
      'rgba(244, 186, 194, 0.70)', // Deeper bougainvillea rose
      'rgba(255, 255, 255, 0.85)', // Pure jasmine white
      'rgba(213, 228, 216, 0.55)', // Fresh soft sage green petal
      'rgba(223, 193, 133, 0.40)'  // Gold fairy dust spark
    ];

    const petals = [];
    const petalCount = Math.min(36, Math.floor(window.innerWidth / 35));

    class Petal {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : -20;
        this.size = 9 + Math.random() * 12;
        this.speedY = 0.8 + Math.random() * 1.5;
        this.speedX = -0.5 + Math.random() * 1.2;
        this.color = petalColors[Math.floor(Math.random() * petalColors.length)];
        this.angle = Math.random() * 360;
        this.angularSpeed = (Math.random() - 0.5) * 1.6;
        this.oscillationSpeed = 0.015 + Math.random() * 0.02;
        this.oscillationDistance = 25 + Math.random() * 40;
        this.seed = Math.random() * 1000;
      }

      update() {
        this.y += this.speedY;
        this.seed += this.oscillationSpeed;
        this.x += Math.sin(this.seed) * 0.9 + this.speedX * 0.4;
        this.angle += this.angularSpeed;

        if (this.y > height + 20 || this.x > width + 30 || this.x < -30) {
          this.reset(false);
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.angle * Math.PI) / 180);

        ctx.fillStyle = this.color;
        ctx.beginPath();
        // Delicate oval petal shape with pointed tip
        ctx.moveTo(0, -this.size / 2);
        ctx.bezierCurveTo(this.size / 2, -this.size / 2, this.size / 1.6, this.size / 2, 0, this.size);
        ctx.bezierCurveTo(-this.size / 1.6, this.size / 2, -this.size / 2, -this.size / 2, 0, -this.size / 2);
        ctx.fill();

        ctx.restore();
      }
    }

    for (let i = 0; i < petalCount; i++) {
      petals.push(new Petal());
    }

    function animatePetals() {
      ctx.clearRect(0, 0, width, height);
      for (const petal of petals) {
        petal.update();
        petal.draw();
      }
      requestAnimationFrame(animatePetals);
    }
    animatePetals();
  }

  // -------------------------------------------------------------
  // 5. COUNTDOWN TIMER TO WEDDING DAY
  // -------------------------------------------------------------
  function setupCountdown() {
    // Target: 24 October 2026, 08:00 WIB
    const weddingDate = new Date('2026-10-24T08:00:00+07:00').getTime();

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    function updateCountdown() {
      const now = new Date().getTime();
      const distance = weddingDate - now;

      if (distance < 0) {
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      daysEl.textContent = String(days).padStart(2, '0');
      hoursEl.textContent = String(hours).padStart(2, '0');
      minutesEl.textContent = String(minutes).padStart(2, '0');
      secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }
  setupCountdown();

  // -------------------------------------------------------------
  // 6. TOAST NOTIFICATION & COPY TO CLIPBOARD
  // -------------------------------------------------------------
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');
  let toastTimeout = null;

  function showToast(message) {
    if (!toast) return;
    if (toastText) toastText.textContent = message;
    toast.classList.remove('hidden');

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.add('hidden');
    }, 3200);
  }

  // Handle all copy buttons
  const copyButtons = document.querySelectorAll('[data-copy]');
  copyButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Berhasil disalin: ${textToCopy}`);
        }).catch(() => {
          fallbackCopy(textToCopy);
        });
      } else {
        fallbackCopy(textToCopy);
      }
    });
  });

  function fallbackCopy(text) {
    const tempInput = document.createElement('textarea');
    tempInput.value = text;
    tempInput.style.position = 'fixed';
    tempInput.style.left = '-9999px';
    document.body.appendChild(tempInput);
    tempInput.focus();
    tempInput.select();
    try {
      document.execCommand('copy');
      showToast(`Berhasil disalin: ${text}`);
    } catch (err) {
      showToast('Gagal menyalin teks.');
    }
    document.body.removeChild(tempInput);
  }

  // -------------------------------------------------------------
  // 7. QRIS MODAL & DOWNLOAD IMAGE
  // -------------------------------------------------------------
  const qrisModal = document.getElementById('qris-modal');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const btnZoomQris = document.getElementById('btn-zoom-qris');
  const qrisClickWrapper = document.getElementById('qris-click-wrapper');
  const modalQrisTarget = document.getElementById('modal-qris-target');
  const btnDownloadQris = document.getElementById('btn-download-qris');
  const modalDownloadBtn = document.getElementById('modal-download-btn');
  const originalQrisSvg = document.getElementById('qris-svg');

  function openQrisModal() {
    if (!qrisModal) return;
    if (modalQrisTarget && originalQrisSvg && !modalQrisTarget.hasChildNodes()) {
      const clone = originalQrisSvg.cloneNode(true);
      modalQrisTarget.appendChild(clone);
    }
    qrisModal.classList.remove('hidden');
  }

  function closeQrisModal() {
    if (!qrisModal) return;
    qrisModal.classList.add('hidden');
  }

  if (btnZoomQris) btnZoomQris.addEventListener('click', openQrisModal);
  if (qrisClickWrapper) qrisClickWrapper.addEventListener('click', openQrisModal);
  if (btnCloseModal) btnCloseModal.addEventListener('click', closeQrisModal);

  if (qrisModal) {
    qrisModal.addEventListener('click', (e) => {
      if (e.target === qrisModal) {
        closeQrisModal();
      }
    });
  }

  // Function to download QRIS as PNG image
  function downloadQrisPng() {
    if (!originalQrisSvg) return;

    // Convert SVG to Canvas and trigger download
    const svgData = new XMLSerializer().serializeToString(originalQrisSvg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const URL = window.URL || window.webkitURL || window;
    const blobURL = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      const downloadCanvas = document.createElement('canvas');
      // Create high-res canvas (600x600)
      downloadCanvas.width = 600;
      downloadCanvas.height = 600;
      const dCtx = downloadCanvas.getContext('2d');

      // White background
      dCtx.fillStyle = '#FFFFFF';
      dCtx.fillRect(0, 0, 600, 600);
      dCtx.drawImage(img, 0, 0, 600, 600);

      const pngUrl = downloadCanvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = 'QRIS_Wedding_Nurjaman_Nabilah.png';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(blobURL);

      showToast('Gambar QRIS berhasil diunduh!');
    };
    img.src = blobURL;
  }

  if (btnDownloadQris) btnDownloadQris.addEventListener('click', downloadQrisPng);
  if (modalDownloadBtn) modalDownloadBtn.addEventListener('click', downloadQrisPng);

  // -------------------------------------------------------------
  // 8. RSVP & GUESTBOOK (Interactive with localStorage)
  // -------------------------------------------------------------
  const STORAGE_KEY = 'wedding_wishes_Nurjaman_Nabilah_v1';
  const wishesForm = document.getElementById('wishes-form');
  const wishesList = document.getElementById('wishes-list');
  const wishesCountBadge = document.getElementById('wishes-count-badge');

  // Curated initial heartfelt wishes
  const defaultWishes = [
    {
      name: 'Dimas Aditya & Anisa',
      attendance: 'Hadir',
      message: 'Barakallahu lakuma wa baraka alaika wa jamaa bainakuma fii khoir. Selamat berbahagia Mas Nurjaman & Mbak Nabilah! Semoga selalu diberkahi kebahagiaan dan sakinah selamanya.',
      time: '1 jam yang lalu'
    },
    {
      name: 'Rian Pratama, S.T.',
      attendance: 'Hadir',
      message: 'Alhamdulillah selamat menempuh hidup baru sahabatku Nurjaman! Selamat juga untuk Nabilah. Lancar jaya acaranya sampai hari H!',
      time: '3 jam yang lalu'
    },
    {
      name: 'Citra Kirana Wardhani',
      attendance: 'Hadir',
      message: 'Happy wedding Nabilah sayang & Mas Nurjaman! Cantik dan ganteng banget serasi. Semoga cinta kalian abadi hingga surga nanti ya.',
      time: '5 jam yang lalu'
    },
    {
      name: 'Keluarga Bpk. H. Hendro',
      attendance: 'Hadir',
      message: 'Selamat atas pernikahan ananda Nurjaman dan Nabilah. Semoga menjadi keluarga yang sakinah, mawaddah, warahmah serta dikaruniai keturunan yang sholeh dan sholehah.',
      time: '1 hari yang lalu'
    },
    {
      name: 'Fandi & Jessica',
      attendance: 'Tidak Hadir',
      message: 'Selamat Nurjaman & Nabilah! Maaf kami belum bisa hadir langsung karena dinas luar kota, tapi doa tulus kami selalu menyertai kalian berdua.',
      time: '2 hari yang lalu'
    }
  ];

  function getStoredWishes() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    return defaultWishes;
  }

  function saveWishes(wishes) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishes));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  function getInitials(name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }

  function renderWishes() {
    if (!wishesList) return;
    const wishes = getStoredWishes();

    if (wishesCountBadge) {
      wishesCountBadge.textContent = `${wishes.length} Doa & Ucapan`;
    }

    wishesList.innerHTML = '';
    wishes.forEach((item) => {
      const bubble = document.createElement('div');
      bubble.className = 'wish-bubble';

      let badgeClass = 'hadir';
      let badgeLabel = '✓ Hadir';
      if (item.attendance === 'Tidak Hadir') {
        badgeClass = 'tidak';
        badgeLabel = '✗ Tidak Hadir';
      } else if (item.attendance === 'Masih Ragu') {
        badgeClass = 'ragu';
        badgeLabel = '? Ragu-ragu';
      }

      bubble.innerHTML = `
        <div class="wish-header">
          <div class="wish-author-info">
            <div class="wish-avatar">${getInitials(item.name)}</div>
            <span class="wish-author-name">${escapeHtml(item.name)}</span>
          </div>
          <span class="wish-attendance-badge ${badgeClass}">${badgeLabel}</span>
        </div>
        <p class="wish-text">${escapeHtml(item.message)}</p>
        <span class="wish-time"><i class="fa-regular fa-clock"></i> ${escapeHtml(item.time || 'Baru saja')}</span>
      `;
      wishesList.appendChild(bubble);
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  if (wishesForm) {
    wishesForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('input-name');
      const attendanceSelect = document.getElementById('select-attendance');
      const messageInput = document.getElementById('input-message');

      const name = nameInput ? nameInput.value.trim() : '';
      const attendance = attendanceSelect ? attendanceSelect.value : 'Hadir';
      const message = messageInput ? messageInput.value.trim() : '';

      if (!name || !message) {
        showToast('Mohon lengkapi nama dan doa ucapan Anda.');
        return;
      }

      const newWish = {
        name,
        attendance,
        message,
        time: 'Baru saja'
      };

      const wishes = getStoredWishes();
      wishes.unshift(newWish);
      saveWishes(wishes);
      renderWishes();

      // Reset form
      wishesForm.reset();
      showToast('Terima kasih! Doa dan konfirmasi Anda telah tersimpan.');
    });
  }

  renderWishes();

  // -------------------------------------------------------------
  // 9. BOTTOM NAV SCROLL SPY
  // -------------------------------------------------------------
  const navLinks = document.querySelectorAll('.bottom-nav .nav-item');
  const sections = ['hero', 'mempelai', 'acara', 'lokasi', 'hadiah', 'ucapan'];

  window.addEventListener('scroll', () => {
    let current = 'hero';
    sections.forEach((secId) => {
      const sec = document.getElementById(secId);
      if (sec) {
        const top = sec.offsetTop - 200;
        if (window.scrollY >= top) {
          current = secId;
        }
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('data-target') === current) {
        link.classList.add('active');
      }
    });
  });
});
