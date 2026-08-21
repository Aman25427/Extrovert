const app = document.querySelector('#app');
const toastRegion = document.querySelector('#toast-region');

const stateData = {
  Maharashtra: {
    cities: ['Mumbai', 'Pune', 'Nagpur'],
    colleges: {
      Mumbai: ['University of Mumbai', 'St. Xavier\'s College', 'NMIMS Mumbai'],
      Pune: ['Savitribai Phule Pune University', 'Fergusson College', 'Symbiosis International'],
      Nagpur: ['Rashtrasant Tukadoji Maharaj Nagpur University', 'VNIT Nagpur']
    }
  },
  Karnataka: {
    cities: ['Bengaluru', 'Mysuru', 'Manipal'],
    colleges: {
      Bengaluru: ['Christ University', 'Bangalore University', 'PES University'],
      Mysuru: ['University of Mysore', 'Vidyavardhaka College'],
      Manipal: ['Manipal Academy of Higher Education', 'Welcomgroup Graduate School']
    }
  },
  Delhi: {
    cities: ['New Delhi', 'North Delhi', 'South Delhi'],
    colleges: {
      'New Delhi': ['Delhi University', 'Jamia Millia Islamia', 'Ashoka University'],
      'North Delhi': ['Hindu College', 'Miranda House'],
      'South Delhi': ['Lady Shri Ram College', 'Jesus and Mary College']
    }
  }
};

const wizard = {
  screen: 'landing',
  step: 1,
  agreed: false,
  data: {
    email: '',
    otp: '',
    name: '',
    birthDate: '',
    pronouns: '',
    state: '',
    city: '',
    college: '',
    interests: []
  },
  touched: {},
  errors: {},
  loading: false,
  resendIn: 0
};

const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

function initials(name) {
  return name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'E';
}

function showToast(message, type = 'error') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.setAttribute('role', 'status');
  toast.textContent = message;
  toastRegion.append(toast);
  window.setTimeout(() => toast.remove(), 4300);
}

function ageFromDate(value) {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.valueOf())) return null;
  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const monthGap = today.getMonth() - date.getMonth();
  if (monthGap < 0 || (monthGap === 0 && today.getDate() < date.getDate())) age -= 1;
  return age;
}

function validateField(name, force = false) {
  const value = typeof wizard.data[name] === 'string' ? wizard.data[name] : wizard.data[name];
  let error = '';
  if (name === 'email') {
    const normalized = value.trim();
    if (!normalized) error = 'Enter your email address.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(normalized)) error = 'Use a valid email address, like you@example.com.';
  }
  if (name === 'name') {
    const cleaned = value.trim();
    if (!cleaned) error = 'Tell us what your friends call you.';
    else if (cleaned.length < 2) error = 'Your name needs at least 2 characters.';
    else if (cleaned.length > 30) error = 'Keep your name to 30 characters or fewer.';
    else if (!/[a-zA-Z]/.test(cleaned)) error = 'Your name needs at least one letter.';
  }
  if (name === 'birthDate') {
    const age = ageFromDate(value);
    if (!value) error = 'Add your date of birth.';
    else if (age === null || new Date(`${value}T00:00:00`) > new Date()) error = 'Your birthday can’t be in the future.';
    else if (age < 18) error = 'Extroverts is for people aged 18 and over.';
    else if (age > 110) error = 'Please check that date of birth.';
  }
  if (name === 'pronouns' && !value) error = 'Choose an option to continue.';
  if (name === 'state' && !value) error = 'Choose your state.';
  if (name === 'city' && !value) error = 'Choose your city.';
  if (name === 'college' && !value) error = 'Choose your college.';
  if (force || wizard.touched[name]) wizard.errors[name] = error;
  return !error;
}

function validateStep(step) {
  const fields = step === 1 ? ['email'] : step === 3 ? ['name', 'birthDate', 'pronouns'] : step === 4 ? ['state', 'city', 'college'] : [];
  fields.forEach((field) => { wizard.touched[field] = true; validateField(field, true); });
  if (step === 4 && wizard.data.interests.length === 0) wizard.errors.interests = 'Pick at least one thing you’re into.';
  if (step === 4 && wizard.data.interests.length > 0) wizard.errors.interests = '';
  return fields.every((field) => !wizard.errors[field]) && !(step === 4 && wizard.errors.interests);
}

function fieldError(name) {
  return wizard.errors[name] ? `<span class="field-error" id="${name}-error">${escapeHtml(wizard.errors[name])}</span>` : `<span class="field-error" id="${name}-error"></span>`;
}

function inputField({ name, label, type = 'text', placeholder = '', maxLength, hint, autocomplete = '' }) {
  const value = escapeHtml(wizard.data[name] || '');
  const invalid = Boolean(wizard.errors[name]);
  return `<div class="field">
    <label for="${name}">${label}</label>
    <input id="${name}" name="${name}" type="${type}" value="${value}" placeholder="${placeholder}" ${maxLength ? `maxlength="${maxLength}"` : ''} autocomplete="${autocomplete}" aria-invalid="${invalid}" aria-describedby="${name}-error" />
    ${hint ? `<span class="hint">${hint}</span>` : ''}
    ${fieldError(name)}
  </div>`;
}

function selectField({ name, label, options, disabled = false }) {
  const invalid = Boolean(wizard.errors[name]);
  return `<div class="field">
    <label for="${name}">${label}</label>
    <select id="${name}" name="${name}" ${disabled ? 'disabled' : ''} aria-invalid="${invalid}" aria-describedby="${name}-error">
      <option value="">${disabled ? 'Choose the previous field first' : `Select ${label.toLowerCase()}`}</option>
      ${options.map((option) => `<option value="${escapeHtml(option)}" ${wizard.data[name] === option ? 'selected' : ''}>${escapeHtml(option)}</option>`).join('')}
    </select>
    ${fieldError(name)}
  </div>`;
}

function pageTop(link = '<button class="top-link" data-route="terms">Terms &amp; privacy</button>') {
  return `<div class="page-top">
    <div class="wordmark"><span class="brand-mark"><i></i><i></i><i></i></span><span>extroverts</span></div>
    ${link}
  </div>`;
}

function renderLanding() {
  app.innerHTML = `<section class="content landing-card">
    ${pageTop()}
    <p class="eyebrow">THE OFFLINE SOCIAL CLUB</p>
    <h2>More stories.<br />Less scrolling.</h2>
    <p>Extroverts makes it easy to meet people around you through plans that are actually happening. Your next favourite memory is probably nearby.</p>
    <button class="primary-button" data-action="start">Let’s go <span class="arrow">→</span></button>
    <p class="already">Already have an account? <button class="link-button" data-action="start">Sign in</button></p>
    <p class="landing-legal">By joining, you agree to play nice, stay safe, and follow our <button data-route="terms">community terms</button>.</p>
  </section>`;
}

function renderTerms() {
  app.innerHTML = `<section class="content terms">
    ${pageTop('<button class="top-link" data-route="landing">Close</button>')}
    <h2>Be good out<br />there.</h2>
    <p class="intro">A few simple rules make an open invite feel like a good idea. Please read these before you join the community.</p>
    <div class="terms-scroll">
      <h3>1. Respect the room</h3>
      <p>Show up with kindness and make space for everyone. Harassment, hate, threats, impersonation, or unwanted attention have no place here or at an Extroverts plan.</p>
      <h3>2. Keep it real</h3>
      <p>Use your real identity and accurate profile details. Don’t use the app to mislead people, sell unrelated products, or collect anyone’s personal information without permission.</p>
      <h3>3. Meet safely</h3>
      <p>Use public places for first meet-ups, let someone you trust know your plan, and trust your gut. Extroverts helps people connect, but you remain responsible for your choices offline.</p>
      <h3>4. 18+ community</h3>
      <p>You must be 18 or older to create an account. We may remove accounts that provide inaccurate age information or repeatedly ignore community standards.</p>
      <h3>5. Your privacy</h3>
      <p>We only use the information you add to personalise local plans and make your profile work. We never ask for a password or payment information during signup.</p>
    </div>
    <label class="agreement"><input id="agree" type="checkbox" ${wizard.agreed ? 'checked' : ''} /><span>I’ve read this and agree to keep Extroverts welcoming and safe.</span></label>
    <div class="terms-actions">
      <button class="back-button" data-route="landing">← Back</button>
      <button class="primary-button" data-action="accept-terms" ${wizard.agreed ? '' : 'disabled'}>I agree &amp; continue <span class="arrow">→</span></button>
    </div>
  </section>`;
}

function signupHeader() {
  const dots = [1, 2, 3, 4].map((number) => `<span class="${number < wizard.step ? 'done' : number === wizard.step ? 'current' : ''}"></span>`).join('');
  return `<div class="signup-head">
    <div class="progress-row"><div class="progress-dots" aria-label="Step ${wizard.step} of 4">${dots}</div><span class="step-label">0${wizard.step} / 04</span></div>`;
}

function renderStepOne() {
  app.innerHTML = `<section class="content">
    ${signupHeader()}
    <h2 class="form-title">Start with<br />your email.</h2>
    <p class="form-subtitle">We’ll use it to send a one-time code. No passwords, no fuss.</p>
    <form id="step-one-form" class="fields" novalidate>
      ${inputField({ name: 'email', label: 'Email address', type: 'email', placeholder: 'you@example.com', autocomplete: 'email' })}
      <div class="form-actions"><button class="primary-button" type="submit">Continue <span class="arrow">→</span></button></div>
    </form>
    <p class="privacy-note">We’ll never share your email or fill your inbox with nonsense.</p>
  </section>`;
}

function renderStepTwo() {
  const inputs = Array.from({ length: 6 }, (_, index) => `<input inputmode="numeric" autocomplete="one-time-code" aria-label="Verification digit ${index + 1}" maxlength="1" data-otp-index="${index}" value="${escapeHtml(wizard.data.otp[index] || '')}" />`).join('');
  const resend = wizard.resendIn > 0 ? `Resend in ${wizard.resendIn}s` : 'Resend code';
  app.innerHTML = `<section class="content">
    ${signupHeader()}
    <h2 class="form-title">Check your<br />inbox.</h2>
    <p class="form-subtitle">Enter the six-digit code we sent to</p>
    <span class="email-chip">${escapeHtml(wizard.data.email)}</span>
    <form id="step-two-form" class="fields" novalidate>
      <div>
        <div class="otp-area" aria-label="Six digit verification code">${inputs}</div>
        <div id="otp-error" class="otp-error" role="alert"></div>
        <div class="otp-meta"><span>It expires in 10 minutes.</span><button class="link-button" data-action="resend" type="button" ${wizard.resendIn > 0 ? 'disabled' : ''}>${resend}</button></div>
      </div>
      <div class="form-actions"><button class="back-button" data-action="back" type="button">← Back</button><button class="primary-button" type="submit">Verify email <span class="arrow">→</span></button></div>
    </form>
    <p class="demo-code">Prototype tip: use <strong>123456</strong> to verify. Any other complete code demonstrates the failed verification alert.</p>
  </section>`;
}

function renderStepThree() {
  const pronouns = [['she', 'She / her'], ['he', 'He / him'], ['they', 'They / them'], ['skip', 'Prefer not to say']];
  app.innerHTML = `<section class="content">
    ${signupHeader()}
    <h2 class="form-title">Put a face<br />to the invite.</h2>
    <p class="form-subtitle">A little context helps people say hello like they mean it.</p>
    <form id="step-three-form" class="fields" novalidate>
      ${inputField({ name: 'name', label: 'Your name', placeholder: 'What should we call you?', maxLength: 30, autocomplete: 'name' })}
      ${inputField({ name: 'birthDate', label: 'Date of birth', type: 'date', hint: 'You need to be 18 or older to join.' })}
      <div class="field">
        <span class="field-label">Pronouns</span>
        <div class="choice-grid">${pronouns.map(([value, label]) => `<label class="choice"><input type="radio" name="pronouns" value="${value}" ${wizard.data.pronouns === value ? 'checked' : ''}/>${label}</label>`).join('')}</div>
        ${fieldError('pronouns')}
      </div>
      <div class="form-actions"><button class="back-button" data-action="back" type="button">← Back</button><button class="primary-button" type="submit">Keep going <span class="arrow">→</span></button></div>
    </form>
  </section>`;
}

function renderStepFour() {
  const cities = wizard.data.state ? stateData[wizard.data.state].cities : [];
  const colleges = wizard.data.city ? stateData[wizard.data.state].colleges[wizard.data.city] : [];
  const interests = [['music', 'Live music'], ['food', 'Food spots'], ['fitness', 'Fitness'], ['art', 'Art & culture'], ['games', 'Game nights'], ['travel', 'Weekend trips']];
  app.innerHTML = `<section class="content">
    ${signupHeader()}
    <h2 class="form-title">Where do<br />we find you?</h2>
    <p class="form-subtitle">This lets us keep the good plans close to home.</p>
    <form id="step-four-form" class="fields" novalidate>
      <div class="split-fields">
        ${selectField({ name: 'state', label: 'State', options: Object.keys(stateData) })}
        ${selectField({ name: 'city', label: 'City', options: cities, disabled: !wizard.data.state })}
      </div>
      ${selectField({ name: 'college', label: 'College or university', options: colleges, disabled: !wizard.data.city })}
      <div class="field"><span class="field-label">What’s your scene?</span>
        <div class="choice-grid">${interests.map(([value, label]) => `<label class="choice"><input type="checkbox" name="interests" value="${value}" ${wizard.data.interests.includes(value) ? 'checked' : ''}/>${label}</label>`).join('')}</div>
        <span class="field-error" id="interests-error">${escapeHtml(wizard.errors.interests || '')}</span>
      </div>
      <div class="form-actions"><button class="back-button" data-action="back" type="button">← Back</button><button class="primary-button" type="submit">Create my profile <span class="arrow">→</span></button></div>
    </form>
  </section>`;
}

function renderSuccess() {
  const place = wizard.data.city || 'your city';
  app.innerHTML = `<section class="content success">
    <div class="success-burst">✓</div>
    <h2>You’re<br />on the list.</h2>
    <p>Welcome to Extroverts, ${escapeHtml(wizard.data.name.trim())}. We’ll start finding open invites and good people around ${escapeHtml(place)}.</p>
    <div class="profile-preview"><div class="avatar">${initials(wizard.data.name)}</div><div><strong>${escapeHtml(wizard.data.name.trim())}</strong><span>${escapeHtml(place)} · profile complete</span></div></div>
    <button class="primary-button" data-action="restart">Explore the vibe <span class="arrow">→</span></button>
  </section>`;
  showToast('Profile created — you’re ready to meet your people.', 'success');
}

function render() {
  if (wizard.screen === 'landing') renderLanding();
  else if (wizard.screen === 'terms') renderTerms();
  else if (wizard.screen === 'success') renderSuccess();
  else if (wizard.step === 1) renderStepOne();
  else if (wizard.step === 2) renderStepTwo();
  else if (wizard.step === 3) renderStepThree();
  else renderStepFour();
  app.focus({ preventScroll: true });
}

function setButtonLoading(button, text) {
  button.disabled = true;
  button.dataset.originalText = button.innerHTML;
  button.innerHTML = `<span class="button-spinner" aria-hidden="true"></span> ${text}`;
}

function simulate(button, label, callback) {
  setButtonLoading(button, label);
  window.setTimeout(callback, 750);
}

function moveBack() {
  if (wizard.step === 1) wizard.screen = 'landing';
  else wizard.step -= 1;
  render();
}

app.addEventListener('click', (event) => {
  const route = event.target.closest('[data-route]');
  if (route) {
    wizard.screen = route.dataset.route;
    render();
    return;
  }
  const action = event.target.closest('[data-action]');
  if (!action) return;
  const { action: name } = action.dataset;
  if (name === 'start') { wizard.screen = 'signup'; wizard.step = 1; render(); }
  if (name === 'accept-terms' && wizard.agreed) { wizard.screen = 'signup'; wizard.step = 1; render(); }
  if (name === 'back') moveBack();
  if (name === 'restart') { wizard.screen = 'landing'; wizard.step = 1; wizard.touched = {}; wizard.errors = {}; render(); }
  if (name === 'resend' && wizard.resendIn === 0) {
    wizard.resendIn = 30;
    showToast(`A fresh code is on its way to ${wizard.data.email}.`, 'success');
    render();
    const timer = window.setInterval(() => {
      wizard.resendIn -= 1;
      if (wizard.resendIn <= 0) { window.clearInterval(timer); wizard.resendIn = 0; }
      if (wizard.step === 2 && wizard.screen === 'signup') render();
    }, 1000);
  }
});

app.addEventListener('change', (event) => {
  const { name, value, checked } = event.target;
  if (event.target.id === 'agree') { wizard.agreed = checked; render(); return; }
  if (name === 'pronouns') { wizard.data.pronouns = value; wizard.touched.pronouns = true; validateField('pronouns'); render(); return; }
  if (name === 'interests') {
    wizard.data.interests = checked ? [...wizard.data.interests, value] : wizard.data.interests.filter((interest) => interest !== value);
    if (wizard.touched.interests) wizard.errors.interests = wizard.data.interests.length ? '' : 'Pick at least one thing you’re into.';
    render();
    return;
  }
  if (['state', 'city', 'college'].includes(name)) {
    wizard.data[name] = value;
    if (name === 'state') { wizard.data.city = ''; wizard.data.college = ''; wizard.errors.city = ''; wizard.errors.college = ''; }
    if (name === 'city') { wizard.data.college = ''; wizard.errors.college = ''; }
    wizard.touched[name] = true;
    validateField(name);
    render();
  }
});

app.addEventListener('input', (event) => {
  const { name } = event.target;
  if (!['email', 'name', 'birthDate'].includes(name)) return;
  let value = event.target.value;
  if (name === 'name') value = value.replace(/\s{2,}/g, ' ');
  wizard.data[name] = value;
  if (wizard.touched[name]) validateField(name);
  if (name === 'birthDate' && value) { wizard.touched.birthDate = true; validateField('birthDate'); }
  const error = wizard.errors[name] || '';
  const errorNode = document.querySelector(`#${name}-error`);
  if (errorNode) errorNode.textContent = error;
  event.target.setAttribute('aria-invalid', String(Boolean(error)));
});

app.addEventListener('blur', (event) => {
  const { name } = event.target;
  if (!['email', 'name', 'birthDate'].includes(name)) return;
  wizard.touched[name] = true;
  validateField(name);
  const errorNode = document.querySelector(`#${name}-error`);
  if (errorNode) errorNode.textContent = wizard.errors[name] || '';
  event.target.setAttribute('aria-invalid', String(Boolean(wizard.errors[name])));
}, true);

app.addEventListener('keydown', (event) => {
  const otp = event.target.closest('[data-otp-index]');
  if (!otp) return;
  const index = Number(otp.dataset.otpIndex);
  if (event.key === 'Backspace' && !otp.value && index > 0) {
    event.preventDefault();
    const previous = app.querySelector(`[data-otp-index="${index - 1}"]`);
    previous.focus();
    previous.select();
  }
  if (event.key === 'ArrowLeft' && index > 0) app.querySelector(`[data-otp-index="${index - 1}"]`).focus();
  if (event.key === 'ArrowRight' && index < 5) app.querySelector(`[data-otp-index="${index + 1}"]`).focus();
});

app.addEventListener('input', (event) => {
  const otp = event.target.closest('[data-otp-index]');
  if (!otp) return;
  const index = Number(otp.dataset.otpIndex);
  const digit = otp.value.replace(/\D/g, '').slice(-1);
  otp.value = digit;
  const pieces = wizard.data.otp.padEnd(6, ' ').split('');
  pieces[index] = digit || ' ';
  wizard.data.otp = pieces.join('').replace(/\s+$/, '');
  document.querySelector('#otp-error').textContent = '';
  if (digit && index < 5) app.querySelector(`[data-otp-index="${index + 1}"]`).focus();
});

app.addEventListener('paste', (event) => {
  const otp = event.target.closest('[data-otp-index]');
  if (!otp) return;
  const code = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
  if (!code) return;
  event.preventDefault();
  wizard.data.otp = code;
  app.querySelectorAll('[data-otp-index]').forEach((input, index) => { input.value = code[index] || ''; });
  const focusIndex = Math.min(code.length, 5);
  app.querySelector(`[data-otp-index="${focusIndex}"]`).focus();
});

app.addEventListener('submit', (event) => {
  event.preventDefault();
  const button = event.target.querySelector('button[type="submit"]');
  if (wizard.step === 1) {
    if (!validateStep(1)) { render(); showToast('Please check your email address and try again.'); return; }
    if (wizard.data.email.trim().toLowerCase().startsWith('fail')) { showToast('We couldn’t send a code right now. Try a different email.'); return; }
    simulate(button, 'Sending code', () => { wizard.data.email = wizard.data.email.trim(); wizard.step = 2; render(); showToast('Verification code sent. Check your inbox.', 'success'); });
  }
  if (wizard.step === 2) {
    const code = wizard.data.otp;
    const error = document.querySelector('#otp-error');
    if (code.length !== 6) { error.textContent = 'Enter all six digits from your email.'; showToast('Your verification code is incomplete.'); return; }
    if (code !== '123456') { error.textContent = 'That code didn’t match. Try 123456 for this prototype.'; showToast('That verification code isn’t correct.'); return; }
    simulate(button, 'Verifying', () => { wizard.step = 3; render(); });
  }
  if (wizard.step === 3) {
    if (!validateStep(3)) { render(); showToast('A few details need your attention.'); return; }
    simulate(button, 'Saving details', () => { wizard.data.name = wizard.data.name.trim(); wizard.step = 4; render(); });
  }
  if (wizard.step === 4) {
    wizard.touched.interests = true;
    if (!validateStep(4)) { render(); showToast('Finish the highlighted fields to create your profile.'); return; }
    simulate(button, 'Creating profile', () => { wizard.screen = 'success'; render(); });
  }
});

render();
