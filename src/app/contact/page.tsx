'use client';
import { useState } from 'react';
import styles from './contact.module.css';

export default function ContactPage() {
  const [formState, setFormState] = useState<'idle' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    services: [] as string[],
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const form = e.currentTarget;
      const formDataObj = new FormData(form);

      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formDataObj as any).toString(),
      });

      if (response.ok) {
        setFormState('success');
        setFormData({
          name: '',
          email: '',
          services: [],
          message: '',
        });
      } else {
        setFormState('error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setFormState('error');
    }
  };

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  return (
    <div className={styles.contactPage}>
      <div className={styles.hero}>
        <p className={styles.subtitle}>Stay in the know</p>
        <h1 className={styles.title}>Contact Me</h1>
        <p className={styles.description}>
          Big ideas. Bright minds. Reach out and let's create together.
        </p>
      </div>

      <div className={styles.formContainer}>
        <form
          name="contact"
          method="POST"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
          onSubmit={handleSubmit}
          className={styles.form}
        >
          {/* Netlify form detection */}
          <input type="hidden" name="form-name" value="contact" />
          
          {/* Honeypot field for spam protection */}
          <p hidden>
            <label>
              Don't fill this out: <input name="bot-field" />
            </label>
          </p>

          {/* Name */}
          <div className={styles.formGroup}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={styles.input}
            />
          </div>

          {/* Email */}
          <div className={styles.formGroup}>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={styles.input}
            />
          </div>



          {/* Services */}
          <div className={styles.formGroup}>
            <label className={styles.label}>What services do you need?</label>
            <div className={styles.checkboxGroup}>
              {['Development', 'Design', 'Voice Acting', 'Coaching'].map(service => (
                <label key={service} className={styles.checkbox}>
                  <input
                    type="checkbox"
                    name="services"
                    value={service}
                    checked={formData.services.includes(service)}
                    onChange={() => handleServiceToggle(service)}
                  />
                  <span>{service}</span>
                </label>
              ))}
            </div>
          </div>


          {/* Message */}
          <div className={styles.formGroup}>
            <textarea
              name="message"
              placeholder="Message"
              rows={6}
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className={styles.textarea}
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className={styles.submitButton}>
            Send Message
          </button>

          {/* Success/Error Messages */}
          {formState === 'success' && (
            <div className={styles.successMessage}>
              <h3>Thank you!</h3>
              <p>Your submission has been received! I'll reach out shortly.</p>
            </div>
          )}

          {formState === 'error' && (
            <div className={styles.errorMessage}>
              <p>Oops! Something went wrong while submitting the form.</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}