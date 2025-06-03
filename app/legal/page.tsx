'use client';

import { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { FaGavel, FaUserShield, FaCopyright } from 'react-icons/fa';

export default function LegalPage() {
  const [activeSection, setActiveSection] = useState<string>('terms');
  
  return (
    <MainLayout>
      <div className="container py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Legal Information</h1>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
            Important legal information about using BookFinder
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-secondary-200 mb-8">
          <button
            onClick={() => setActiveSection('terms')}
            className={`py-3 px-6 font-medium ${
              activeSection === 'terms'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-secondary-600 hover:text-primary-600'
            }`}
            id="terms"
          >
            Terms of Service
          </button>
          <button
            onClick={() => setActiveSection('privacy')}
            className={`py-3 px-6 font-medium ${
              activeSection === 'privacy'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-secondary-600 hover:text-primary-600'
            }`}
            id="privacy"
          >
            Privacy Policy
          </button>
          <button
            onClick={() => setActiveSection('copyright')}
            className={`py-3 px-6 font-medium ${
              activeSection === 'copyright'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-secondary-600 hover:text-primary-600'
            }`}
            id="copyright"
          >
            Copyright Notice
          </button>
        </div>

        {/* Content Sections */}
        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Terms of Service */}
          {activeSection === 'terms' && (
            <div>
              <div className="flex items-center mb-6">
                <FaGavel className="text-primary-600 text-3xl mr-4" />
                <h2 className="text-2xl font-semibold">Terms of Service</h2>
              </div>
              
              <div className="prose max-w-none">
                <h3>1. Acceptance of Terms</h3>
                <p>
                  By accessing or using BookFinder, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
                </p>
                
                <h3>2. Description of Service</h3>
                <p>
                  BookFinder is a service that provides information about where books can be found online through legitimate sources. We do not host, store, or distribute any books or other copyrighted content.
                </p>
                
                <h3>3. User Conduct</h3>
                <p>
                  You agree not to use BookFinder for any illegal purposes, including but not limited to copyright infringement. You are solely responsible for your use of the links and resources provided by our service.
                </p>
                
                <h3>4. External Links</h3>
                <p>
                  BookFinder provides links to external websites and resources. We are not responsible for the content, accuracy, or practices of any third-party websites linked from our service.
                </p>
                
                <h3>5. Limitation of Liability</h3>
                <p>
                  BookFinder and its operators shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages resulting from your access to or use of our service.
                </p>
                
                <h3>6. Modifications to Terms</h3>
                <p>
                  We reserve the right to modify these terms at any time. Continued use of BookFinder after changes to the Terms of Service constitutes acceptance of the modified terms.
                </p>
                
                <h3>7. Governing Law</h3>
                <p>
                  These Terms of Service shall be governed by and construed in accordance with the laws of the jurisdiction in which BookFinder operates.
                </p>
              </div>
            </div>
          )}
          
          {/* Privacy Policy */}
          {activeSection === 'privacy' && (
            <div>
              <div className="flex items-center mb-6">
                <FaUserShield className="text-primary-600 text-3xl mr-4" />
                <h2 className="text-2xl font-semibold">Privacy Policy</h2>
              </div>
              
              <div className="prose max-w-none">
                <h3>1. Information Collection</h3>
                <p>
                  BookFinder collects minimal personal information. We may collect search queries, browser information, and IP addresses to improve our service and troubleshoot issues.
                </p>
                
                <h3>2. Use of Information</h3>
                <p>
                  We use collected information to provide and improve our service, analyze usage patterns, and ensure the technical functionality of our platform.
                </p>
                
                <h3>3. Information Sharing</h3>
                <p>
                  We do not sell, trade, or otherwise transfer your personal information to outside parties except when required by law or to protect our rights.
                </p>
                
                <h3>4. Cookies and Tracking</h3>
                <p>
                  BookFinder may use cookies and similar tracking technologies to enhance user experience and collect usage information. You can configure your browser to refuse cookies, though this may limit some functionality.
                </p>
                
                <h3>5. Data Security</h3>
                <p>
                  We implement reasonable security measures to protect against unauthorized access to or unauthorized alteration, disclosure, or destruction of data.
                </p>
                
                <h3>6. Third-Party Links</h3>
                <p>
                  Our service contains links to external sites that are not operated by us. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party sites or services.
                </p>
                
                <h3>7. Changes to Privacy Policy</h3>
                <p>
                  We may update our Privacy Policy from time to time. We will notify users of any changes by posting the new Privacy Policy on this page.
                </p>
              </div>
            </div>
          )}
          
          {/* Copyright Notice */}
          {activeSection === 'copyright' && (
            <div>
              <div className="flex items-center mb-6">
                <FaCopyright className="text-primary-600 text-3xl mr-4" />
                <h2 className="text-2xl font-semibold">Copyright Notice</h2>
              </div>
              
              <div className="prose max-w-none">
                <h3>1. Respect for Intellectual Property</h3>
                <p>
                  BookFinder respects the intellectual property rights of others and expects its users to do the same. We are committed to complying with copyright laws and protecting the rights of content creators.
                </p>
                
                <h3>2. Our Position on Copyright</h3>
                <p>
                  BookFinder does not host, store, or distribute copyrighted books or other protected content. We provide information about legitimate sources where books can be found, including public domain works, library borrowing options, and authorized retailers.
                </p>
                
                <h3>3. DMCA Compliance</h3>
                <p>
                  BookFinder complies with the Digital Millennium Copyright Act (DMCA). If you believe that content linked from our service infringes your copyright, please contact us with the following information:
                </p>
                <ul>
                  <li>Identification of the copyrighted work claimed to have been infringed</li>
                  <li>Identification of the material that is claimed to be infringing</li>
                  <li>Your contact information</li>
                  <li>A statement that you have a good faith belief that use of the material is not authorized by the copyright owner</li>
                  <li>A statement that the information in the notification is accurate</li>
                </ul>
                
                <h3>4. Fair Use</h3>
                <p>
                  BookFinder respects the principle of fair use as outlined in copyright law. We believe in promoting access to knowledge and information within the boundaries of copyright law.
                </p>
                
                <h3>5. Public Domain</h3>
                <p>
                  We provide links to public domain works that are no longer protected by copyright and are freely available for use by the public. These works are an important part of our cultural heritage and should be accessible to all.
                </p>
                
                <h3>6. User Responsibility</h3>
                <p>
                  Users of BookFinder are responsible for ensuring that their use of any linked content complies with applicable copyright laws. We encourage users to respect the rights of content creators and to support authors and publishers through legal channels.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
