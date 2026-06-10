import { Shield } from 'lucide-react';

export default function TermsConditions() {
  return (
    <div className="bg-cream-white min-h-screen font-inter">
      {/* Header Hero */}
      <header className="relative bg-dark-green py-16 px-6 overflow-hidden text-center border-b border-accent-gold/20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,107,60,0.4),transparent)]"></div>
          <div className="absolute inset-0 heritage-ornament opacity-10"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 bg-accent-gold/25 text-accent-gold border border-accent-gold/30 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
            Legal Agreement
          </div>
          <h1 className="text-pure-white text-3xl sm:text-4xl md:text-5xl font-playfair font-bold mb-4">
            Terms & Conditions
          </h1>
          <p className="text-pure-white/70 text-sm sm:text-base font-light max-w-xl mx-auto">
            Please read these Terms of Use carefully before using our platform.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-16 px-6 max-w-4xl mx-auto">
        <div className="bg-pure-white p-8 sm:p-12 rounded-xl border border-light-grey shadow-sm text-gray-700 leading-relaxed font-light space-y-8">
          
          <div className="flex items-center gap-3 pb-6 border-b border-gray-100">
            <div className="w-10 h-10 rounded-lg bg-accent-gold/10 text-accent-gold flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-medium-grey font-bold uppercase tracking-wider">Last Updated: June 2026</p>
              <h2 className="text-xl font-bold text-dark-green font-playfair">Greenpreneur Terms of Use</h2>
            </div>
          </div>

          {/* Section: Introduction */}
          <section className="space-y-3">
            <h3 className="text-lg font-bold text-dark-green font-playfair">1. Introduction</h3>
            <p>
              Greenpreneur.in (a unit of Aequitas Information Technology Pvt Ltd.) ("Greenpreneur.in", "us", "we" or "our") provides an in-depth, incisive, and actionable expertise through a group of distinguished men and women from across the globe, to add value to your business (more particularly set out in Clause 2 (Use of Website) ("Content"). Greenpreneur.in’s Global Leadership Committee strives to get the latest and most filtered leadership knowledge from the world with a single objective to keep you ahead of the curve.
            </p>
            <p>
              By accessing the website at <a href="https://www.Greenpreneur.in" className="text-primary hover:underline">www.Greenpreneur.in</a> ("Website") or by otherwise accessing any content found on the Website, you ("you" or "your" or "user") are entering into an agreement with Greenpreneur.in and agree to the terms that follow (the "Terms of Use"), whether or not you have registered with the Website. The Website is owned and operated by [Greenpreneur.in].
            </p>
            <p>
              Please read these Terms of Use before accessing or using the Website or Content or downloading any content from the Website, as they contain important information regarding your legal rights, remedies and obligations.
            </p>
            <p className="font-semibold text-dark-green">
              A verifiable parental consent is required for you to create a membership account, if you are under the age of [18], or from the European Union.
            </p>
            <p>
              We may revise these Terms of Use from time to time, so please check this web page each time you visit the Website. If you continue to use the Website after we post the revised Terms of Use, it shall mean you have agreed to the new terms.
            </p>
            <p>
              Please review our Privacy Policy to learn more about how we use any information provided by you.
            </p>
            <p>
              If you do not agree to these Terms of Use, please do not complete the registration process and/or use the Website.
            </p>
          </section>

          {/* Section: Use of Website */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold text-dark-green font-playfair">2. Use of Website</h3>
            <p>
              The Website can be used to facilitate entrepreneurs, professionals and young leaders to subscribe for the following Content:
            </p>

            <div className="space-y-3 pl-4 border-l-2 border-accent-gold/30">
              <h4 className="font-bold text-dark-green text-sm uppercase tracking-wider">Meetings & Network Building</h4>
              <p className="text-sm">Meeting with a bunch of members & strangers to talk business.</p>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>1st Week – Virtual Meet with Local + National Members + Industry Leaders.</li>
                <li>3rd Week – In Person Business Workshop & Networking with Local + National Members + Industry Leaders + Visitors.</li>
                <li>Local Annual Conference & Awards, one-of-a-kind city networking events built around learning and engagement.</li>
                <li>Random Meets & Programs for the members.</li>
                <li>Random Virtual or In Person Trainings & Webinars.</li>
              </ul>
            </div>

            <div className="space-y-3 pl-4 border-l-2 border-accent-gold/30">
              <h4 className="font-bold text-dark-green text-sm uppercase tracking-wider">Media Exposure</h4>
              <p className="text-sm">Build your personal & business brand through media exposure.</p>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>Greenpreneur.in offers members the opportunity to establish yourself as an inspirational leader by featuring your own journey on Greenpreneur.in, Video Interview on Vyapaar Jagat TV and publishing authored knowledge articles on Greenpreneur.in.</li>
                <li>Get Business listed on Vyapaar Jagat Directory for lifetime (Unique virtual space to showcase your product and services).</li>
                <li>Increase authority and credibility, making a difference in the lives of others.</li>
                <li>Becoming better-known, well-known, or famous.</li>
                <li>Develop lasting relationships with your target audience.</li>
                <li>Builds authority, Great PR, and positive exposure for your business.</li>
                <li>Gain broad international recognition and significant market visibility.</li>
              </ul>
            </div>

            <div className="space-y-3 pl-4 border-l-2 border-accent-gold/30">
              <h4 className="font-bold text-dark-green text-sm uppercase tracking-wider">Forums & Advisory Board</h4>
              <p className="text-sm">Provides a safe forum for working out issues and exploring opportunities.</p>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>A community fellowship that fuels your entrepreneurial journey & helps you to realize "Sky is the limit".</li>
                <li>A Community that surrounds you on your Entrepreneurial Journey and works for you as a board of advisors.</li>
                <li>A community who think critically in your difficult situations and arrive at smarter decisions for your growth.</li>
                <li>Available to you during your entire journey, whether the journey is smooth or challenging at any point of time.</li>
                <li>Life-enhancing connections, shared experiences and collaborative learning.</li>
                <li>A group of Entrepreneurs & Decision makers, where you can be vulnerable & applauded.</li>
                <li>Members & experts inspire new perspectives, enabling massive results.</li>
              </ul>
            </div>

            <div className="space-y-3 pl-4 border-l-2 border-accent-gold/30">
              <h4 className="font-bold text-dark-green text-sm uppercase tracking-wider">Business Power Teams</h4>
              <p className="text-sm">A Power Team is a group of individuals who have actively committed to generate business for each other.</p>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>A Power Team is a group of related professions that work with the same clients but do not take business away from each other.</li>
                <li>A Contact Sphere is a group of symbiotic professions who have a good opportunity to provide referrals to each other.</li>
                <li>Meet with your Power Team regularly, or at minimum every other week.</li>
                <li>Consist of 8-18 business leaders from non-competing categories with common target customer bases.</li>
                <li>The Power Team can arrange industry visits and power meetings by inviting industry leaders or meeting clients in groups.</li>
              </ul>
            </div>

            <div className="space-y-3 pl-4 border-l-2 border-accent-gold/30">
              <h4 className="font-bold text-dark-green text-sm uppercase tracking-wider">Access to Global Network</h4>
              <p className="text-sm">Connect.Greenpreneur.in is a social media platform for Greenpreneur.in Leaders to establish new relations.</p>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>Our members have exclusive access to like-minded leaders across the globe.</li>
                <li>Opportunity to collaborate, learn, and grow your network.</li>
                <li>Engage with other executives in our networks to share experience and gain confidence.</li>
                <li>Receive personalized connections to your inbox; connect on your own time.</li>
                <li>Access to global thought leaders, best practices, and trends shaping business through intimate sessions.</li>
              </ul>
            </div>

            <div className="space-y-3 pl-4 border-l-2 border-accent-gold/30">
              <h4 className="font-bold text-dark-green text-sm uppercase tracking-wider">Events</h4>
              <p className="text-sm">Summits, intimate workshops, and business tours.</p>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>Local Annual Conference & Awards, one-of-a-kind city networking events.</li>
                <li>Vyapaar Jagat Convention & Awards, StartUp Mela, Greenpreneur Convention & Awards and Fempreneur Conference & Awards.</li>
                <li>Renowned speakers and provocative learning programs held throughout the year.</li>
                <li>Opportunity to become a speaker in Greenpreneur.in events.</li>
              </ul>
            </div>

            <div className="space-y-3 pl-4 border-l-2 border-accent-gold/30">
              <h4 className="font-bold text-dark-green text-sm uppercase tracking-wider">Recognition</h4>
              <p className="text-sm">India’s first rated awards which has a three-stage process.</p>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>Award assessment: 75% through Jury assessment & 25% through Public Votes.</li>
                <li>Nominee gets personalized creative & voting link for promoting on social media.</li>
                <li>Online branding with a reach of millions of impressions.</li>
                <li>Entry to attend the Offline Award felicitation ceremony.</li>
                <li>Branding on all of our external media partnerships (print, TV, and digital).</li>
                <li>Right to use the Vyapaar Jagat Award badge/seal.</li>
              </ul>
            </div>

            <p>
              You may view the upcoming Content as an unregistered visitor to the Website; however, if you wish to access the Content, you must first create a membership account [Promotional members data or media content will be accessible publicly].
            </p>
            <p>
              Greenpreneur.in makes available an online platform which provides Content for entrepreneurs, professionals and young leaders. Greenpreneur.in’s responsibilities are limited to providing the Content through the Website, unless expressly specified otherwise on the Website.
            </p>
            <p>
              The Platform provides easily accessible content, connections and communications that power brand and business objectives generated, developed or produced by the Company or aggregated, obtained and/or licensed through third party sources.
            </p>
            <p>
              We are committed to promptly and efficiently responding to your queries or issues relating to your Account and the services availed through the Platform.
            </p>
          </section>

          {/* Section: Membership Account */}
          <section className="space-y-3">
            <h3 className="text-lg font-bold text-dark-green font-playfair">3. Membership Account</h3>
            <p>
              In order to access the Content displayed on the Website, you will have to create a membership account with Greenpreneur.in. Greenpreneur.in does not provide any Content directly, it only acts as a platform through which the Content is displayed, [and the transaction for each account will take place through the respective brand site].
            </p>
            <p>
              You represent, warrant and covenant that, information and content provided by you, including, but not limited to, information during creating a membership account on the Website:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>is owned by you, and that you otherwise have all necessary rights to such content and the rights to use it as per these Terms of Use;</li>
              <li>is true, accurate, current, complete, and not misleading, and does not violate these Terms of Use; and shall not cause injury to any other person.</li>
            </ul>
            <p>
              You agree not to use another user’s membership account nor provide access to your membership account to any third party. Further, you agree to keep your account password secure and that you shall be responsible for any activity that may occur on your membership account.
            </p>
            <p>
              You shall not disclose and shall maintain in strict confidence your Website login ID and credentials. If you know or suspect that someone else knows your Website login ID, you should notify us by contacting <a href="mailto:hello@Greenpreneur.in" className="text-primary hover:underline">hello@Greenpreneur.in</a> immediately, failing which Greenpreneur.in may temporarily suspend your membership account. Greenpreneur.in shall not be held liable for any loss that may occur due to the unauthorized access by any person with your credentials.
            </p>
          </section>

          {/* Section: Restrictions */}
          <section className="space-y-3">
            <h3 className="text-lg font-bold text-dark-green font-playfair">4. Restrictions on use of Website</h3>
            <p>
              You are granted permission to access and use the Website and Content displayed on the Website as set out in these Terms of Use, provided that:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>You agree not to distribute any part or Content of the Website without Greenpreneur.in’s prior written consent.</li>
              <li>You agree not to use the Content displayed on the Website for any commercial purposes unless you obtain prior written approval. Further, Committee Members shall not use the content created with Greenpreneur.in without prior written consent.</li>
              <li>You agree not to use or launch any automated system, including without limitation, "robots," "spiders," or "offline readers," that accesses the Website in a manner that sends more request messages to our servers in a given period of time than a human can reasonably produce.</li>
              <li>In your use of the Website, you will at all times comply with all applicable laws and regulations.</li>
            </ul>
          </section>

          {/* Section: Payment Terms */}
          <section className="space-y-3">
            <h3 className="text-lg font-bold text-dark-green font-playfair">5. Payment Terms</h3>
            <p>
              The information relating to the accepted payment methods on the Platform shall be displayed during the purchasing process.
            </p>
            <p>
              To the extent permitted by applicable law and subject to the Privacy Policy, you acknowledge and agree that the Company may use certain third-party vendors and service providers, including payment gateways, to process payments and manage payment card information.
            </p>
            <p>
              In order to avail the Services, you undertake to use and provide valid bank details or other details required for facilitating payment towards the Services ("Payment Details"). By providing the Payment Details, you represent, warrant, and covenant that: (1) you are legally authorized to provide such Payment Details; (2) you are legally authorized to perform payments using such Payment Details; and (3) such action does not violate the terms and conditions applicable to your use of such details or applicable law.
            </p>
            <p>
              Except to the extent otherwise required by applicable law, the Company is not liable for any payments authorized through the Platform using your Payment Details. Particularly, the Company is not liable for any payments that do not complete because of insufficient funds, incorrect details, expired cards, or circumstances beyond our control.
            </p>
          </section>

          {/* Section: Subscription fees */}
          <section className="space-y-3">
            <h3 className="text-lg font-bold text-dark-green font-playfair">6. Subscription Fees</h3>
            <p>
              The subscription fees of each of the Services shall be displayed on the Platform. The prices mentioned at the time of subscribing the Service shall be the price charged at the time of providing the Service. All the Services listed on the Platform will be available for subscription in Indian Rupees. The subscription fees for the Services may be modified from time to time.
            </p>
            <p>
              The Users will be informed about any additional charges, fees, and costs if any that may be levied on the subscription for the Services on the Platform at the checkout page during a transaction.
            </p>
          </section>

          {/* Section: Refunds and Cancellations */}
          <section className="space-y-3">
            <h3 className="text-lg font-bold text-dark-green font-playfair">7. Refunds and Cancellations</h3>
            <p>
              <strong>Refunds:</strong> The policy for refund of monies with respect to cancellation of subscription or for any other purpose, shall be communicated to the User, from time to time, through the Terms, or push notifications on the Platform. Amount once paid for attending an event, sponsoring an event, nomination for an award, exhibiting product/service, new or renewal of membership will not be refunded in any circumstances.
            </p>
            <p>
              <strong>Cancellations:</strong> You may cancel a subscription without charge at any time before the Company accepts the subscription. The cancellation policy including with respect to cancellation fees shall be communicated to the User from time to time. No payment will be refunded on cancellation of an accepted subscription.
            </p>
          </section>

          {/* Section: Intellectual Property */}
          <section className="space-y-3">
            <h3 className="text-lg font-bold text-dark-green font-playfair">8. Intellectual Property</h3>
            <p>
              You agree and acknowledge that all information and Content displayed on, transmitted through, or used in connection with the Website, including reviews, directories, guides, text, photographs, images, illustrations, audio clips, video, html source and object code, trademarks, logos, and the like ("IP Content"), belongs and remains the property of Greenpreneur.in.
            </p>
            <p>
              You may not republish any portion of the IP Content on any internet, intranet or extranet site or incorporate the IP Content in any database, compilation, archive or cache. You may not distribute any IP Content to others, whether or not for payment or other consideration, and you may not scrape, modify, copy, frame, cache, reproduce, sell, publish, transmit, display or otherwise use any portion of the IP Content.
            </p>
          </section>

          {/* Section: Governing Law */}
          <section className="space-y-3">
            <h3 className="text-lg font-bold text-dark-green font-playfair">9. Governing Law and Jurisdiction</h3>
            <p>
              These Terms of Use shall be governed by and construed in accordance with the laws of India.
            </p>
            <p>
              All disputes arising out of these Terms of Use shall be subject to the exclusive jurisdiction of the courts in <strong>Ahmedabad, Gujarat, India</strong>.
            </p>
          </section>

          <p className="text-xs text-medium-grey border-t border-gray-100 pt-6">
            For any questions or formal complaints, please reach out to us at <a href="mailto:hello@greenpreneur.in" className="text-primary hover:underline font-semibold">hello@greenpreneur.in</a>.
          </p>
        </div>
      </main>
    </div>
  );
}
