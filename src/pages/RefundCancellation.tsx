import { RefreshCw } from 'lucide-react';

export default function RefundCancellation() {
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
            Transaction Policy
          </div>
          <h1 className="text-pure-white text-3xl sm:text-4xl md:text-5xl font-playfair font-bold mb-4">
            Refund & Cancellation Policy
          </h1>
          <p className="text-pure-white/70 text-sm sm:text-base font-light max-w-xl mx-auto">
            Please review our transaction terms regarding event tickets, awards, memberships, and sponsorships.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-16 px-6 max-w-4xl mx-auto">
        <div className="bg-pure-white p-8 sm:p-12 rounded-xl border border-light-grey shadow-sm text-gray-700 leading-relaxed font-light space-y-8">
          
          <div className="flex items-center gap-3 pb-6 border-b border-gray-100">
            <div className="w-10 h-10 rounded-lg bg-accent-gold/10 text-accent-gold flex items-center justify-center shrink-0">
              <RefreshCw className="w-5 h-5 animate-[spin_8s_linear_infinite]" />
            </div>
            <div>
              <p className="text-xs text-medium-grey font-bold uppercase tracking-wider">Last Updated: June 2027</p>
              <h2 className="text-xl font-bold text-dark-green font-playfair">Refunds & Cancellations</h2>
            </div>
          </div>

          {/* Refund Policy */}
          <section className="space-y-4">
            <div className="bg-red-50/50 border border-red-200/50 p-6 rounded-xl space-y-2">
              <h3 className="text-base font-bold text-red-800 uppercase tracking-wider flex items-center gap-2">
                ⚠️ Refund Policy
              </h3>
              <p className="text-gray-700 font-medium text-sm leading-relaxed">
                Amount once paid for attending an event, sponsoring an event, nomination for an award, exhibiting product/service, new or renewal of membership will not be refunded in any circumstances.
              </p>
            </div>
            <p className="text-sm">
              Greenpreneur operates Section 8 NGO (1 Million Entrepreneurs International Forum) events and services that require upfront scheduling, venue bookings, and branding layout allocations. Therefore, we maintain a strict **no-refund policy** once a payment has successfully cleared.
            </p>
          </section>

          {/* Cancellation Policy */}
          <section className="space-y-4 border-t border-gray-100 pt-6">
            <div className="bg-amber-50/50 border border-amber-200/50 p-6 rounded-xl space-y-2">
              <h3 className="text-base font-bold text-amber-800 uppercase tracking-wider flex items-center gap-2">
                ⚙️ Cancellation Policy
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                You may cancel a subscription without charge at any time before the Company accepts the subscription. No payment will be refunded on cancellation of an accepted subscription.
              </p>
            </div>
            <p className="text-sm">
              If you submit a membership or listing subscription request and decide to cancel, please notify us immediately at <a href="mailto:hello@greenpreneur.in" className="text-primary hover:underline font-semibold">hello@greenpreneur.in</a>. If the request has not yet been processed and accepted by our team, we will cancel the request. Once accepted and processed, cancellations will not be eligible for refunds.
            </p>
          </section>

          {/* Specific Services Info */}
          <section className="space-y-3 border-t border-gray-100 pt-6">
            <h3 className="text-lg font-bold text-dark-green font-playfair">Special Conditions</h3>
            <ul className="list-disc pl-5 text-sm space-y-2">
              <li>
                <strong>Event Tickets:</strong> If you are unable to attend the offline conclave, your pass may be transferred to another individual from your company, provided you request this transfer at least 7 days before the event.
              </li>
              <li>
                <strong>Award Nominations:</strong> Fee paid for the Rated Award challenge covers processing, social media layout creations, and link setups. It is not dependent on the final outcome of the award.
              </li>
              <li>
                <strong>Sponsorships:</strong> Once a sponsor slot is committed, marketing preparations begin immediately, and other competitors are turned down for that specific slot. No cancellations are permitted for sponsorships.
              </li>
            </ul>
          </section>

          <p className="text-xs text-medium-grey border-t border-gray-100 pt-6">
            If you have any questions regarding your transaction or wish to request a pass transfer, please contact our secretariat at <a href="mailto:hello@greenpreneur.in" className="text-primary hover:underline font-semibold">hello@greenpreneur.in</a>.
          </p>
        </div>
      </main>
    </div>
  );
}
