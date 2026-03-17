'use strict';

/* ────────────────────────────────────────────────
   Helpers
───────────────────────────────────────────────── */
function getField(id) { return document.getElementById(id); }

function setValidity(input, feedbackEl, isValid, message) {
  input.classList.toggle('is-valid',   isValid);
  input.classList.toggle('is-invalid', !isValid);
  feedbackEl.textContent  = message;
  feedbackEl.className    = 'field-feedback ' + (isValid ? 'success' : 'error');
}

function clearValidity(input, feedbackEl) {
  input.classList.remove('is-valid', 'is-invalid');
  feedbackEl.textContent = '';
  feedbackEl.className   = 'field-feedback';
}

/* ────────────────────────────────────────────────
   Password strength
───────────────────────────────────────────────── */
function calcStrength(pw) {
  let score = 0;
  if (pw.length >= 8)               score++;
  if (pw.length >= 12)              score++;
  if (/[A-Z]/.test(pw))            score++;
  if (/[0-9]/.test(pw))            score++;
  if (/[^A-Za-z0-9]/.test(pw))    score++;
  return score; // 0-5
}

const STRENGTH_LABELS = ['', 'Muito fraca', 'Fraca', 'Razoável', 'Forte', 'Muito forte'];
const STRENGTH_COLORS = ['', '#e53e3e', '#dd6b20', '#d69e2e', '#38a169', '#2b6cb0'];

function updateStrengthBar(pw) {
  const bar   = document.getElementById('strengthFill');
  const label = document.getElementById('strengthLabel');
  if (!pw) {
    bar.style.width = '0%';
    label.textContent = '';
    return;
  }
  const score = calcStrength(pw);
  bar.style.width           = (score / 5 * 100) + '%';
  bar.style.backgroundColor = STRENGTH_COLORS[score];
  label.textContent         = STRENGTH_LABELS[score];
  label.style.color         = STRENGTH_COLORS[score];
}

/* ────────────────────────────────────────────────
   Field validators
───────────────────────────────────────────────── */
function validateName() {
  const input    = getField('userName');
  const feedback = getField('userNameFeedback');
  const val      = input.value.trim();
  if (!val) {
    setValidity(input, feedback, false, 'Nome do usuário é obrigatório.');
    return false;
  }
  if (val.length < 3) {
    setValidity(input, feedback, false, 'Nome deve ter pelo menos 3 caracteres.');
    return false;
  }
  setValidity(input, feedback, true, '');
  return true;
}

function validateLogin() {
  const input    = getField('userLogin');
  const feedback = getField('userLoginFeedback');
  const val      = input.value.trim();
  if (!val) {
    setValidity(input, feedback, false, 'Login é obrigatório.');
    return false;
  }
  if (!/^[a-zA-Z0-9._-]{3,}$/.test(val)) {
    setValidity(input, feedback, false, 'Login deve ter pelo menos 3 caracteres (letras, números, . _ -).');
    return false;
  }
  setValidity(input, feedback, true, '');
  return true;
}

function validatePassword() {
  const input    = getField('userPassword');
  const feedback = getField('userPasswordFeedback');
  const val      = input.value;
  if (!val) {
    setValidity(input, feedback, false, 'Senha é obrigatória.');
    return false;
  }
  if (val.length < 8) {
    setValidity(input, feedback, false, 'Senha deve ter pelo menos 8 caracteres.');
    return false;
  }
  setValidity(input, feedback, true, '');
  return true;
}

function validateConfirmPassword() {
  const pw       = getField('userPassword').value;
  const input    = getField('userConfirmPassword');
  const feedback = getField('userConfirmPasswordFeedback');
  const val      = input.value;
  if (!val) {
    setValidity(input, feedback, false, 'Confirmação de senha é obrigatória.');
    return false;
  }
  if (val !== pw) {
    setValidity(input, feedback, false, 'As senhas não coincidem.');
    return false;
  }
  setValidity(input, feedback, true, 'Senhas coincidem.');
  return true;
}

function validateProfile() {
  const input    = getField('userProfile');
  const feedback = getField('userProfileFeedback');
  if (!input.value) {
    setValidity(input, feedback, false, 'Selecione um perfil.');
    return false;
  }
  setValidity(input, feedback, true, '');
  return true;
}

/* ────────────────────────────────────────────────
   Modification history
───────────────────────────────────────────────── */
let historyEntries = [];

function renderHistory() {
  const tbody = document.getElementById('historyBody');
  const empty = document.getElementById('historyEmpty');

  if (historyEntries.length === 0) {
    tbody.closest('table').classList.add('hidden');
    empty.classList.remove('hidden');
    return;
  }

  empty.classList.add('hidden');
  tbody.closest('table').classList.remove('hidden');

  tbody.innerHTML = historyEntries.map(entry => `
    <tr>
      <td>${escapeHtml(entry.date)}</td>
      <td>${escapeHtml(entry.user)}</td>
      <td><span class="badge badge-${entry.type === 'Criação' ? 'create' : 'update'}">${escapeHtml(entry.type)}</span></td>
      <td>${escapeHtml(entry.description)}</td>
    </tr>
  `).join('');
}

function addHistoryEntry(type, description) {
  const now = new Date();
  historyEntries.unshift({
    date:        now.toLocaleString('pt-BR'),
    user:        'Sistema',
    type,
    description,
  });
  renderHistory();
}

/* Prevent XSS in dynamic HTML */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ────────────────────────────────────────────────
   Toast notifications
───────────────────────────────────────────────── */
function showToast(message, type) {
  const container = document.getElementById('toastContainer');
  const toast     = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const icon = type === 'success'
    ? '<svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="4 10 8 14 16 6"/></svg>'
    : '<svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="10" cy="10" r="8"/><line x1="10" y1="6" x2="10" y2="10"/><line x1="10" y1="14" x2="10" y2="14"/></svg>';

  toast.innerHTML = icon + escapeHtml(message);
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity    = '0';
    toast.style.transition = 'opacity 0.4s';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

/* ────────────────────────────────────────────────
   Form submit
───────────────────────────────────────────────── */
function handleSubmit(event) {
  event.preventDefault();

  const validName     = validateName();
  const validLogin    = validateLogin();
  const validPw       = validatePassword();
  const validConfirm  = validateConfirmPassword();
  const validProfile  = validateProfile();

  if (!(validName && validLogin && validPw && validConfirm && validProfile)) {
    showToast('Corrija os erros antes de salvar.', 'error');
    return;
  }

  const isFirstSave = historyEntries.length === 0;
  addHistoryEntry(
    isFirstSave ? 'Criação' : 'Atualização',
    isFirstSave ? 'Cadastro de usuário realizado.' : 'Dados do usuário atualizados.'
  );
  showToast('Usuário salvo com sucesso!', 'success');
}

/* ────────────────────────────────────────────────
   Form reset
───────────────────────────────────────────────── */
function handleReset() {
  const form = document.getElementById('userForm');
  form.reset();

  ['userName', 'userLogin', 'userPassword', 'userConfirmPassword', 'userProfile'].forEach(id => {
    const el = getField(id);
    clearValidity(el, getField(id + 'Feedback'));
  });

  updateStrengthBar('');
  document.getElementById('strengthLabel').textContent = '';
}

/* ────────────────────────────────────────────────
   Event wiring
───────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  renderHistory();

  getField('userName').addEventListener('blur',  validateName);
  getField('userName').addEventListener('input', validateName);

  getField('userLogin').addEventListener('blur',  validateLogin);
  getField('userLogin').addEventListener('input', validateLogin);

  getField('userPassword').addEventListener('input', () => {
    updateStrengthBar(getField('userPassword').value);
    if (getField('userPassword').classList.contains('is-invalid') ||
        getField('userPassword').classList.contains('is-valid')) {
      validatePassword();
    }
    if (getField('userConfirmPassword').value) validateConfirmPassword();
  });
  getField('userPassword').addEventListener('blur', validatePassword);

  getField('userConfirmPassword').addEventListener('input', validateConfirmPassword);
  getField('userConfirmPassword').addEventListener('blur',  validateConfirmPassword);

  getField('userProfile').addEventListener('change', validateProfile);

  document.getElementById('userForm').addEventListener('submit', handleSubmit);
  document.getElementById('btnCancel').addEventListener('click', handleReset);
});
