import { Button } from '@/components/ui/button';
import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/terms/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="mx-auto my-16 max-w-2xl text-wrap">
      <h1 className="text-2xl font-bold text-center pb-3">
        Wanderlust - Terms of Service
      </h1>
      <div className="mt-2 font-semibold">Effective Date: June 15, 2025</div>
      <p className="mt-4">
        Welcome to Wanderlust! These Terms of Service (&quot;Terms&quot;) govern
        your use of the Wanderlust application and its related services (the
        &quot;Service&quot;). By using the Service, you agree to comply with and
        be bound by these Terms. If you do not agree with these Terms, please do
        not use the Service.
      </p>
      <ol className="mt-8 space-y-4">
        <li>
          <span className="font-bold">1. Acceptance of Terms</span>: By
          accessing or using Wanderlust, you acknowledge that you have read,
          understood, and agree to be bound by these Terms. Wanderlust reserves
          the right to update, change, or modify these Terms at any time without
          prior notice. It is your responsibility to review these Terms
          periodically.
        </li>
        <li>
          <span className="font-bold">2. User Registration</span>: To access
          certain features of the Service, you must register an account. You
          agree to provide accurate, current, and complete information during
          the registration process and to update such information to keep it
          accurate, current, and complete.
        </li>
        <li>
          <span className="font-bold">3. User Responsibilities</span>:
          <ol className="ml-4">
            <li>
              <span className="font-bold">a. User Created Content</span>: Users
              are solely responsible for the accuracy, completeness, and
              legality of the content when creating public content on Wanderlust
              like public lists, revies, trips, and diary entries. Wanderlust
              reserves the right to remove any content that violates these Terms
              or is deemed inappropriate.
            </li>
            <li>
              <span className="font-bold">b. Communication</span>: Users agree
              to use the communication features within the app responsibly. Any
              communication that is harassing, offensive, or violates the rights
              of others is strictly prohibited.
            </li>
          </ol>
        </li>
        <li>
          <span className="font-bold">4. Transactions</span>:
          <ol className="ml-4">
            <li>
              <span className="font-bold">a. Joining trips</span>: Users may
              gain access to a trip upon accepting an invite from the authorized
              trip users on Wanderlust. Wanderlust does not guarantee any
              accuracy, completeness, or timeliness of the trip. Trip owner and
              users with trip editor roles are responsible for providing such
              details. Wanderlust is not responsible for any issues arising from
              joining a trip.
            </li>
          </ol>
        </li>
        <li>
          <span className="font-bold">5. Privacy Policy</span>: Your use of the
          Service is also governed by our Privacy Policy, which can be found
          <Button
            variant="link"
            asChild
            className="p-1"
          >
            <Link to="/privacy">here</Link>
          </Button>
          and is incorporated by reference into these Terms.
        </li>
        <li>
          <span className="font-bold">6. Termination</span>: Wanderlust reserves
          the right to suspend or terminate your account at any time, without
          notice, for conduct that we believe violates these Terms or is harmful
          to other users of the Service, to Wanderlust, or to third parties.
        </li>
        <li>
          <span className="font-bold">7. Disclaimers</span>: Wanderlust is
          provided &quot;as is&quot; and without any warranty or condition,
          express, implied, or statutory. We do not guarantee the availability,
          accuracy, completeness, reliability, or timeliness of the Service.
        </li>
        <li>
          <span className="font-bold">8. Limitation of Liability</span>: In no
          event shall Wanderlust be liable for any indirect, incidental,
          special, consequential, or punitive damages, or any loss of profits or
          revenues, whether incurred directly or indirectly.
        </li>
        <li>
          <span className="font-bold">9. Governing Law</span>: These Terms shall
          be governed by and construed in accordance with the laws of Turkey.
        </li>
        <li>
          <span className="font-bold">10. Contact Information</span>: For
          questions about these Terms or the Service, please contact us at
          <Button
            variant="link"
            asChild
            className="p-1"
          >
            <a href="mailto:withwanderlustapp@proton.me">
              withwanderlustapp [at] proton [dot] me
            </a>
          </Button>
        </li>
      </ol>

      <p className="mt-8">
        By using the Wanderlust, you agree to these Terms of Service. Thank you
        for being a part of our community!
      </p>
    </div>
  );
}
