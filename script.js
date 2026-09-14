const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('in-view');
  });
}, { threshold: 0.15 });

document.querySelectorAll('.skill-list article, .log li, .project-card').forEach((item) => observer.observe(item));

const skillNotesStorageKey = 'max-ai-build-skill-notes';

const cursorGlow = document.querySelector('.cursor-glow');
let glowX = window.innerWidth / 2;
let glowY = window.innerHeight / 2;
let pointerX = glowX;
let pointerY = glowY;
let glowAnimationFrame;

function animateCursorGlow() {
  glowX += (pointerX - glowX) * 0.12;
  glowY += (pointerY - glowY) * 0.12;
  cursorGlow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0) translate3d(-50%, -50%, 0)`;
  glowAnimationFrame = requestAnimationFrame(animateCursorGlow);
}

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.addEventListener('pointermove', (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
  }, { passive: true });
  animateCursorGlow();
} else {
  cursorGlow.remove();
  cancelAnimationFrame(glowAnimationFrame);
}

const typewriterCopy = document.querySelector('[data-typewriter]');
if (typewriterCopy && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const originalText = typewriterCopy.dataset.typewriter;
  typewriterCopy.textContent = '';
  let characterIndex = 0;
  const typeNextCharacter = () => {
    typewriterCopy.textContent += originalText.charAt(characterIndex);
    characterIndex += 1;
    if (characterIndex < originalText.length) window.setTimeout(typeNextCharacter, 22);
  };
  window.setTimeout(typeNextCharacter, 450);
}

function getSkillNotes() {
  try {
    const savedNotes = JSON.parse(localStorage.getItem(skillNotesStorageKey) || '{}');
    return savedNotes && typeof savedNotes === 'object' ? savedNotes : {};
  } catch {
    return {};
  }
}

function saveSkillNotes(notes) {
  localStorage.setItem(skillNotesStorageKey, JSON.stringify(notes));
}

function formatDateTime(date) {
  const pad = (number) => String(number).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

document.querySelectorAll('.skill-card').forEach((card) => {
  const trigger = card.querySelector('.skill-trigger');
  const notePanel = card.querySelector('.skill-note');
  const textarea = card.querySelector('.skill-textarea');
  const saveButton = card.querySelector('.skill-save');
  const status = card.querySelector('.skill-save-state');
  const skillId = card.dataset.skillId;

  trigger.addEventListener('click', () => {
    const isOpen = card.classList.toggle('is-open');
    notePanel.classList.toggle('hidden', !isOpen);
    trigger.setAttribute('aria-expanded', String(isOpen));
    if (isOpen) {
      const savedNote = getSkillNotes()[skillId];
      textarea.value = savedNote?.text || '';
      saveButton.textContent = savedNote?.text ? 'UPDATE NOTE ↗' : 'SAVE NOTE ↗';
      status.textContent = savedNote?.updatedAt ? `LAST UPDATED ${savedNote.updatedAt}` : 'NEW NOTE';
      textarea.focus();
    }
  });

  saveButton.addEventListener('click', () => {
    const notes = getSkillNotes();
    notes[skillId] = { text: textarea.value.trim(), updatedAt: formatDateTime(new Date()) };
    saveSkillNotes(notes);
    status.textContent = `SAVED ${notes[skillId].updatedAt}`;
    saveButton.textContent = 'UPDATE NOTE ↗';
  });
});
