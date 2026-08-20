/**
 * STACKLY - Global Interactivity & Animation Handler
 * Handles Section Scroll Reveal, Role Based Login/Signup, Form Validation, FAQ Accordions & Toast Alerts.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     0. SCROLL PROGRESS BAR INDICATOR
     ========================================================================== */
  let progressBar = document.querySelector('.scroll-progress-bar');
  if (!progressBar) {
    progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress-bar';
    document.body.appendChild(progressBar);
  }

  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    if (progressBar) {
      progressBar.style.width = scrolled + '%';
    }
  });

  /* ==========================================================================
     MOBILE HAMBURGER MENU TOGGLE (FULL-COVER OVERLAY & SCROLL FREEZE)
     ========================================================================== */
  const siteHeader = document.querySelector('.site-header');
  if (siteHeader) {
    const headerContainer = siteHeader.querySelector('.header-container, .container');

    if (headerContainer && !siteHeader.querySelector('.mobile-menu-toggle')) {
      const mobileToggleBtn = document.createElement('button');
      mobileToggleBtn.type = 'button';
      mobileToggleBtn.className = 'mobile-menu-toggle';
      mobileToggleBtn.setAttribute('aria-label', 'Toggle Mobile Navigation Menu');
      mobileToggleBtn.innerHTML = `
        <span class="hamburger-bar"></span>
        <span class="hamburger-bar"></span>
        <span class="hamburger-bar"></span>
      `;
      headerContainer.appendChild(mobileToggleBtn);

      mobileToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = siteHeader.classList.toggle('mobile-menu-open');
        if (isOpen) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = '';
        }
      });

      document.addEventListener('click', (e) => {
        if (!siteHeader.contains(e.target)) {
          if (siteHeader.classList.contains('mobile-menu-open')) {
            siteHeader.classList.remove('mobile-menu-open');
            document.body.style.overflow = '';
          }
        }
      });
    }
  }

  /* ==========================================================================
     DASHBOARD MOBILE HAMBURGER MENU DRAWER (CLIENT & ADMIN)
     ========================================================================== */
  const dashWrapper = document.querySelector('.dashboard-wrapper');
  const dashSidebar = document.querySelector('.dashboard-sidebar');

  if (dashWrapper && dashSidebar) {
    // Inject mobile top header bar for dashboard on small screens
    let dashMobileHeader = document.querySelector('.dash-mobile-header');
    if (!dashMobileHeader) {
      dashMobileHeader = document.createElement('div');
      dashMobileHeader.className = 'dash-mobile-header';
      dashMobileHeader.innerHTML = `
        <div class="dash-mobile-brand">
          <img src="Home.img/logo_stackly_dark.webp" alt="STACKLY" class="dash-mobile-logo">
          <span class="dash-mobile-badge">PORTAL</span>
        </div>
        <button type="button" class="dash-mobile-toggle" aria-label="Toggle Dashboard Sidebar Menu">
          <span class="hamburger-bar"></span>
          <span class="hamburger-bar"></span>
          <span class="hamburger-bar"></span>
        </button>
      `;
      dashWrapper.insertBefore(dashMobileHeader, dashWrapper.firstChild);
    }

    // Create dark backdrop overlay
    let dashOverlay = document.querySelector('.dash-sidebar-overlay');
    if (!dashOverlay) {
      dashOverlay = document.createElement('div');
      dashOverlay.className = 'dash-sidebar-overlay';
      document.body.appendChild(dashOverlay);
    }

    const toggleBtn = dashMobileHeader.querySelector('.dash-mobile-toggle');

    const closeDashSidebar = () => {
      dashSidebar.classList.remove('active');
      dashOverlay.classList.remove('active');
      dashMobileHeader.classList.remove('active');
      document.body.style.overflow = '';
    };

    const openDashSidebar = () => {
      dashSidebar.classList.add('active');
      dashOverlay.classList.add('active');
      dashMobileHeader.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (dashSidebar.classList.contains('active')) {
        closeDashSidebar();
      } else {
        openDashSidebar();
      }
    });

    dashOverlay.addEventListener('click', closeDashSidebar);

    // Auto close sidebar when clicking any menu item inside sidebar on mobile
    dashSidebar.querySelectorAll('.sidebar-nav-item, .client-tab-link, .admin-tab-link, a, button').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 992) {
          closeDashSidebar();
        }
      });
    });
  }

  /* ==========================================================================
     1. SCROLL REVEAL ANIMATION (INTERSECTION OBSERVER)
     ========================================================================== */
  const revealElements = document.querySelectorAll('section, .reveal-on-scroll');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => {
      revealObserver.observe(el);
    });
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('reveal-active'));
  }

  /* ==========================================================================
     2. ROLE BASED LOGIN & SIGNUP TAB SELECTOR (CLIENT / ADMIN)
     ========================================================================== */
  const roleButtons = document.querySelectorAll('.role-tab-btn');

  roleButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const parentContainer = btn.closest('.role-tabs-container');
      if (!parentContainer) return;

      // Remove active class from sibling buttons
      parentContainer.querySelectorAll('.role-tab-btn').forEach(b => b.classList.remove('active'));

      // Add active class to clicked button
      btn.classList.add('active');

      // Update hidden input value
      const selectedRole = btn.getAttribute('data-role');
      const hiddenInput = parentContainer.querySelector('input[type="hidden"]');
      if (hiddenInput) {
        hiddenInput.value = selectedRole;
      }

      showToast(`Selected Account Type: ${selectedRole.toUpperCase()}`);
    });
  });

  /* ==========================================================================
     3. PASSWORD EYE TOGGLE BUTTON
     ========================================================================== */
  const eyeButtons = document.querySelectorAll('.eye-toggle-btn');

  eyeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const wrapper = btn.closest('.password-input-wrapper');
      if (!wrapper) return;
      const input = wrapper.querySelector('input');
      if (!input) return;

      if (input.type === 'password') {
        input.type = 'text';
        btn.setAttribute('aria-label', 'Hide password');
        btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#067A52" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;
      } else {
        input.type = 'password';
        btn.setAttribute('aria-label', 'Show password');
        btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#667085" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
      }
    });
  });

  /* ==========================================================================
     GLOBAL 2-SECOND LOADING SCREEN OVERLAY FUNCTION (BULLETPROOF)
     ========================================================================== */
  window.triggerGlobalLoading = function(message, targetUrl, durationMs = 2000) {
    let loader = document.querySelector('.global-loader-overlay');
    if (!loader) {
      loader = document.createElement('div');
      loader.className = 'global-loader-overlay';
      loader.innerHTML = `
        <div class="loader-spinner-ring"></div>
        <img src="Home.img/logo_stackly_dark.webp" alt="STACKLY Logo" class="loader-brand-logo">
        <p class="loader-text"></p>
      `;
      document.body.appendChild(loader);
    }

    const loaderText = loader.querySelector('.loader-text');
    if (loaderText) loaderText.textContent = message || 'Loading STACKLY Experience...';

    loader.classList.add('active');

    setTimeout(() => {
      window.location.assign(targetUrl);
    }, durationMs);
  };

  /* ==========================================================================
     GLOBAL PAGE LINK NAVIGATION INTERCEPTOR
     ========================================================================== */
  const internalLinks = document.querySelectorAll('a[href]');

  internalLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      // Skip anchor links, empty links, javascript calls, or target _blank
      if (!href || href === '#' || href.startsWith('#') || href.startsWith('javascript') || link.getAttribute('target') === '_blank') {
        return;
      }

      // Intercept HTML pages for 2-second loading transition
      if (href.endsWith('.html') || href.includes('.html#')) {
        e.preventDefault();
        const pageName = link.textContent.trim().replace(/[\r\n]+/g, ' ') || 'STACKLY Page';
        window.triggerGlobalLoading(`Opening ${pageName}...`, href, 2000);
      }
    });
  });

  /* ==========================================================================
     GLOBAL CAPTURE-PHASE LOGOUT EVENT LISTENER (BULLETPROOF)
     ========================================================================== */
  document.addEventListener('click', (e) => {
    const target = e.target.closest('.btn-nav-logout, .btn-logout-dash, .btn-logout-action, button, a');
    if (target && target.textContent.toLowerCase().trim() === 'logout') {
      e.preventDefault();
      e.stopPropagation();
      localStorage.clear();
      localStorage.removeItem('loggedInUser');
      document.body.classList.remove('user-logged-in');
      showToast('Session terminated. Logging out...', 'info');
      window.triggerGlobalLoading('Logging out user session...', 'index.html', 1500);
    }
  }, true);

  /* ==========================================================================
     PERSISTENT LOGGED-IN USER SESSION IN TOP NAVBAR
     ========================================================================== */
  function renderHeaderUserSession() {
    const sessionData = localStorage.getItem('loggedInUser');
    const headerActions = document.querySelector('.header-actions, .nav-auth-buttons');
    const currentPath = window.location.pathname.toLowerCase();
    const isDashboardPage = currentPath.includes('dashboard');

    if (sessionData) {
      if (isDashboardPage) {
        document.body.classList.add('user-logged-in');
      }

      if (headerActions && isDashboardPage) {
        const user = JSON.parse(sessionData);
        const isAdmin = (user.role || 'client').toLowerCase() === 'admin';
        const dashboardLink = isAdmin ? 'admin-dashboard.html' : 'client-dashboard.html';
        const buttonText = isAdmin ? 'Admin Dashboard' : 'Client Dashboard';

        // On dashboard pages, show Dashboard button
        let dashBtn = headerActions.querySelector('.nav-dash-link');
        if (!dashBtn) {
          headerActions.innerHTML = `<a href="${dashboardLink}" class="btn btn-solid nav-dash-link">${buttonText}</a>`;
        }
      }
    } else {
      document.body.classList.remove('user-logged-in');
    }

    // Populate Standalone Dashboard Header Info, Sidebar, Avatar & Banners
    const dashHeaderEmail = document.getElementById('dashHeaderEmail');
    const dashHeaderName = document.getElementById('dashHeaderName');
    const sidebarUserName = document.getElementById('sidebarUserName');
    const sidebarUserEmail = document.getElementById('sidebarUserEmail');
    const clientBannerName = document.getElementById('clientBannerName');
    const clientBannerEmail = document.getElementById('clientBannerEmail');
    const adminBannerName = document.getElementById('adminBannerName');
    const adminBannerEmail = document.getElementById('adminBannerEmail');
    const avatarCircle = document.querySelector('.user-avatar-circle');

    if (sessionData) {
      const user = JSON.parse(sessionData);
      const displayEmail = user.email || 'dhau@gmail.com';
      const displayName = user.name || 'Dhamu';

      if (dashHeaderEmail) dashHeaderEmail.textContent = displayEmail;
      if (dashHeaderName) dashHeaderName.textContent = `${displayName} (${(user.role || 'client').toUpperCase()})`;

      if (sidebarUserName) sidebarUserName.textContent = displayName;
      if (sidebarUserEmail) sidebarUserEmail.textContent = displayEmail;

      if (clientBannerName) clientBannerName.textContent = displayName;
      if (clientBannerEmail) clientBannerEmail.textContent = displayEmail;

      if (adminBannerName) adminBannerName.textContent = `${displayName} (Administrator)`;
      if (adminBannerEmail) adminBannerEmail.textContent = displayEmail;

      if (avatarCircle) avatarCircle.textContent = displayName.charAt(0).toUpperCase();

      // Populate profile form inputs if present
      const profileForm = document.getElementById('clientProfileForm');
      if (profileForm) {
        const nameInput = profileForm.querySelector('input[type="text"]');
        const emailInput = profileForm.querySelector('input[type="email"]');
        if (nameInput) nameInput.value = displayName;
        if (emailInput) emailInput.value = displayEmail;
      }
    }
  }

  renderHeaderUserSession();

  /* ==========================================================================
     INDIVIDUAL FIELD RED ERROR VALIDATION (ALL FIELDS MANDATORY)
     ========================================================================== */
  const allForms = document.querySelectorAll('form');

  allForms.forEach(form => {
    // Disable default browser tooltips so custom red error styling displays cleanly
    form.setAttribute('novalidate', 'novalidate');

    // Automatically enforce 'required' attribute on EVERY form field
    const allFormFields = form.querySelectorAll('input, select, textarea');
    allFormFields.forEach(field => {
      if (field.type !== 'hidden' && field.type !== 'submit' && field.type !== 'button') {
        field.setAttribute('required', 'required');
      }

      const clearError = () => {
        field.classList.remove('input-error');
        field.style.borderColor = '';
        field.style.backgroundColor = '';
        field.style.color = '';
        const parentGroup = field.closest('.form-group, .input-wrapper, .password-input-wrapper, div') || field.parentElement;
        if (parentGroup) {
          const errText = parentGroup.parentElement?.querySelector('.field-error-text') || parentGroup.querySelector('.field-error-text');
          if (errText) errText.remove();
        }
      };
      field.addEventListener('input', clearError);
      field.addEventListener('change', clearError);
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      const fieldsToValidate = form.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]), select, textarea');

      // Clear previous error messages
      form.querySelectorAll('.field-error-text').forEach(el => el.remove());

      fieldsToValidate.forEach(input => {
        const value = input.value ? input.value.trim() : '';
        const isCheckbox = input.type === 'checkbox';

        if (!value || (isCheckbox && !input.checked)) {
          isValid = false;
          input.classList.add('input-error');
          input.style.borderColor = '#EF4444';
          input.style.backgroundColor = '#FEF2F2';

          // Get field label text or placeholder or fallback
          const formGroup = input.closest('.form-group, .role-selector-group') || input.parentElement;
          let label = formGroup?.querySelector('label, .form-label-uppercase')?.textContent.replace('*', '').trim();
          if (!label) label = input.placeholder || 'This mandatory field';

          // Create individual red error message text
          const errSpan = document.createElement('span');
          errSpan.className = 'field-error-text';
          errSpan.style.cssText = 'color: #EF4444; font-size: 12px; font-weight: 600; margin-top: 5px; display: block; width: 100%; letter-spacing: 0.01em;';
          errSpan.innerHTML = `⚠️ ${label} is mandatory and cannot be left blank.`;

          if (formGroup) {
            formGroup.appendChild(errSpan);
          } else {
            input.insertAdjacentElement('afterend', errSpan);
          }
        } else {
          input.classList.remove('input-error');
          input.style.borderColor = '';
          input.style.backgroundColor = '';
        }
      });

      if (!isValid) {
        showToast('All fields are mandatory. Please complete all highlighted fields.', 'error');
        return;
      }

      const formId = form.id;
      const isContactPage = window.location.pathname.endsWith('contact.html') || formId === 'contactForm' || formId === 'enquiryForm';
      const isLoginForm = form.classList.contains('auth-form') || formId === 'loginForm' || window.location.pathname.endsWith('login.html');
      const isSignupForm = formId === 'signupForm' || window.location.pathname.endsWith('signup.html');

      // 1. Handle Login Form
      if (isLoginForm) {
        const role = (document.getElementById('login_user_role')?.value || 'client').toLowerCase();
        const emailInput = form.querySelector('input[type="email"]')?.value || 'dhau@gmail.com';
        let nameInput = form.querySelector('input[placeholder*="Full Name"]')?.value;

        if (!nameInput && emailInput) {
          const username = emailInput.split('@')[0];
          nameInput = username.toLowerCase().includes('dhau') || username.toLowerCase().includes('dhamu') ? 'Dhamu' : username.charAt(0).toUpperCase() + username.slice(1);
        }

        if (role === 'admin' && nameInput === 'Dhamu') nameInput = 'Dhamu (Administrator)';

        localStorage.setItem('loggedInUser', JSON.stringify({ name: nameInput, email: emailInput, role: role }));
        const targetDashboard = role === 'admin' ? 'admin-dashboard.html' : 'client-dashboard.html';

        showToast(`Login Successful! Welcome back, ${nameInput}.`, 'success');
        window.triggerGlobalLoading(`Authenticating ${role.toUpperCase()} Workspace...`, targetDashboard, 2000);
      } 
      // 2. Handle Signup Form
      else if (isSignupForm) {
        const role = (document.getElementById('signup_user_role')?.value || 'client').toLowerCase();
        const emailInput = form.querySelector('input[type="email"]')?.value || 'dhau@gmail.com';
        let nameInput = form.querySelector('input[placeholder*="Full Name"]')?.value || 'Dhamu';

        localStorage.setItem('loggedInUser', JSON.stringify({ name: nameInput, email: emailInput, role: role }));
        const targetDashboard = role === 'admin' ? 'admin-dashboard.html' : 'client-dashboard.html';

        showToast(`Account Registered! Provisioning ${role.toUpperCase()} portal...`, 'success');
        window.triggerGlobalLoading(`Setting up ${role.toUpperCase()} Workspace...`, targetDashboard, 2000);
      } 
      // 3. Handle Contact Page / Enquiry Form (Successful Message)
      else if (isContactPage) {
        showToast('Thank you! Your enquiry has been successfully submitted.', 'success');
        
        // Show inline success message card inside form if container available
        let successCard = form.querySelector('.form-success-card');
        if (!successCard) {
          successCard = document.createElement('div');
          successCard.className = 'form-success-card';
          successCard.style.cssText = 'background-color: #D1FAE5; border: 1px solid #059669; color: #065F46; padding: 14px 18px; border-radius: 8px; font-size: 14px; font-weight: 600; margin-bottom: 16px; display: flex; align-items: center; gap: 10px;';
          form.insertBefore(successCard, form.firstChild);
        }
        successCard.innerHTML = `✓ Thank you! Your enquiry has been successfully submitted. Our private client team will contact you within 24 hours.`;
        form.reset();
      } 
      // 4. All Other Forms -> Navigate to 404 Page
      else {
        showToast('Request Received! Redirecting to page...', 'info');
        window.triggerGlobalLoading('Processing request...', '404.html', 2000);
      }
    });
  });

  /* ==========================================================================
     UNIVERSAL DASHBOARD TAB SWITCHER (CLIENT & ADMIN SIDEBAR)
     ========================================================================== */
  const dashTabLinks = document.querySelectorAll('.client-tab-link, .admin-tab-link, .sidebar-nav-item');
  const dashTabPanels = document.querySelectorAll('.tab-content-panel');

  dashTabLinks.forEach(tabBtn => {
    tabBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = tabBtn.getAttribute('data-target');
      if (!targetId) return;

      // Remove active class from all sibling buttons
      dashTabLinks.forEach(b => b.classList.remove('active'));
      tabBtn.classList.add('active');

      // Toggle panel active state
      let foundPanel = false;
      dashTabPanels.forEach(panel => {
        if (panel.id === targetId) {
          panel.classList.add('active');
          foundPanel = true;
        } else {
          panel.classList.remove('active');
        }
      });

      // Smooth scroll viewport to top
      const viewport = document.querySelector('.dashboard-viewport');
      if (viewport) {
        viewport.scrollTop = 0;
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  /* ==========================================================================
     ADVISOR CHAT REPLY HANDLER WITH DYNAMIC USERNAME
     ========================================================================== */
  const btnSendAdvisorChat = document.getElementById('btnSendAdvisorChat');
  const advisorChatInput = document.getElementById('advisorChatInput');
  const chatMessagesBox = document.querySelector('.chat-messages-box');

  if (btnSendAdvisorChat && advisorChatInput && chatMessagesBox) {
    btnSendAdvisorChat.addEventListener('click', () => {
      const msgText = advisorChatInput.value.trim();
      if (!msgText) {
        showToast('Please enter a message before sending.', 'error');
        return;
      }

      const sessionData = localStorage.getItem('loggedInUser');
      let clientName = 'Dhamu';
      if (sessionData) {
        const u = JSON.parse(sessionData);
        clientName = u.name || 'Dhamu';
      }

      const msgBubble = document.createElement('div');
      msgBubble.className = 'msg-bubble client';
      msgBubble.innerHTML = `
        <span class="msg-sender">You (${clientName})</span>
        <p>${msgText}</p>
        <span class="msg-time">Just Now</span>
      `;

      chatMessagesBox.appendChild(msgBubble);
      chatMessagesBox.scrollTop = chatMessagesBox.scrollHeight;
      advisorChatInput.value = '';
      showToast('Message sent to Senior Advisor Eleanor Vance!', 'success');

      // Simulated Advisor Auto-Reply after 1.5 seconds
      setTimeout(() => {
        const replyBubble = document.createElement('div');
        replyBubble.className = 'msg-bubble agent';
        replyBubble.innerHTML = `
          <span class="msg-sender">Eleanor Vance</span>
          <p>Thank you for your message, ${clientName}! I am reviewing your request right now and will update your client file shortly.</p>
          <span class="msg-time">Just Now</span>
        `;
        chatMessagesBox.appendChild(replyBubble);
        chatMessagesBox.scrollTop = chatMessagesBox.scrollHeight;
      }, 1500);
    });
  }

  /* ==========================================================================
     GLOBAL 2-SECOND LOADING SCREEN OVERLAY FUNCTION
     ========================================================================== */
  function triggerGlobalLoading(message, targetUrl, durationMs = 2000) {
    let loader = document.querySelector('.global-loader-overlay');
    if (!loader) {
      loader = document.createElement('div');
      loader.className = 'global-loader-overlay';
      loader.innerHTML = `
        <div class="loader-spinner-ring"></div>
        <img src="Home.img/logo_stackly_dark.webp" alt="STACKLY Logo" class="loader-brand-logo">
        <p class="loader-text"></p>
      `;
      document.body.appendChild(loader);
    }

    const loaderText = loader.querySelector('.loader-text');
    if (loaderText) loaderText.textContent = message || 'Loading STACKLY Experience...';

    loader.classList.add('active');

    setTimeout(() => {
      window.location.href = targetUrl;
    }, durationMs);
  }

  /* Remove error highlighting on input */
  document.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('input', () => {
      field.style.borderColor = '';
    });
  });

  /* ==========================================================================
     5. FAQ ACCORDION TOGGLE
     ========================================================================== */
  const faqItems = document.querySelectorAll('.contact-faq-card, .faq-item');

  faqItems.forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('active');
    });
  });

  /* ==========================================================================
     6. TOAST NOTIFICATION SYSTEM
     ========================================================================== */
  function showToast(message, type = 'info') {
    let container = document.querySelector('.toast-notification-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-notification-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast-popup';

    const iconColor = type === 'error' ? '#EF4444' : '#34D399';
    const icon = type === 'error' ? '❌' : '✓';

    toast.innerHTML = `
      <span style="color: ${iconColor}; font-weight: bold; font-size: 16px;">${icon}</span>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    // Trigger slide in animation
    setTimeout(() => {
      toast.classList.add('toast-show');
    }, 10);

    // Auto remove after 3.5 seconds
    setTimeout(() => {
      toast.classList.remove('toast-show');
      setTimeout(() => {
        toast.remove();
      }, 400);
    }, 3500);
  }

});
