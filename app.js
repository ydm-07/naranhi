/* =========================================================
   Naran-hi (나란히) - Desktop App Logic
========================================================= */

const app = {
  state: {
    currentView: 'dashboard',
    timerRunning: false,
    timerSeconds: 25 * 60,
    timerInterval: null
  },

  init() {
    this.setupTimer();
    this.setupCheckboxes();
    this.setupSubjectTabs();
    this.updateClock();
  },

  switchView(viewId, clickedElement, isTopNav = false) {
    // Hide all views
    document.querySelectorAll('.view').forEach(view => {
      view.classList.add('hidden');
      view.classList.remove('active');
    });

    // Show target view
    const targetView = document.getElementById(`view-${viewId}`);
    if (targetView) {
      targetView.classList.remove('hidden');
      targetView.classList.add('active');
    }

    // Update Side Nav
    if (!isTopNav) {
      document.querySelectorAll('.side-nav .nav-item').forEach(item => {
        item.classList.remove('active');
      });
      if (clickedElement && clickedElement.classList.contains('nav-item')) {
        clickedElement.classList.add('active');
      } else {
        // Find corresponding side nav item
        const sideNavItems = document.querySelectorAll('.side-nav .nav-item');
        if (viewId === 'dashboard' || viewId === 'lectures') {
           sideNavItems[0].classList.add('active'); // fallback
        } else if (viewId === 'timer') {
           sideNavItems[1].classList.add('active');
        } else if (viewId === 'qa') {
           sideNavItems[2].classList.add('active');
        }
      }
    }

    // Update Top Nav
    document.querySelectorAll('.top-link').forEach(link => {
      link.classList.remove('active');
    });
    
    // Find corresponding top link based on text or id
    const topLinks = document.querySelectorAll('.top-link');
    if (viewId === 'dashboard') topLinks[0].classList.add('active');
    if (viewId === 'lectures') topLinks[1].classList.add('active');
    if (viewId === 'timer') topLinks[2].classList.add('active');

    // Show/Hide search box based on view
    const searchBox = document.getElementById('top-search');
    if (viewId === 'lectures') {
      searchBox.classList.remove('hidden');
    } else {
      searchBox.classList.add('hidden');
    }
  },

  setupTimer() {
    const playBtn = document.getElementById('btn-play-pause');
    const timeDisplay = document.getElementById('pomo-time');
    
    if(!playBtn || !timeDisplay) return;

    playBtn.addEventListener('click', () => {
      if (this.state.timerRunning) {
        clearInterval(this.state.timerInterval);
        this.state.timerRunning = false;
        playBtn.innerHTML = '<span class="material-symbols-outlined">play_arrow</span>';
      } else {
        this.state.timerRunning = true;
        playBtn.innerHTML = '<span class="material-symbols-outlined">pause</span>';
        
        this.state.timerInterval = setInterval(() => {
          if (this.state.timerSeconds > 0) {
            this.state.timerSeconds--;
            this.updateTimerDisplay(timeDisplay);
            this.updateTimerRing();
          } else {
            clearInterval(this.state.timerInterval);
            this.state.timerRunning = false;
            playBtn.innerHTML = '<span class="material-symbols-outlined">play_arrow</span>';
            alert('Pomo session completed!');
          }
        }, 1000);
      }
    });

    const resetBtn = document.querySelector('.ctrl-btn.reset');
    if(resetBtn) {
      resetBtn.addEventListener('click', () => {
        clearInterval(this.state.timerInterval);
        this.state.timerRunning = false;
        this.state.timerSeconds = 25 * 60;
        this.updateTimerDisplay(timeDisplay);
        this.updateTimerRing();
        playBtn.innerHTML = '<span class="material-symbols-outlined">play_arrow</span>';
      });
    }
  },

  updateTimerDisplay(display) {
    const m = Math.floor(this.state.timerSeconds / 60).toString().padStart(2, '0');
    const s = (this.state.timerSeconds % 60).toString().padStart(2, '0');
    display.textContent = `${m}:${s}`;
  },

  updateTimerRing() {
    const circle = document.querySelector('.progress-ring__circle');
    if (!circle) return;
    const radius = circle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;
    const totalSeconds = 25 * 60;
    const percent = this.state.timerSeconds / totalSeconds;
    const offset = circumference - percent * circumference;
    circle.style.strokeDashoffset = offset;
  },

  setupCheckboxes() {
    const checkboxes = document.querySelectorAll('.planner-list input[type="checkbox"]');
    checkboxes.forEach(cb => {
      cb.addEventListener('change', (e) => {
        const li = e.target.closest('li');
        if (e.target.checked) {
          li.classList.add('completed');
        } else {
          li.classList.remove('completed');
        }
      });
    });

    const timerPlannerCbs = document.querySelectorAll('.daily-planner-list input[type="checkbox"]');
    timerPlannerCbs.forEach(cb => {
      cb.addEventListener('change', (e) => {
        const li = e.target.closest('li');
        if (e.target.checked) {
          li.classList.add('checked');
        } else {
          li.classList.remove('checked');
        }
      });
    });
  },

  setupSubjectTabs() {
    const tabs = document.querySelectorAll('.subj-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
      });
    });
  },

  updateClock() {
    // Just a placeholder if we need real time later
  }
};

document.addEventListener('DOMContentLoaded', () => {
  app.init();
});
