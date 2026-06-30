document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // 1. Mobile Navigation Menu Toggle
  // ==========================================
  const menuToggleBtn = document.getElementById('menu-toggle-btn');
  const menuCloseBtn = document.getElementById('menu-close-btn');
  const mobileOverlayMenu = document.getElementById('mobile-overlay-menu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const openMobileMenu = () => {
    mobileOverlayMenu.classList.add('active');
    document.body.style.overflow = 'hidden'; // Disable scroll when menu is open
  };

  const closeMobileMenu = () => {
    mobileOverlayMenu.classList.remove('active');
    document.body.style.overflow = ''; // Re-enable scroll
  };

  if (menuToggleBtn && mobileOverlayMenu) {
    menuToggleBtn.addEventListener('click', openMobileMenu);
  }

  if (menuCloseBtn) {
    menuCloseBtn.addEventListener('click', closeMobileMenu);
  }

  // Close mobile nav when clicking any link
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });


  // ==========================================
  // 2. Active Navigation Link Highlighting on Scroll
  // ==========================================
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('header, section');

  const highlightNav = () => {
    let scrollPos = window.scrollY + 100; // offset for fixed nav height

    sections.forEach(section => {
      if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
        const currentId = section.getAttribute('id');
        
        // Highlight Desktop Link
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${currentId}`) {
            link.classList.add('active');
          }
        });

        // Highlight Mobile Link
        mobileNavLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${currentId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNav);


  // ==========================================
  // 3. Scroll Reveal Animations (Intersection Observer)
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Animates only once
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });


  // ==========================================
  // 4. Date Input Constraints (Disable past dates)
  // ==========================================
  const dateInput = document.getElementById('date-input');
  if (dateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0
    let dd = today.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    const minDateString = `${yyyy}-${mm}-${dd}`;
    dateInput.setAttribute('min', minDateString);
  }


  // ==========================================
  // 5. Inquiry Form Submission & Validation
  // ==========================================
  const inquiryForm = document.getElementById('inquiry-form');
  const submitBtn = document.getElementById('submit-btn');
  const successBanner = document.getElementById('form-success-banner');

  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (event) => {
      event.preventDefault();

      // Reset styles and error messages
      let isValid = true;
      const inputs = inquiryForm.querySelectorAll('input[required]');

      inputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.style.borderColor = 'var(--error)';
          // Add wiggle/shake class
          input.classList.add('shake-error');
          setTimeout(() => input.classList.remove('shake-error'), 500);
        } else {
          input.style.borderColor = 'var(--outline-variant)';
        }
      });

      if (!isValid) return;

      // Extract form details
      const formData = {
        name: document.getElementById('name-input').value.trim(),
        phone: document.getElementById('phone-input').value.trim(),
        email: document.getElementById('email-input').value.trim() || 'Not Provided',
        pickup: document.getElementById('pickup-input').value.trim(),
        destination: document.getElementById('dest-input').value.trim(),
        travel_date: document.getElementById('date-input').value,
        passengers: document.getElementById('passengers-select').value,
        message: document.getElementById('message-input').value.trim(),
        timestamp: new Date().toLocaleString()
      };

      // Disable inputs during submission simulation
      const allFormElements = inquiryForm.querySelectorAll('input, select, textarea, button');
      allFormElements.forEach(element => {
        element.disabled = true;
      });

      // Change button state to sending
      submitBtn.textContent = 'Saving Inquiry & Opening WhatsApp...';
      submitBtn.style.opacity = '0.85';

      // 1. Save data to the "Database" (localStorage)
      saveToDatabase(formData);

      // 2. Open WhatsApp link to notify the owner
      setTimeout(() => {
        sendWhatsAppNotification(formData);

        // Show Success Banner
        successBanner.classList.add('active');
        
        // Update Submit button
        submitBtn.textContent = 'Inquiry Sent! Redirected to WhatsApp';
        submitBtn.classList.add('success');
        submitBtn.style.opacity = '1';

        // Scroll to success banner smoothly
        successBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 1200);
    });
  }

  // Database Storage Helper (localStorage persistence)
  function saveToDatabase(data) {
    try {
      const inquiries = JSON.parse(localStorage.getItem('divakar_inquiries') || '[]');
      inquiries.push(data);
      localStorage.setItem('divakar_inquiries', JSON.stringify(inquiries));
      console.log('Inquiry successfully saved to local database:', data);
    } catch (e) {
      console.error('Failed to write to database:', e);
    }
  }

  // Redirect to WhatsApp with formatted deal details
  function sendWhatsAppNotification(data) {
    const ownerNumber = '917702325873'; // Owner number: +91 77023 25873
    
    // Construct premium formatted message
    const messageText = 
`*NEW INQUIRY - DIVAKAR TRAVELS* 🚗✨
--------------------------------------
👤 *Customer:* ${data.name}
📞 *Phone:* ${data.phone}
📧 *Email:* ${data.email}
📍 *Pickup:* ${data.pickup}
🏁 *Destination:* ${data.destination}
📅 *Travel Date:* ${data.travel_date}
👥 *Passengers:* ${data.passengers}
📝 *Notes:* ${data.message || 'None'}
--------------------------------------
Saved in database: ✅`;

    const encodedText = encodeURIComponent(messageText);
    const whatsappUrl = `https://wa.me/${ownerNumber}?text=${encodedText}`;
    
    // Redirect or open in a new tab
    window.open(whatsappUrl, '_blank');
  }

  // ==========================================
  // 6. Hidden Admin Dashboard (?admin=true)
  // ==========================================
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('admin') === 'true') {
    createAdminDashboard();
  }

  function createAdminDashboard() {
    const dashboardHtml = `
      <div id="admin-dashboard-panel" class="admin-panel">
        <div class="admin-panel-header">
          <h3>🔐 Divakar Travels - Admin Database View</h3>
          <button id="admin-close-btn" class="admin-close">&times;</button>
        </div>
        <div class="admin-panel-body">
          <p>This view displays all customer inquiries currently stored in the database.</p>
          <div class="admin-table-container">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Customer Info</th>
                  <th>Pickup & Dest</th>
                  <th>Date & Pax</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody id="admin-table-body">
                <!-- Rows filled dynamically -->
              </tbody>
            </table>
            <div id="admin-empty-msg" class="admin-empty-message">No inquiries found in database.</div>
          </div>
          <div class="admin-actions">
            <button id="admin-clear-db" class="admin-btn-clear">Clear Database</button>
            <button id="admin-refresh" class="admin-btn-refresh">Refresh List</button>
          </div>
        </div>
      </div>
    `;

    // Append to body
    const div = document.createElement('div');
    div.innerHTML = dashboardHtml;
    document.body.appendChild(div.firstElementChild);

    // Add styles dynamically
    const adminStyles = document.createElement('style');
    adminStyles.textContent = `
      .admin-panel {
        position: fixed;
        bottom: 24px;
        right: 24px;
        width: 90%;
        max-width: 650px;
        max-height: 480px;
        background-color: #0b152d;
        color: white;
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: var(--radius-lg);
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        z-index: 10000;
        display: flex;
        flex-direction: column;
        font-family: var(--font-body);
        animation: slideInDown 0.3s ease;
      }
      .admin-panel-header {
        background-color: var(--primary-container);
        padding: 16px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid rgba(255,255,255,0.05);
      }
      .admin-panel-header h3 {
        color: white;
        font-size: 1.1rem;
        margin: 0;
      }
      .admin-close {
        background: none;
        border: none;
        color: #ff9e9e;
        font-size: 1.6rem;
        cursor: pointer;
        line-height: 1;
      }
      .admin-panel-body {
        padding: 20px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .admin-panel-body p {
        font-size: 0.85rem;
        color: rgba(255,255,255,0.7);
        margin: 0;
      }
      .admin-table-container {
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: var(--radius-md);
        background-color: rgba(0,0,0,0.2);
        max-height: 250px;
        overflow-y: auto;
      }
      .admin-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.8rem;
        text-align: left;
      }
      .admin-table th, .admin-table td {
        padding: 10px 12px;
        border-bottom: 1px solid rgba(255,255,255,0.05);
      }
      .admin-table th {
        background-color: rgba(255,255,255,0.05);
        font-weight: 600;
        color: var(--secondary-container);
      }
      .admin-table tr:hover {
        background-color: rgba(255,255,255,0.02);
      }
      .admin-empty-message {
        padding: 20px;
        text-align: center;
        font-size: 0.85rem;
        color: rgba(255,255,255,0.4);
      }
      .admin-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 8px;
      }
      .admin-btn-clear, .admin-btn-refresh {
        padding: 8px 16px;
        font-size: 0.8rem;
        border-radius: var(--radius-sm);
        border: none;
        cursor: pointer;
        font-weight: 600;
      }
      .admin-btn-clear {
        background-color: var(--error);
        color: white;
      }
      .admin-btn-clear:hover {
        background-color: #d32f2f;
      }
      .admin-btn-refresh {
        background-color: var(--secondary-container);
        color: var(--on-secondary-container);
      }
      .admin-btn-refresh:hover {
        background-color: #f7ca74;
      }
    `;
    document.head.appendChild(adminStyles);

    // Event listeners
    const closeBtn = document.getElementById('admin-close-btn');
    const clearBtn = document.getElementById('admin-clear-db');
    const refreshBtn = document.getElementById('admin-refresh');
    const tableBody = document.getElementById('admin-table-body');
    const emptyMsg = document.getElementById('admin-empty-msg');
    const panel = document.getElementById('admin-dashboard-panel');

    const loadTableData = () => {
      tableBody.innerHTML = '';
      const inquiries = JSON.parse(localStorage.getItem('divakar_inquiries') || '[]');
      
      if (inquiries.length === 0) {
        emptyMsg.style.display = 'block';
      } else {
        emptyMsg.style.display = 'none';
        inquiries.forEach(item => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${item.timestamp}</td>
            <td>
              <strong>${item.name}</strong><br>
              <span style="color:var(--secondary-container); font-size:0.75rem;">📞 ${item.phone}</span><br>
              <span style="opacity:0.7; font-size:0.75rem;">📧 ${item.email}</span>
            </td>
            <td>
              📍 ${item.pickup}<br>
              🏁 ${item.destination}
            </td>
            <td>
              📅 ${item.travel_date}<br>
              👥 ${item.passengers} Passengers
            </td>
            <td>${item.message || '-'}</td>
          `;
          tableBody.appendChild(tr);
        });
      }
    };

    closeBtn.addEventListener('click', () => {
      panel.remove();
    });

    clearBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear the inquiry database?')) {
        localStorage.removeItem('divakar_inquiries');
        loadTableData();
      }
    });

    refreshBtn.addEventListener('click', loadTableData);

    // Initial load
    loadTableData();
  }

});

// Inject shake animation for form validation errors
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-4px); }
    75% { transform: translateX(4px); }
  }
  .shake-error {
    animation: shake 0.2s ease-in-out 0s 2;
  }
`;
document.head.appendChild(styleSheet);
