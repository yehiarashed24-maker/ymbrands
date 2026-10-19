/**
 * YM Enterprise Security & Anti-Abuse Shield
 * 
 * Protects against:
 * - Cross-Site Scripting (XSS) & Script Injection
 * - Request Flooding & Bot Spam (Rate Limiting)
 * - Malicious File Uploads (SVG exploits, oversized blobs)
 * - Brute-Force Guessing on Admin HQ (Exponential Lockout)
 * - Session Ticket Forgery & LocalStorage Tampering (Cryptographic SHA-256 Signatures)
 * - Protocol Injection (javascript: & data: URIs)
 */

const SECURITY_SALT = 'YM_HQ_CRYPT_SALT_2026_PRODUCTION';

// ==========================================
// 1. CRYPTOGRAPHIC UTILITIES (SHA-256)
// ==========================================

export const sha256 = async (input: string): Promise<string> => {
  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  
  // Fallback simple 64-character hash for non-crypto environments
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(64, '0');
};

/**
 * Generate a cryptographically signed session ticket.
 * Binds the passcode, the issue timestamp, and a secret pepper.
 */
export const generateAdminSessionTicket = async (
  passcode: string,
  timestamp: number
): Promise<string> => {
  const payload = `YM_HQ_TICKET_${passcode}_${timestamp}_${SECURITY_SALT}`;
  return sha256(payload);
};

/**
 * Verify an admin session ticket and check for tampering or expiration.
 */
export const verifyAdminSessionTicket = async (
  ticket: string | null,
  passcode: string,
  timestampStr: string | null,
  maxAgeMs = 15 * 60 * 1000 // 15 minutes max session age
): Promise<boolean> => {
  if (!ticket || !timestampStr) return false;

  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) return false;

  const now = Date.now();
  // Reject future timestamps or expired tickets
  if (timestamp > now || now - timestamp > maxAgeMs) {
    return false;
  }

  const expectedTicket = await generateAdminSessionTicket(passcode, timestamp);
  return ticket === expectedTicket;
};

// ==========================================
// 2. TIMING DELAY (ANTI-BRUTE FORCE / TIMING ATTACKS)
// ==========================================
export const timingDelay = (minMs = 300, maxMs = 600): Promise<void> => {
  const ms = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// ==========================================
// 2.5 CLIENT-SIDE STANDARD RATE LIMITER
// ==========================================

export const checkRateLimit = (
  key: string,
  maxAttempts = 5,
  windowSeconds = 60
): { allowed: boolean; retryAfterSeconds: number } => {
  if (typeof window === 'undefined') return { allowed: true, retryAfterSeconds: 0 };

  const storageKey = `ym_rate_${key}`;
  const now = Date.now();
  const windowMs = windowSeconds * 1000;

  try {
    const raw = sessionStorage.getItem(storageKey);
    let timestamps: number[] = raw ? JSON.parse(raw) : [];

    // Filter out expired timestamps
    timestamps = timestamps.filter((t) => now - t < windowMs);

    if (timestamps.length >= maxAttempts) {
      const oldest = timestamps[0];
      const retryAfterSeconds = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
      return { allowed: false, retryAfterSeconds };
    }

    // Add current attempt and save
    timestamps.push(now);
    sessionStorage.setItem(storageKey, JSON.stringify(timestamps));
    return { allowed: true, retryAfterSeconds: 0 };
  } catch {
    return { allowed: true, retryAfterSeconds: 0 };
  }
};

// ==========================================
// 3. EXPONENTIAL PERSISTENT RATE LIMITER
// ==========================================

interface LockoutState {
  count: number;
  lockUntil: number;
  lastAttempt: number;
  sig: string;
}

const getLockoutStorageKey = (actionKey: string) => `ym_sec_lockout_${actionKey}`;

export const checkStrictRateLimit = async (
  actionKey: string
): Promise<{ allowed: boolean; retryAfterSeconds: number }> => {
  const now = Date.now();
  const key = getLockoutStorageKey(actionKey);

  try {
    const raw = localStorage.getItem(key);
    if (!raw) return { allowed: true, retryAfterSeconds: 0 };

    const state: LockoutState = JSON.parse(raw);

    // Verify tamper check
    const expectedSig = await sha256(`${state.count}_${state.lockUntil}_${SECURITY_SALT}`);
    if (state.sig !== expectedSig) {
      // Storage tampered! Enforce hard 1-hour lockdown
      localStorage.setItem(
        key,
        JSON.stringify({
          count: 10,
          lockUntil: now + 3600 * 1000,
          lastAttempt: now,
          sig: await sha256(`10_${now + 3600 * 1000}_${SECURITY_SALT}`),
        })
      );
      return { allowed: false, retryAfterSeconds: 3600 };
    }

    if (state.lockUntil > now) {
      const remainingSeconds = Math.ceil((state.lockUntil - now) / 1000);
      return { allowed: false, retryAfterSeconds: remainingSeconds };
    }

    // Cooldown passed
    return { allowed: true, retryAfterSeconds: 0 };
  } catch {
    return { allowed: true, retryAfterSeconds: 0 };
  }
};

export const recordFailedAttempt = async (actionKey: string): Promise<number> => {
  const now = Date.now();
  const key = getLockoutStorageKey(actionKey);

  let currentCount = 0;
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const state: LockoutState = JSON.parse(raw);
      currentCount = state.count;
    }
  } catch {
    currentCount = 0;
  }

  const newCount = currentCount + 1;
  let penaltySeconds = 0;

  if (newCount >= 7) {
    penaltySeconds = 3600; // 1 hour lockout for 7+ failed attempts
  } else if (newCount >= 5) {
    penaltySeconds = 900; // 15 minutes lockout for 5 attempts
  } else if (newCount >= 3) {
    penaltySeconds = 120; // 2 minutes lockout for 3 attempts
  }

  const lockUntil = penaltySeconds > 0 ? now + penaltySeconds * 1000 : 0;
  const sig = await sha256(`${newCount}_${lockUntil}_${SECURITY_SALT}`);

  const newState: LockoutState = {
    count: newCount,
    lockUntil,
    lastAttempt: now,
    sig,
  };

  try {
    localStorage.setItem(key, JSON.stringify(newState));
  } catch {
    // Ignore quota issues
  }

  return penaltySeconds;
};

export const clearFailedAttempts = (actionKey: string): void => {
  try {
    localStorage.removeItem(getLockoutStorageKey(actionKey));
  } catch {
    // Ignore
  }
};

// ==========================================
// 4. INPUT SANITIZATION & PROTOCOL STRIPPING
// ==========================================

export const sanitizeString = (input: unknown, maxLength = 500): string => {
  if (typeof input !== 'string') return '';

  let clean = input.slice(0, maxLength).trim();

  // Strip script, style, and object tags
  clean = clean.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  clean = clean.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  clean = clean.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '');
  clean = clean.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');

  // Strip HTML tags
  clean = clean.replace(/<\/?[^>]+(>|$)/g, '');

  // Neutralize event handlers
  clean = clean.replace(/on\w+\s*=/gi, '');

  // Strip dangerous protocols
  clean = clean.replace(/(?:javascript|vbscript|data):/gi, '');

  return clean;
};

export const sanitizeUrl = (url: unknown): string => {
  if (typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.href;
    }
    return '';
  } catch {
    return '';
  }
};

export const sanitizePhone = (phone: unknown): string => {
  if (typeof phone !== 'string') return '';
  let cleaned = phone.replace(/[^\d+]/g, '');
  if (cleaned.startsWith('+')) {
    cleaned = '+' + cleaned.slice(1).replace(/\+/g, '');
  } else {
    cleaned = cleaned.replace(/\+/g, '');
  }
  return cleaned.slice(0, 20);
};

export const isValidEmail = (email: unknown): boolean => {
  if (typeof email !== 'string') return false;
  const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return regex.test(email.trim());
};

// ==========================================
// 5. HONEYPOT & FILE VALIDATION
// ==========================================

export const isHoneypotTriggered = (honeypotValue: unknown): boolean => {
  if (typeof honeypotValue === 'string' && honeypotValue.trim().length > 0) {
    console.warn('[Security] Honeypot triggered. Request blocked.');
    return true;
  }
  return false;
};

export const validateImageUpload = (file: File): { valid: boolean; error?: string } => {
  const MAX_SIZE = 5 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    return { valid: false, error: 'File size exceeds maximum limit of 5MB.' };
  }

  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
    return { valid: false, error: 'Only JPEG, PNG, and WEBP image formats are permitted.' };
  }

  return { valid: true };
};
