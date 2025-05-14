import React, { useState } from 'react';
import '../../styles/landing.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [formStatus, setFormStatus] = useState({
    loading: false,
    error: false,
    success: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus({ loading: true, error: false, success: false });

    // Simulate form submission
    setTimeout(() => {
      setFormStatus({ loading: false, error: false, success: true });

      // Reset form after successful submission
      setTimeout(() => {
        setFormData({ name: '', email: '', subject: '', message: '' });
        setFormStatus({ loading: false, error: false, success: false });
      }, 3000);
    }, 1500);
  };

  return (
    <section id="contact" className="landing-contact landing-section">
      <div className="container mx-auto px-6">
        <h2 className="section-title">Contact Us</h2>
        <p className="section-subtitle">
          Have questions or need assistance? Reach out to our team and we'll get back to you as soon as possible.
        </p>

        <div className="landing-contact-content">
          <div className="landing-contact-info">
            <h3 className="landing-contact-title">Get in Touch</h3>
            <p className="landing-contact-description">
              Our team is here to help you with any questions or concerns you may have about our services.
              Feel free to reach out to us using the contact information below or by filling out the form.
            </p>

            <div className="landing-contact-items">
              <div className="landing-contact-item">
                <div className="landing-contact-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-1 text-gray-900 dark:text-white">Address</h4>
                  <p className="landing-contact-text">123 Finance Street, Tunis, Tunisia</p>
                </div>
              </div>

              <div className="landing-contact-item">
                <div className="landing-contact-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-1 text-gray-900 dark:text-white">Phone</h4>
                  <p className="landing-contact-text">+216 123 456 789</p>
                </div>
              </div>

              <div className="landing-contact-item">
                <div className="landing-contact-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-1 text-gray-900 dark:text-white">Email</h4>
                  <p className="landing-contact-text">info@tunibalance.com</p>
                </div>
              </div>

              <div className="landing-contact-item">
                <div className="landing-contact-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-1 text-gray-900 dark:text-white">Hours</h4>
                  <p className="landing-contact-text">Monday - Friday: 9:00 AM - 5:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          <div className="landing-contact-form">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="landing-form-group">
                  <label htmlFor="name" className="landing-form-label">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="landing-form-input"
                    required
                  />
                </div>

                <div className="landing-form-group">
                  <label htmlFor="email" className="landing-form-label">Your Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="landing-form-input"
                    required
                  />
                </div>
              </div>

              <div className="landing-form-group mb-6">
                <label htmlFor="subject" className="landing-form-label">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="landing-form-input"
                  required
                />
              </div>

              <div className="landing-form-group mb-6">
                <label htmlFor="message" className="landing-form-label">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="landing-form-textarea"
                  required
                ></textarea>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  disabled={formStatus.loading}
                  className="landing-button landing-button-primary px-8 py-3 w-full md:w-auto"
                >
                  {formStatus.loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </div>

              {formStatus.success && (
                <div className="mt-4 p-4 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-300 text-center">
                  Your message has been sent successfully. We'll get back to you soon!
                </div>
              )}

              {formStatus.error && (
                <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-center">
                  There was an error sending your message. Please try again later.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact