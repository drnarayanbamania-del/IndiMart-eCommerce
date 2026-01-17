import React from 'react';
import { Lock, Eye, Database, ShieldCheck } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[2rem] shadow-lg p-8 md:p-12">
          
          <div className="flex items-center space-x-4 mb-8 border-b border-slate-100 pb-8">
            <div className="bg-green-100 p-4 rounded-2xl text-green-600">
                <Lock className="w-8 h-8" />
            </div>
            <div>
                <h1 className="text-3xl font-black text-slate-900 font-heading">Privacy Policy</h1>
                <p className="text-slate-500">Effective Date: {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div className="space-y-8 text-slate-600 leading-relaxed">
            <p className="text-lg font-medium text-slate-900">
                At Bharat E Mart, accessible from our website, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Bharat E Mart and how we use it.
            </p>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                  <Database className="w-5 h-5 mr-2 text-indigo-500" /> Information We Collect
              </h2>
              <p className="mb-4">
                The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Contact information including email address and phone number.</li>
                <li>Demographic information such as postcode, preferences, and interests.</li>
                <li>Other information relevant to customer surveys and/or offers.</li>
                <li>Payment details (processed securely by third-party providers).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                  <Eye className="w-5 h-5 mr-2 text-indigo-500" /> How We Use Your Information
              </h2>
              <p>We use the information we collect in various ways, including to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Provide, operate, and maintain our website.</li>
                <li>Improve, personalize, and expand our website.</li>
                <li>Understand and analyze how you use our website.</li>
                <li>Develop new products, services, features, and functionality.</li>
                <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates.</li>
                <li>Find and prevent fraud.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Cookies and Web Beacons</h2>
              <p>
                Like any other website, Bharat E Mart uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                 <ShieldCheck className="w-5 h-5 mr-2 text-indigo-500" /> Third Party Privacy Policies
              </h2>
              <p>
                Bharat E Mart's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Data Security</h2>
              <p>
                We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.
              </p>
            </section>

            <section className="pt-8 border-t border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Contact Us</h2>
              <p>
                If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at: <br />
                <span className="font-bold text-indigo-600">rbskkhaniyadhana@gmail.com</span>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;