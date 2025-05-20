import { Button } from '@/components/ui/button';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/privacy/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <div className="mx-auto my-16 max-w-2xl text-wrap">
        <h1 className="text-2xl font-bold text-center pb-3">
          Wanderlust - Privacy Policy
        </h1>
        <div className="mt-2 font-semibold">Effective Date: June 13, 2024</div>
        <p className="mt-4">
          Welcome to Wanderlust! This Privacy Policy explains how Wanderlust
          ("we" or "us") collects, uses, shares, and protects information in
          relation to the Wanderlust mobile application and its services (the
          "Service"). By using the Service, you agree to the terms and practices
          outlined in this Privacy Policy.
        </p>
        <ol className="mt-8 space-y-4">
          <li>
            <span className="font-bold">1. Information We Collect</span>:
            <ol className="ml-4">
              <li>
                <span className="font-bold">a. Personal Information</span>: When
                you register an account, we may collect personal information
                such as your name, email address, and profile picture.
              </li>
              <li>
                <span className="font-bold">b. Service Information</span>: Users
                providing services may submit information about the services
                offered, including descriptions and pricing.
              </li>
              <li>
                <span className="font-bold">c. Transactional Information</span>:
                In the process of enlisting for services, transactional details,
                including payment information, may be collected.
              </li>
              <li>
                <span className="font-bold">d. Log Data</span>: We automatically
                collect certain information when you use the Service, including
                your IP address, device information, and usage patterns.
              </li>
            </ol>
          </li>
          <li>
            <span className="font-bold">2. How We Use Your Information</span>:
            <ol className="ml-4">
              <li>
                <span className="font-bold">
                  a. Providing and Improving Services
                </span>
                : We use the collected information to deliver, maintain, and
                enhance the features and functionality of the Service.
              </li>
              <li>
                <span className="font-bold">b. Communication</span>: Your
                contact information may be used to send you important notices,
                updates, or promotional materials.
              </li>
              <li>
                <span className="font-bold">c. Analytics</span>: We may use
                third-party analytics tools to understand how users interact
                with the Service, helping us improve its performance and user
                experience.
              </li>
            </ol>
          </li>
          <li>
            <span className="font-bold">3. Sharing Your Information</span>:
            <ol className="ml-4">
              <li>
                <span className="font-bold">a. Service Providers</span>: We may
                share your information with third-party service providers who
                assist us in delivering and maintaining the Service.
              </li>
              <li>
                <span className="font-bold">b. Legal Compliance</span>: We may
                disclose your information if required by law or in response to
                valid requests from public authorities.
              </li>
            </ol>
          </li>
          <li>
            <span className="font-bold">4. Your Choices and Rights</span>:
            <ol className="ml-4">
              <li>
                <span className="font-bold">a. Account Information</span>: You
                can access and update your account information through the app's
                settings.
              </li>
              <li>
                <span className="font-bold">b. Communication Preferences</span>:
                You can choose to opt-out of receiving promotional emails or
                notifications.
              </li>
            </ol>
          </li>
          <li>
            <span className="font-bold">5. Security</span>: We prioritize the
            security of your information and employ industry-standard measures
            to protect it from unauthorized access, disclosure, alteration, and
            destruction.
          </li>
          <li>
            <span className="font-bold">6. Children's Privacy</span>: The
            Service is not directed to individuals under the age of 18. If we
            become aware that personal information has been collected from a
            child under 18, we will take steps to delete such information.
          </li>
          <li>
            <span className="font-bold">7. Changes to this Privacy Policy</span>
            : We reserve the right to update or modify this Privacy Policy at
            any time. You will be notified of any significant changes via email
            or through the app.
          </li>
          <li>
            <span className="font-bold">8. Contact Information</span>: If you
            have any questions or concerns about this Privacy Policy, please
            contact us at
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
          By using Wanderlust, you consent to the practices outlined in this
          Privacy Policy.
        </p>
      </div>
    </div>
  );
}
