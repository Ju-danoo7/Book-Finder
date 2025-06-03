'use client';

import { useState, useRef } from 'react';
import MainLayout from '@/components/MainLayout';
import { FaBook, FaSearch, FaExternalLinkAlt, FaShieldAlt, FaPaperPlane } from 'react-icons/fa';
import emailjs from '@emailjs/browser';

export default function AboutPage() {
  const [showContactForm, setShowContactForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // Initialize EmailJS with your User ID
      // Replace 'YOUR_USER_ID' with your actual EmailJS user ID
      emailjs.init('uS_jNunA5OVecDkCo');
      
      // Send email using EmailJS
      // Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with your actual service and template IDs
      const result = await emailjs.sendForm(
        'service_xj7bx8s', 
        'template_robaehc',
        formRef.current as HTMLFormElement,
        'uS_jNunA5OVecDkCo'
      );
      
      if (result.text === 'OK') {
        // Reset form and show success message
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
        setSubmitSuccess(true);
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          setSubmitSuccess(false);
          setShowContactForm(false);
        }, 5000);
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      setSubmitError('There was an error sending your message. Please try again or email us directly.');
      console.error('EmailJS error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">About BookFinder</h1>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
            Helping readers find legitimate sources for books online since 2025.
          </p>
        </div>

        {/* Mission Section */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold mb-6">Our Mission</h2>
            <p className="text-secondary-700 mb-4">
              BookFinder was created with a simple mission: to help readers find legitimate sources for books online, 
              whether free or paid, without facilitating copyright infringement.
            </p>
            <p className="text-secondary-700 mb-4">
              We believe that books should be accessible to everyone, but also that authors and publishers deserve 
              to be compensated for their work. That's why we focus on connecting readers with legal sources for books, 
              including public domain works, library borrowing options, and legitimate retailers.
            </p>
            <p className="text-secondary-700">
              Our goal is to make it easier for you to find and enjoy books while supporting the literary ecosystem.
            </p>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-8">How BookFinder Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <FaSearch className="text-primary-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">Search</h3>
              <p className="text-secondary-600 text-center">
                Enter a book title, author, or ISBN to find the book you're looking for.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <FaBook className="text-primary-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">Discover</h3>
              <p className="text-secondary-600 text-center">
                Browse through detailed information about the book, including summaries and metadata.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <FaExternalLinkAlt className="text-primary-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">Access</h3>
              <p className="text-secondary-600 text-center">
                Find links to legitimate sources where you can read, borrow, or purchase the book.
              </p>
            </div>
          </div>
        </section>

        {/* Our Commitment */}
        <section className="mb-16">
          <div className="bg-secondary-50 rounded-lg p-8">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/4 flex justify-center mb-6 md:mb-0">
                <FaShieldAlt className="text-primary-600 text-6xl" />
              </div>
              <div className="md:w-3/4">
                <h2 className="text-2xl font-semibold mb-4">Our Commitment to Legal Access</h2>
                <p className="text-secondary-700 mb-4">
                  BookFinder is committed to promoting legal access to books. We do not host or distribute copyrighted content, 
                  nor do we encourage copyright infringement.
                </p>
                <p className="text-secondary-700">
                  Instead, we provide information about legitimate sources where books can be found, including public domain 
                  repositories, libraries, and authorized retailers. We believe in supporting authors and publishers while 
                  also promoting literacy and access to knowledge.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section>
          <h2 className="text-2xl font-semibold mb-8">Our Team</h2>
          <p className="text-secondary-700 mb-8">
            BookFinder was created by a team of book lovers and technology enthusiasts who wanted to make it easier 
            for people to find and access books legally online. We're constantly working to improve our service and 
            add more features to help you discover your next great read.
          </p>
          
          <div className="text-center">
            <p className="text-secondary-600">
              Have questions or suggestions? We'd love to hear from you!
            </p>
            <button 
              onClick={() => setShowContactForm(!showContactForm)} 
              className="btn btn-primary mt-4"
            >
              Contact Us
            </button>
          </div>
          
          {/* Contact Form - Only shown when button is clicked */}
          {showContactForm && (
            <div className="mt-8 max-w-2xl mx-auto">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4">Get in Touch</h3>
                
                {submitSuccess ? (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
                    Thank you for your message! We'll get back to you soon.
                  </div>
                ) : (
                  <form ref={formRef} onSubmit={handleSubmit}>
                    {submitError && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                        {submitError}
                      </div>
                    )}
                    
                    <div className="mb-4">
                      <label htmlFor="name" className="block text-secondary-700 font-medium mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-secondary-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="email" className="block text-secondary-700 font-medium mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-secondary-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="subject" className="block text-secondary-700 font-medium mb-2">
                        Subject
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-secondary-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="">Select a subject</option>
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Suggestion">Suggestion</option>
                        <option value="Technical Support">Technical Support</option>
                        <option value="Partnership Opportunity">Partnership Opportunity</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="message" className="block text-secondary-700 font-medium mb-2">
                        Your Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={5}
                        className="w-full px-4 py-2 border border-secondary-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-primary-500"
                      ></textarea>
                    </div>
                    
                    {/* Hidden field for recipient email */}
                    <input 
                      type="hidden" 
                      name="to_email" 
                      value="daviddaniel91.dd.dd@gamil.com" 
                    />
                    
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setShowContactForm(false)}
                        className="btn btn-secondary mr-2"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary flex items-center"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="animate-spin mr-2">⟳</span>
                            Sending...
                          </>
                        ) : (
                          <>
                            <FaPaperPlane className="mr-2" />
                            Send Message
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </MainLayout>
  );
}
