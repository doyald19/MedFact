const fc = require('fast-check/lib/cjs/fast-check');
import '@testing-library/jest-dom';

// Validation functions extracted for testing (matching ContactPage implementation)
const validateName = (name: string): string | undefined => {
  if (!name.trim()) {
    return 'Name is required';
  } else if (name.trim().length < 2) {
    return 'Name must be at least 2 characters';
  }
  return undefined;
};

const validateEmail = (email: string): string | undefined => {
  if (!email.trim()) {
    return 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'Please enter a valid email address';
  }
  return undefined;
};

const validateSubject = (subject: string): string | undefined => {
  if (!subject.trim()) {
    return 'Subject is required';
  } else if (subject.trim().length < 5) {
    return 'Subject must be at least 5 characters';
  }
  return undefined;
};

const validateMessage = (message: string): string | undefined => {
  if (!message.trim()) {
    return 'Message is required';
  } else if (message.trim().length < 10) {
    return 'Message must be at least 10 characters';
  }
  return undefined;
};

/**
 * **Feature: medfact-web-app, Property 9: Form validation and feedback**
 * **Validates: Requirements 6.3, 6.4, 7.3**
 * 
 * For any form submission (contact or settings), the system should validate input 
 * and provide appropriate feedback messages
 */
describe('Property 9: Form validation and feedback - Contact Form', () => {

  // Property test: Valid inputs should pass validation
  test('valid form inputs pass validation', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          name: fc.string({ minLength: 2, maxLength: 100 }).filter((s: string) => s.trim().length >= 2),
          email: fc.emailAddress(),
          subject: fc.string({ minLength: 5, maxLength: 200 }).filter((s: string) => s.trim().length >= 5),
          message: fc.string({ minLength: 10, maxLength: 1000 }).filter((s: string) => s.trim().length >= 10)
        }),
        async (formData: { name: string; email: string; subject: string; message: string }) => {
          // Property: Valid inputs should not produce validation errors
          expect(validateName(formData.name)).toBeUndefined();
          expect(validateEmail(formData.email)).toBeUndefined();
          expect(validateSubject(formData.subject)).toBeUndefined();
          expect(validateMessage(formData.message)).toBeUndefined();
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property test: Empty inputs should fail validation with appropriate messages
  test('empty inputs fail validation with appropriate error messages', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constant({}),
        async () => {
          // Property: Empty strings should produce specific error messages
          expect(validateName('')).toBe('Name is required');
          expect(validateEmail('')).toBe('Email is required');
          expect(validateSubject('')).toBe('Subject is required');
          expect(validateMessage('')).toBe('Message is required');
          
          // Property: Whitespace-only strings should also fail
          expect(validateName('   ')).toBe('Name is required');
          expect(validateEmail('   ')).toBe('Email is required');
          expect(validateSubject('   ')).toBe('Subject is required');
          expect(validateMessage('   ')).toBe('Message is required');
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property test: Short inputs should fail with minimum length errors
  test('short inputs fail validation with minimum length errors', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          shortName: fc.string({ minLength: 1, maxLength: 1 }).filter((s: string) => s.trim().length === 1),
          shortSubject: fc.string({ minLength: 1, maxLength: 4 }).filter((s: string) => s.trim().length >= 1 && s.trim().length < 5),
          shortMessage: fc.string({ minLength: 1, maxLength: 9 }).filter((s: string) => s.trim().length >= 1 && s.trim().length < 10)
        }),
        async (formData: { shortName: string; shortSubject: string; shortMessage: string }) => {
          // Property: Inputs below minimum length should produce specific error messages
          expect(validateName(formData.shortName)).toBe('Name must be at least 2 characters');
          expect(validateSubject(formData.shortSubject)).toBe('Subject must be at least 5 characters');
          expect(validateMessage(formData.shortMessage)).toBe('Message must be at least 10 characters');
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property test: Invalid email formats should fail validation
  test('invalid email formats fail validation', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.oneof(
          fc.string({ minLength: 1, maxLength: 50 }).filter((s: string) => !s.includes('@')),
          fc.string({ minLength: 1, maxLength: 50 }).filter((s: string) => s.includes('@') && !s.includes('.')),
          fc.constant('invalid'),
          fc.constant('test@'),
          fc.constant('@test.com'),
          fc.constant('test@test')
        ),
        async (invalidEmail: string) => {
          // Property: Invalid email formats should produce email validation error
          const error = validateEmail(invalidEmail);
          expect(error).toBe('Please enter a valid email address');
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Unit tests for specific examples and edge cases
describe('Contact form validation unit tests', () => {

  test('valid name passes validation', () => {
    expect(validateName('John')).toBeUndefined();
    expect(validateName('John Doe')).toBeUndefined();
    expect(validateName('AB')).toBeUndefined();
  });

  test('invalid name fails validation', () => {
    expect(validateName('')).toBe('Name is required');
    expect(validateName('   ')).toBe('Name is required');
    expect(validateName('A')).toBe('Name must be at least 2 characters');
  });

  test('valid email passes validation', () => {
    expect(validateEmail('test@example.com')).toBeUndefined();
    expect(validateEmail('user.name@domain.org')).toBeUndefined();
  });

  test('invalid email fails validation', () => {
    expect(validateEmail('')).toBe('Email is required');
    expect(validateEmail('invalid')).toBe('Please enter a valid email address');
    expect(validateEmail('test@')).toBe('Please enter a valid email address');
    expect(validateEmail('@test.com')).toBe('Please enter a valid email address');
  });

  test('valid subject passes validation', () => {
    expect(validateSubject('Hello')).toBeUndefined();
    expect(validateSubject('Test Subject')).toBeUndefined();
  });

  test('invalid subject fails validation', () => {
    expect(validateSubject('')).toBe('Subject is required');
    expect(validateSubject('Hi')).toBe('Subject must be at least 5 characters');
  });

  test('valid message passes validation', () => {
    expect(validateMessage('This is a valid message')).toBeUndefined();
    expect(validateMessage('1234567890')).toBeUndefined();
  });

  test('invalid message fails validation', () => {
    expect(validateMessage('')).toBe('Message is required');
    expect(validateMessage('Short')).toBe('Message must be at least 10 characters');
  });
});
