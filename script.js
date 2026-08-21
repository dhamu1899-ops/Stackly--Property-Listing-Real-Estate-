/**
 * STACKLY - Global Script
 * Clean, simple, reliable handlers for all pages.
 */

/* ============================================================
   GLOBAL: TOAST NOTIFICATION
   Must be global so onclick="showToast(...)" in HTML works
   ============================================================ */
function showToast(message, type) {
  type = type || 'info';
  var container = document.querySelector('.toast-notification-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-notification-container';
    document.body.appendChild(container);
  }
  var toast = document.createElement('div');
  toast.className = 'toast-popup';
  var color = type === 'error' ? '#EF4444' : '#34D399';
  var icon  = type === 'error' ? '✗' : '✓';
  toast.innerHTML = '<span style="color:' + color + ';font-weight:bold;font-size:16px;">' + icon + '</span> <span>' + message + '</span>';
  container.appendChild(toast);
  setTimeout(function(){ toast.classList.add('toast-show'); }, 10);
  setTimeout(function(){
    toast.classList.remove('toast-show');
    setTimeout(function(){ toast.remove(); }, 400);
  }, 3500);
}

/* ============================================================
   GLOBAL: LOADING OVERLAY + NAVIGATION
   ============================================================ */
function triggerLoading(message, url, delay) {
  delay = delay || 500;

  // Show loading overlay
  var loader = document.querySelector('.global-loader-overlay');
  if (!loader) {
    loader = document.createElement('div');
    loader.className = 'global-loader-overlay';
    loader.innerHTML =
      '<div class="loader-spinner-ring"></div>' +
      '<img src="Home.img/logo_stackly_teal.webp" alt="STACKLY" class="loader-brand-logo">' +
      '<p class="loader-text"></p>';
    document.body.appendChild(loader);
  }
  var txt = loader.querySelector('.loader-text');
  if (txt) txt.textContent = message || 'Loading...';
  loader.classList.add('active');

  // Navigate after delay
  setTimeout(function(){
    window.location.href = url;
  }, delay);
}

/* ============================================================
   DOM READY
   ============================================================ */
document.addEventListener('DOMContentLoaded', function() {

  /* ----------------------------------------------------------
     SCROLL PROGRESS BAR
     ---------------------------------------------------------- */
  var progressBar = document.querySelector('.scroll-progress-bar');
  if (!progressBar) {
    progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress-bar';
    document.body.appendChild(progressBar);
  }
  window.addEventListener('scroll', function() {
    var winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    var height    = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (progressBar && height > 0) {
      progressBar.style.width = ((winScroll / height) * 100) + '%';
    }
  });

  /* ----------------------------------------------------------
     MOBILE HAMBURGER MENU
     ---------------------------------------------------------- */
  var siteHeader = document.querySelector('.site-header');
  if (siteHeader) {
    var headerContainer = siteHeader.querySelector('.header-container, .container');
    if (headerContainer && !siteHeader.querySelector('.mobile-menu-toggle')) {
      var toggleBtn = document.createElement('button');
      toggleBtn.type = 'button';
      toggleBtn.className = 'mobile-menu-toggle';
      toggleBtn.setAttribute('aria-label', 'Toggle Navigation');
      toggleBtn.innerHTML = '<span class="hamburger-bar"></span><span class="hamburger-bar"></span><span class="hamburger-bar"></span>';
      headerContainer.appendChild(toggleBtn);

      toggleBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        var isOpen = siteHeader.classList.toggle('mobile-menu-open');
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });
      document.addEventListener('click', function(e) {
        if (!siteHeader.contains(e.target) && siteHeader.classList.contains('mobile-menu-open')) {
          siteHeader.classList.remove('mobile-menu-open');
          document.body.style.overflow = '';
        }
      });
    }
  }

  /* ----------------------------------------------------------
     DASHBOARD MOBILE SIDEBAR
     ---------------------------------------------------------- */
  var dashWrapper = document.querySelector('.dashboard-wrapper');
  var dashSidebar = document.querySelector('.dashboard-sidebar');
  if (dashWrapper && dashSidebar) {
    var dashMobileHeader = document.querySelector('.dash-mobile-header');
    if (!dashMobileHeader) {
      dashMobileHeader = document.createElement('div');
      dashMobileHeader.className = 'dash-mobile-header';
      dashMobileHeader.innerHTML =
        '<div class="dash-mobile-brand">' +
          '<img src="Home.img/logo_stackly_dark.webp" alt="STACKLY" class="dash-mobile-logo">' +
          '<span class="dash-mobile-badge">PORTAL</span>' +
        '</div>' +
        '<button type="button" class="dash-mobile-toggle" aria-label="Toggle Sidebar">' +
          '<span class="hamburger-bar"></span>' +
          '<span class="hamburger-bar"></span>' +
          '<span class="hamburger-bar"></span>' +
        '</button>';
      dashWrapper.insertBefore(dashMobileHeader, dashWrapper.firstChild);
    }

    var dashOverlay = document.querySelector('.dash-sidebar-overlay');
    if (!dashOverlay) {
      dashOverlay = document.createElement('div');
      dashOverlay.className = 'dash-sidebar-overlay';
      document.body.appendChild(dashOverlay);
    }

    function closeSidebar() {
      dashSidebar.classList.remove('active');
      dashOverlay.classList.remove('active');
      dashMobileHeader.classList.remove('active');
      document.body.style.overflow = '';
    }
    function openSidebar() {
      dashSidebar.classList.add('active');
      dashOverlay.classList.add('active');
      dashMobileHeader.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    var mobileToggle = dashMobileHeader.querySelector('.dash-mobile-toggle');
    if (mobileToggle) {
      mobileToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        dashSidebar.classList.contains('active') ? closeSidebar() : openSidebar();
      });
    }
    dashOverlay.addEventListener('click', closeSidebar);
    dashSidebar.querySelectorAll('a, button').forEach(function(link) {
      link.addEventListener('click', function() {
        if (window.innerWidth <= 992) closeSidebar();
      });
    });
  }

  /* ----------------------------------------------------------
     SCROLL REVEAL
     ---------------------------------------------------------- */
  var revealEls = document.querySelectorAll('section, .reveal-on-scroll');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function(entries, obs) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function(el) { observer.observe(el); });
  } else {
    revealEls.forEach(function(el) { el.classList.add('reveal-active'); });
  }

  /* ----------------------------------------------------------
     ROLE TAB BUTTONS (login / signup account type selector)
     ---------------------------------------------------------- */
  document.querySelectorAll('.role-tab-btn').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      var container = btn.closest('.role-tabs-container');
      if (!container) return;
      container.querySelectorAll('.role-tab-btn').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var role = btn.getAttribute('data-role');
      var hidden = container.querySelector('input[type="hidden"]');
      if (hidden) hidden.value = role;
      // No toast here — inline handlers on login/signup manage this
    });
  });

  /* ----------------------------------------------------------
     PASSWORD EYE TOGGLE
     ---------------------------------------------------------- */
  document.querySelectorAll('.eye-toggle-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var wrapper = btn.closest('.password-input-wrapper');
      if (!wrapper) return;
      var inp = wrapper.querySelector('input');
      if (!inp) return;
      if (inp.type === 'password') {
        inp.type = 'text';
        btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#067A52" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>';
      } else {
        inp.type = 'password';
        btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#667085" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
      }
    });
  });

  /* ----------------------------------------------------------
     LINK INTERCEPTOR (smooth loading transition between pages)
     ---------------------------------------------------------- */
  document.querySelectorAll('a[href]').forEach(function(link) {
    link.addEventListener('click', function(e) {
      var href = link.getAttribute('href');

      // Skip: empty, anchor-only, javascript:, external (_blank), tel:, mailto:
      if (!href) return;
      if (href === '#' || href.startsWith('#')) return;
      if (href.startsWith('javascript')) return;
      if (href.startsWith('tel:') || href.startsWith('mailto:')) return;
      if (link.target === '_blank') return;

      // Skip same-page links (active nav items pointing to current page)
      var currentPage = window.location.pathname.split('/').pop() || 'index.html';
      if (href === currentPage) return;

      // Intercept internal HTML page navigation with loading overlay
      if (href.endsWith('.html') || href.includes('.html#')) {
        e.preventDefault();
        triggerLoading('Loading...', href, 500);
      }
    });
  });

  /* ----------------------------------------------------------
     LOGOUT HANDLER
     ---------------------------------------------------------- */
  document.addEventListener('click', function(e) {
    var el = e.target.closest('button, a');
    if (el && el.textContent.trim().toLowerCase() === 'logout') {
      e.preventDefault();
      e.stopPropagation();
      localStorage.clear();
      showToast('Logging out...', 'info');
      triggerLoading('Logging out...', 'index.html', 800);
    }
  }, true);

  /* ----------------------------------------------------------
     SESSION: Update navbar + populate dashboard with saved user data
     ---------------------------------------------------------- */
  function loadUserSession() {
    var raw = localStorage.getItem('loggedInUser');

    /* ---- 1. MAIN SITE NAVBAR: swap Login/Signup for Dashboard button ---- */
    var headerActions = document.querySelector('.header-actions');
    var isDashboardPage = window.location.pathname.toLowerCase().includes('dashboard');

    if (headerActions && !isDashboardPage) {
      if (raw) {
        var sessionUser = JSON.parse(raw);
        var sessionRole = (sessionUser.role || 'client').toLowerCase();
        var sessionName = sessionUser.name || 'User';
        var dashUrl   = sessionRole === 'admin' ? 'admin-dashboard.html' : 'client-dashboard.html';
        var dashLabel = sessionRole === 'admin'
          ? '👑 ' + sessionName
          : '👤 ' + sessionName;

        // Replace Login + SignUp with user name button + logout
        headerActions.innerHTML =
          '<a href="' + dashUrl + '" class="btn btn-solid" style="gap:6px;">' + dashLabel + '</a>' +
          '<button type="button" class="btn btn-outline" id="navLogoutBtn">Logout</button>';
      } else {
        // Not logged in — show default Login / Sign Up
        headerActions.innerHTML =
          '<a href="login.html" class="btn btn-outline">Login</a>' +
          '<a href="signup.html" class="btn btn-solid">Sign Up</a>';
      }
    }

    /* ---- 2. DASHBOARD PAGES: populate sidebar / banner with saved name ---- */
    if (!raw) return;
    var user  = JSON.parse(raw);
    var name  = user.name  || 'User';
    var email = user.email || '';

    var el;
    if ((el = document.getElementById('sidebarUserName')))   el.textContent = name;
    if ((el = document.getElementById('sidebarUserEmail')))  el.textContent = email;
    if ((el = document.getElementById('clientBannerName')))  el.textContent = name;
    if ((el = document.getElementById('clientBannerEmail'))) el.textContent = email;
    if ((el = document.getElementById('adminBannerName')))   el.textContent = name;
    if ((el = document.getElementById('adminBannerEmail')))  el.textContent = email;
    var avatar = document.querySelector('.user-avatar-circle');
    if (avatar) avatar.textContent = name.charAt(0).toUpperCase();

    var profileForm = document.getElementById('clientProfileForm');
    if (profileForm) {
      var ni = profileForm.querySelector('input[type="text"]');
      var ei = profileForm.querySelector('input[type="email"]');
      if (ni) ni.value = name;
      if (ei) ei.value = email;
    }
  }
  loadUserSession();


  /* ----------------------------------------------------------
     ALL OTHER FORMS (contact, services, properties, dashboard, etc.)
     Login, Signup, ForgotPassword are handled inline in their own HTML pages.
     ---------------------------------------------------------- */
  document.querySelectorAll('form').forEach(function(form) {
    // Skip auth forms — they have self-contained inline handlers in their HTML
    if (form.id === 'loginForm' || form.id === 'signupForm' || form.id === 'forgotPasswordForm') return;

    form.setAttribute('novalidate', 'true');

    // Clear red error on input
    form.querySelectorAll('input, select, textarea').forEach(function(field) {
      field.addEventListener('input', function() {
        field.style.borderColor = '';
        field.style.backgroundColor = '';
      });
    });

    form.addEventListener('submit', function(e) {
      e.preventDefault();

      var path   = window.location.pathname.toLowerCase();
      var formId = form.id || '';

      // Dashboard profile save: persist to localStorage
      if (path.includes('dashboard') || formId.toLowerCase().includes('profile')) {
        var nameVal  = form.querySelector('input[type="text"]');
        var emailVal = form.querySelector('input[type="email"]');
        var raw = localStorage.getItem('loggedInUser');
        if (raw) {
          var u = JSON.parse(raw);
          if (nameVal  && nameVal.value.trim())  u.name  = nameVal.value.trim();
          if (emailVal && emailVal.value.trim()) u.email = emailVal.value.trim();
          localStorage.setItem('loggedInUser', JSON.stringify(u));
          loadUserSession();
        }
        showToast('Profile settings saved!', 'success');
        var b = document.createElement('div');
        b.style.cssText = 'background:#D1FAE5;border:1px solid #059669;color:#065F46;padding:14px 18px;border-radius:8px;font-size:14px;font-weight:600;margin-bottom:16px;';
        b.textContent = '✓ Profile settings saved successfully!';
        form.insertBefore(b, form.firstChild);
        return;
      }

      // All other forms: generic success
      showToast('Submitted successfully! Our team will be in touch.', 'success');
      var banner = document.createElement('div');
      banner.style.cssText = 'background:#D1FAE5;border:1px solid #059669;color:#065F46;padding:14px 18px;border-radius:8px;font-size:14px;font-weight:600;margin-bottom:16px;';
      banner.textContent = '✓ Thank you! Your submission has been received.';
      form.insertBefore(banner, form.firstChild);
      form.reset();
    });
  });

  /* ----------------------------------------------------------
     DASHBOARD TAB SWITCHER
     ---------------------------------------------------------- */
  var tabLinks  = document.querySelectorAll('.client-tab-link, .admin-tab-link, .sidebar-nav-item');
  var tabPanels = document.querySelectorAll('.tab-content-panel');

  tabLinks.forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      var targetId = btn.getAttribute('data-target');
      if (!targetId) return;
      tabLinks.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      tabPanels.forEach(function(panel) {
        panel.id === targetId ? panel.classList.add('active') : panel.classList.remove('active');
      });
      var vp = document.querySelector('.dashboard-viewport');
      if (vp) vp.scrollTop = 0;
    });
  });

  /* ----------------------------------------------------------
     ADVISOR CHAT
     ---------------------------------------------------------- */
  var sendBtn   = document.getElementById('btnSendAdvisorChat');
  var chatInput = document.getElementById('advisorChatInput');
  var chatBox   = document.querySelector('.chat-messages-box');

  if (sendBtn && chatInput && chatBox) {
    sendBtn.addEventListener('click', function() {
      var msg = chatInput.value.trim();
      if (!msg) { showToast('Please type a message first.', 'error'); return; }

      var raw = localStorage.getItem('loggedInUser');
      var clientName = raw ? (JSON.parse(raw).name || 'You') : 'You';

      var bubble = document.createElement('div');
      bubble.className = 'msg-bubble client';
      bubble.innerHTML = '<span class="msg-sender">You (' + clientName + ')</span><p>' + msg + '</p><span class="msg-time">Just Now</span>';
      chatBox.appendChild(bubble);
      chatBox.scrollTop = chatBox.scrollHeight;
      chatInput.value = '';
      showToast('Message sent to Eleanor Vance!', 'success');

      setTimeout(function() {
        var reply = document.createElement('div');
        reply.className = 'msg-bubble agent';
        reply.innerHTML = '<span class="msg-sender">Eleanor Vance</span><p>Thank you for your message, ' + clientName + '! I will review your request shortly.</p><span class="msg-time">Just Now</span>';
        chatBox.appendChild(reply);
        chatBox.scrollTop = chatBox.scrollHeight;
      }, 1500);
    });
  }

  /* ----------------------------------------------------------
     FAQ ACCORDION
     ---------------------------------------------------------- */
  document.querySelectorAll('.contact-faq-card, .faq-item').forEach(function(item) {
    item.addEventListener('click', function() {
      item.classList.toggle('active');
    });
  });

});
