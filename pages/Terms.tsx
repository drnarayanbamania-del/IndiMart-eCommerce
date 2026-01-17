import React from 'react';
import { ScrollText, ShieldAlert, Scale } from 'lucide-react';

const Terms = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[2rem] shadow-lg p-8 md:p-12">
          
          <div className="flex items-center space-x-4 mb-8 border-b border-slate-100 pb-8">
            <div className="bg-blue-100 p-4 rounded-2xl text-blue-600">
                <ScrollText className="w-8 h-8" />
            </div>
            <div>
                <h1 className="text-3xl font-black text-slate-900 font-heading">Terms & Conditions</h1>
                <p className="text-slate-500">Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div className="space-y-8 text-slate-600 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                  1. Introduction
              </h2>
              <p>
                Welcome to Bharat E Mart. These Terms and Conditions govern your use of our website and services. By accessing or using our website, you agree to be bound by these terms. If you disagree with any part of these terms, you may not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">2. Account Registration</h2>
              <p>
                To access certain features, you may need to register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete. You are responsible for safeguarding your password and for all activities that occur under your account.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">3. Products and Pricing</h2>
              <p className="mb-4">
                We strive to display our products as accurately as possible. However, we cannot guarantee that your monitor's display of any color will be accurate.
              </p>
              <p>
                All prices are subject to change without notice. We reserve the right to modify or discontinue any product at any time. We shall not be liable to you or to any third-party for any modification, price change, suspension, or discontinuance of the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">4. Orders and Payments</h2>
              <p>
                By placing an order, you warrant that you are legally capable of entering into binding contracts. We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household, or per order.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">5. Affiliate Disclaimer</h2>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                <div className="flex">
                    <ShieldAlert className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0" />
                    <p className="text-sm text-yellow-800 font-medium">
                        Bharat E Mart participates in various affiliate marketing programs, which means we may get paid commissions on editorially chosen products purchased through our links to retailer sites. This comes at no extra cost to you.
                    </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">6. Limitation of Liability</h2>
              <p>
                In no event shall Bharat E Mart, its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">7. Governing Law</h2>
              <div className="flex items-start">
                  <Scale className="w-5 h-5 text-indigo-500 mr-3 mt-1" />
                  <p>
                    These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
                  </p>
              </div>
            </section>

            <section className="pt-8 border-t border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at: <br />
                <span className="font-bold text-indigo-600">rbskkhaniyadhana@gmail.com</span>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;