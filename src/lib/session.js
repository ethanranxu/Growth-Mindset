/**
 * Session management for participant flow.
 * Participants don't need accounts — we use localStorage tokens.
 */

const SESSION_KEY = 'gm_session_token';
const PARTICIPANT_KEY = 'gm_participant_id';
const FLOW_STATE_KEY = 'gm_flow_state';

// Valid flow states in order
export const FLOW_STATES = [
  'landing',
  'information',
  'consent',
  'eligibility',
  'baseline',
  'randomisation',
  'intervention',
  'posttest',
  'debrief',
  'contact',
  'completed',
];

export function generateSessionToken() {
  return crypto.randomUUID();
}

export function getSessionToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(SESSION_KEY);
}

export function setSessionToken(token) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SESSION_KEY, token);
}

export function getParticipantId() {
  if (typeof window === 'undefined') return null;
  let id = localStorage.getItem(PARTICIPANT_KEY);
  if (!id || id.startsWith('ECN-')) {
    id = getSessionToken() || generateSessionToken();
    localStorage.setItem(PARTICIPANT_KEY, id);
  }
  return id;
}

export function setParticipantId(id) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PARTICIPANT_KEY, id);
}

export function getFlowState() {
  if (typeof window === 'undefined') return 'landing';
  return localStorage.getItem(FLOW_STATE_KEY) || 'landing';
}

export function setFlowState(state) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(FLOW_STATE_KEY, state);
}

/**
 * Check if a target state is reachable from current state.
 * Prevents skipping steps or going backwards.
 */
export function canAccessState(targetState) {
  const currentState = getFlowState();
  const currentIndex = FLOW_STATES.indexOf(currentState);
  const targetIndex = FLOW_STATES.indexOf(targetState);
  // Allow current state and the next state only
  return targetIndex <= currentIndex + 1;
}

/**
 * Get the page path for a given flow state
 */
export function getPathForState(state) {
  const statePathMap = {
    landing: '/',
    information: '/information',
    consent: '/consent',
    eligibility: '/eligibility',
    baseline: '/baseline',
    randomisation: '/randomise',
    intervention: '/module',
    posttest: '/posttest',
    debrief: '/debrief',
    contact: '/contact',
    completed: '/thankyou',
  };
  return statePathMap[state] || '/';
}

const MAX_MODULE_KEY = 'gm_max_module';

export function getMaxModule() {
  if (typeof window === 'undefined') return 1;
  const id = getParticipantId();
  const key = id ? `${MAX_MODULE_KEY}_${id}` : MAX_MODULE_KEY;
  return parseInt(localStorage.getItem(key) || '1', 10);
}

export function setMaxModule(num) {
  if (typeof window === 'undefined') return;
  const id = getParticipantId();
  const key = id ? `${MAX_MODULE_KEY}_${id}` : MAX_MODULE_KEY;
  const current = getMaxModule();
  if (num > current) {
    localStorage.setItem(key, num.toString());
  }
}

export function clearSession() {
  if (typeof window === 'undefined') return;
  const id = getParticipantId();
  if (id) {
    localStorage.removeItem(`${MAX_MODULE_KEY}_${id}`);
    localStorage.removeItem(`gm_allocation_${id}`);
  }
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(PARTICIPANT_KEY);
  localStorage.removeItem(FLOW_STATE_KEY);
  localStorage.removeItem(MAX_MODULE_KEY);
}

export function initNewParticipantSession() {
  if (typeof window === 'undefined') return null;
  clearSession();
  const newId = crypto.randomUUID();
  localStorage.setItem(SESSION_KEY, newId);
  localStorage.setItem(PARTICIPANT_KEY, newId);
  localStorage.setItem(FLOW_STATE_KEY, 'information');
  return newId;
}
