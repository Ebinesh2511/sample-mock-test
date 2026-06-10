let data = null;
let activeCategory = 'All';
let activeStatus = 'All';

function showToast(msg) {
  const t = document.getElementById('editToast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

function breadcrumbHTML(d) {
  return d.map((item, i) => {
    if (item.active) return `<span>${item.label}</span>`;
    return `<a href="${item.link}">${item.label}</a>`;
  }).join('<span class="sep">›</span>');
}

function starIcon() {
  return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
}

function docIcon() {
  return '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>';
}

function statusIcon(status) {
  if (status === 'Completed') return '✓';
  if (status === 'In Progress') return '◷';
  return '○';
}

function matchesFilter(item) {
  const catMatch = activeCategory === 'All' || item.category === activeCategory.toUpperCase().replace('-', '-');
  const statusMatch = activeStatus === 'All' || item.completionStatus === activeStatus;
  return catMatch && statusMatch;
}

function render(data) {
  const app = document.getElementById('app');

  const filteredItems = data.mockTestSection.items.filter(matchesFilter);

  app.innerHTML = `
    <!-- Header -->
    <header class="header">
      <div class="header-left">
        <div class="header-logo">
          <img src="logo-desktop.webp" alt="Placement Preparation" class="logo-desktop">
          <img src="logo-mobile.webp" alt="Placement Preparation" class="logo-mobile">
        </div>
        <span class="header-tagline">${data.header.tagline}</span>
      </div>
      <div class="header-center">
        <nav class="header-nav">
          ${data.header.navLinks.map(l => `<a href="${l.url}">${l.label}</a>`).join('')}
        </nav>
      </div>
      <div class="header-right">
        <div class="header-search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </div>
        <div class="header-auth">
          <a href="#" class="header-login">${data.header.auth.login}</a>
          <a href="#" class="header-signup">${data.header.auth.signup}</a>
        </div>
        <button class="hamburger" id="hamburger" aria-label="Menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
    <div class="mobile-menu" id="mobileMenu">
      <nav class="mobile-nav">
        ${data.header.navLinks.map(l => `<a href="${l.url}">${l.label}</a>`).join('')}
      </nav>
      <div class="mobile-auth">
        <a href="#" class="header-login">${data.header.auth.login}</a>
        <a href="#" class="header-signup">${data.header.auth.signup}</a>
      </div>
    </div>

    <!-- Breadcrumb -->
    <nav class="breadcrumb">${breadcrumbHTML(data.breadcrumb)}</nav>

    <!-- Mock Test Section -->
    <section class="mocktest-section">
      <div class="container">
        <div class="section-heading">
          <h2>${data.mockTestSection.heading}</h2>
          <p>${data.mockTestSection.subheading}</p>
        </div>

        <div class="filters" id="filterBar">
          ${data.mockTestSection.filters.map(f =>
            `<button class="filter-btn${f.label === activeCategory ? ' active' : ''}" data-category="${f.label}">${f.label}</button>`
          ).join('')}
          <button class="filter-btn clear" data-category="clear">${data.mockTestSection.clearFilter}</button>
        </div>

        <div class="dropdown-row">
          <div class="dropdown" id="completionDropdown">
            <span class="dropdown-icon">☰</span>
            <span class="dropdown-label">${activeStatus === 'All' ? 'Completion Status' : activeStatus}</span>
            <div class="dropdown-menu" id="dropdownMenu">
              ${['All', 'Not Started', 'In Progress', 'Completed'].map(opt =>
                `<div class="dropdown-item${opt === activeStatus ? ' selected' : ''}" data-status="${opt}">${opt}</div>`
              ).join('')}
            </div>
          </div>
        </div>

        <div class="test-items" id="testItems">
          ${filteredItems.map(item => `
            <div class="test-item" data-item-id="${item.id}">
              <div class="test-item-left">
                <div class="test-icon" style="background:${item.iconBg}">
                  ${docIcon()}
                </div>
                <div class="test-info">
                  <h3>${item.title}</h3>
                  <div class="test-category">${item.category} • ${item.subcategory}</div>
                </div>
              </div>
              <div class="test-stats">
                <div class="stat">
                  <span class="stat-value">${item.stats.questions}</span>
                  <span class="stat-label">${item.stats.duration}</span>
                </div>
                <div class="stat">
                  <span class="stat-value">${item.stats.difficulty}</span>
                  <span class="stat-label">Difficulty</span>
                </div>
                <div class="stat">
                  <span class="stat-value">${item.stats.takes}</span>
                  <span class="stat-label">Takes</span>
                </div>
              </div>
              <div class="test-actions">
                <button class="action-btn${item.button.filled ? ' filled' : ''}">${item.button.label}</button>
              </div>
            </div>
          `).join('')}
          ${filteredItems.length === 0 ? '<div class="no-results">No tests match your filters.</div>' : ''}
        </div>

        <div class="browse-link">
          <a href="#">${data.mockTestSection.browseLink} <span class="arrow">→</span></a>
        </div>
      </div>
    </section>

    <!-- Problem of the Day -->
    <section class="potd-section container">
      <div class="potd-card">
        <div class="potd-left">
          <div class="potd-badge">${starIcon()} ${data.problemOfTheDay.badge}</div>
          <h3>${data.problemOfTheDay.title}</h3>
          <p>${data.problemOfTheDay.description}</p>
          <div>
            <div class="potd-timer-label">Ends in</div>
            <div class="potd-timer">${data.problemOfTheDay.endsIn}</div>
          </div>
        </div>
        <div class="potd-right">
          <div class="potd-glass-card">
            <h4>${data.problemOfTheDay.problemCard.title}</h4>
            <div class="potd-tags">
              ${data.problemOfTheDay.problemCard.tags.map(t =>
                `<span class="potd-tag ${t === 'EASY' ? 'green' : 'light'}">${t}</span>`
              ).join('')}
            </div>
            <div class="potd-attempts"><strong>${data.problemOfTheDay.problemCard.attempts}</strong> attempts</div>
            <button class="potd-solve-btn">${data.problemOfTheDay.problemCard.buttonText}</button>
          </div>
        </div>
        <div class="potd-decor"></div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="how-it-works">
    <div class="container">
        <div class="hiw-left">
          <h2>${data.howItWorksSection.heading}</h2>
          <div class="hiw-steps">
            ${data.howItWorksSection.steps.map(step => `
              <div class="hiw-step">
                <div class="step-circle ${step.circleFilled ? 'filled' : 'outline'}">${step.number}</div>
                <div class="step-content">
                  <h4>${step.title}</h4>
                  <p>${step.description}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="hiw-right">
          <h2>${data.howItWorksSection.personalizedSection.heading}</h2>
          <div class="hiw-cards">
            ${data.howItWorksSection.personalizedSection.cards.map((card, i) => {
              const pos = ['card-top-left','card-top-right','card-bottom-left','card-bottom-right'];
              return `
                <div class="hiw-card ${pos[i]}">
                  <div class="card-icon" style="background:${card.iconBg}">
                    ${docIcon()}
                  </div>
                  <h4>${card.title}</h4>
                  <p>${card.description}</p>
                </div>
              `;
            }).join('')}
          </div>
        </div>
        </div>
    </section>

    <!-- Ecosystem Table -->
    <section class="ecosystem-section">
      <div class="container">
        <h2>${data.ecosystemSection.heading}</h2>
        <div class="table-wrapper">
          <table class="ecosystem-table">
            <thead>
              <tr>${data.ecosystemSection.table.headers.map(h => `<th>${h}</th>`).join('')}</tr>
            </thead>
            <tbody>
              ${data.ecosystemSection.table.rows.map(row =>
                `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`
              ).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-top">
          <div class="footer-col footer-logo">
            <div class="logo-text">
              <img src="logo-desktop.webp" alt="Placement Preparation" class="logo-desktop">
              <img src="logo-mobile.webp" alt="Placement Preparation" class="logo-mobile">
            </div>
          </div>
          ${data.footer.columns.map(col => `
            <div class="footer-col">
              <h5>${col.title}</h5>
              <ul>${col.links.map(l => `<li><a href="#">${l}</a></li>`).join('')}</ul>
            </div>
          `).join('')}
        </div>
        <div class="footer-bottom">
          <span>${data.footer.bottom}</span>
          <div class="footer-badges">
            <span class="footer-badge">P</span>
            <span class="footer-badge">A</span>
            <span class="footer-badge">S</span>
            <span class="footer-badge">T</span>
            <span class="footer-badge">O</span>
          </div>
        </div>
      </div>
    </footer>
  `;

  bindEvents();
}

function bindEvents() {
  const filterBar = document.getElementById('filterBar');
  const dropdown = document.getElementById('completionDropdown');
  const menu = document.getElementById('dropdownMenu');

  filterBar.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    const cat = btn.dataset.category;
    if (cat === 'clear') {
      activeCategory = 'All';
      activeStatus = 'All';
    } else {
      activeCategory = cat;
    }
    render(data);
  });

  dropdown.addEventListener('click', (e) => {
    const item = e.target.closest('.dropdown-item');
    if (item) {
      activeStatus = item.dataset.status;
      render(data);
      return;
    }
    menu.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
      menu.classList.remove('open');
    }
  });

  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
      });
    });
  }
}

function applyEdits(newData) {
  data = newData;
  activeCategory = 'All';
  activeStatus = 'All';
  render(data);
  showToast('Changes applied successfully');
}

async function init() {
  try {
    const res = await fetch('data.json');
    data = await res.json();
    render(data);
  } catch (e) {
    document.getElementById('app').innerHTML = `
      <div style="text-align:center;padding:80px 20px;color:#6B7280;">
        <h2 style="color:#1A1A1A;">Failed to load data</h2>
        <p>Make sure data.json is accessible.</p>
      </div>
    `;
  }

  const editToggle = document.getElementById('editToggle');
  const editPanel = document.getElementById('editPanel');
  const jsonEditor = document.getElementById('jsonEditor');
  const closeEdit = document.getElementById('closeEdit');
  const cancelEdit = document.getElementById('cancelEdit');
  const saveEdit = document.getElementById('saveEdit');

  editToggle.addEventListener('click', () => {
    editPanel.classList.toggle('open');
    if (editPanel.classList.contains('open')) {
      jsonEditor.value = JSON.stringify(data, null, 2);
    }
  });

  const closePanel = () => editPanel.classList.remove('open');
  closeEdit.addEventListener('click', closePanel);
  cancelEdit.addEventListener('click', closePanel);

  saveEdit.addEventListener('click', () => {
    try {
      const newData = JSON.parse(jsonEditor.value);
      applyEdits(newData);
      closePanel();
    } catch (e) {
      showToast('Invalid JSON: ' + e.message);
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
