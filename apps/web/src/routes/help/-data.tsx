import { Button } from '@/components/ui/button';

type FAQ = {
  title: string;
  subtitle: string;
  groups: FAQGroup[];
};

type FAQGroup = {
  title: string;
  items: FAQItem[];
};

type FAQItem = {
  question: string;
  answer: React.ReactNode;
};

export const faqData: FAQ = {
  title: 'Help Center',
  subtitle: 'How can we help you?',
  groups: [
    {
      title: 'General Questions',
      items: [
        {
          question: 'What is Wanderlust?',
          answer: (
            <div>
              Wanderlust is a platform for travelers to explore location
              information, discover upcoming events, share ratings and reviews,
              connect with friends, add locations to a personal diary, plan
              trips, and make lasting memories.
            </div>
          ),
        },
        {
          question: 'How do I sign up for Wanderlust?',
          answer: (
            <div>
              To sign up, visit Wanderlust website and follow the on-screen
              instructions to create a new account using your email address or
              social media login.
            </div>
          ),
        },
      ],
    },
    {
      title: 'Using Wanderlust',
      items: [
        {
          question: 'How can I find information about a specific location?',
          answer: (
            <div>
              Use the search bar at the top of the home screen to enter the name
              of the location you&apos;re interested in. You&apos;ll see
              detailed information including reviews, ratings, upcoming events,
              and more.
            </div>
          ),
        },
        {
          question: 'How do I add a location to my diary?',
          answer: (
            <div>
              To add a location to your diary, navigate to the location&apos;s
              page and tap the &quot;Add to Diary&quot; button. You can also add
              notes and photos to make it more personal.
            </div>
          ),
        },
        {
          question: 'Can I plan a trip using Wanderlust?',
          answer: (
            <div>
              Yes, you can plan trips by selecting multiple locations and
              events, adding them to your trip itinerary, and setting dates for
              each activity. Go to the &quot;Plan a Trip&quot; section to get
              started.
            </div>
          ),
        },
      ],
    },
    {
      title: 'Social Features',
      items: [
        {
          question: 'How do I connect with my friends on Wanderlust?',
          answer: (
            <div>
              To connect with friends, go to the &quot;Friends&quot; tab and
              search for their usernames. You can send a friend request, and
              once accepted, you&apos;ll be able to see each other&apos;s
              activity and share your experiences.
            </div>
          ),
        },
        {
          question: "How can I see my friends' reviews and ratings?",
          answer: (
            <div>
              You can view your friends&apos; reviews and ratings by visiting
              their profiles.
            </div>
          ),
        },
      ],
    },
    {
      title: 'Reviews and Ratings',
      items: [
        {
          question: 'How do I leave a review for a location?',
          answer: (
            <div>
              To leave a review, navigate to the location&apos;s page and scroll
              down to the &quot;Reviews&quot; section. Tap &quot;Write a
              Review,&quot; enter your comments, rate the location, and submit
              your review.
            </div>
          ),
        },
        {
          question: 'Can I edit or delete my review?',
          answer: (
            <div>
              Yes, you can delete your review by going to your profile,
              selecting the review, and choosing the &quot;Delete&quot; option.
              Currently, you cannot edit your review.
            </div>
          ),
        },
      ],
    },
    {
      title: 'Events',
      items: [
        {
          question: 'How do I find upcoming events in a specific location?',
          answer: (
            <div>
              To find upcoming events, go to the events page. You can also use
              the &quot;Search&quot; functionality to see a list of all upcoming
              events in various locations.
            </div>
          ),
        },
        {
          question: 'Can I create an event on Wanderlust?',
          answer: (
            <div>
              Currently, only verified organizers can create events. If you are
              an event organizer and want to list an event on Wanderlust, please
              contact our support team for verification.
            </div>
          ),
        },
      ],
    },
    {
      title: 'Technical Support',
      items: [
        {
          question: 'What should I do if I encounter a problem with the app?',
          answer: (
            <div>
              If you experience any issues with the app, please visit the
              &quot;Help & Support&quot; section in the app or contact our
              support team directly via email at{' '}
              <Button
                variant="link"
                asChild
                className="px-0"
              >
                <a href="mailto:withwanderlustapp@proton.me">
                  withwanderlustapp [at] proton [dot] me
                </a>
              </Button>
            </div>
          ),
        },
        {
          question: ' How can I report inappropriate content or behavior?',
          answer: (
            <div>
              To report inappropriate content or behavior, tap the
              &quot;Report&quot; button found on the relevant page or profile.
              Provide as much detail as possible, and our team will review the
              report promptly.
            </div>
          ),
        },
      ],
    },
    {
      title: 'Account Management',
      items: [
        {
          question: 'How do I reset my password?',
          answer: (
            <div>
              To reset your password, go to the login screen and tap
              &quot;Forgot Password.&quot; Follow the instructions to receive a
              password reset link via email.
            </div>
          ),
        },
        {
          question: 'How can I delete my account?',
          answer: (
            <div>
              If you wish to delete your account, contact our team via email at{' '}
              <Button
                variant="link"
                asChild
                className="px-0"
              >
                <a href="mailto:withwanderlustapp@proton.me">
                  withwanderlustapp [at] proton [dot] me
                </a>
              </Button>
              . Please note that this action is irreversible and all your data
              will be permanently deleted.
            </div>
          ),
        },
      ],
    },
    {
      title: 'Privacy and Security',
      items: [
        {
          question: 'How is my personal information protected?',
          answer: (
            <div>
              We take your privacy seriously and use advanced security measures
              to protect your data. For more details, please read our Privacy
              Policy available on our website.
            </div>
          ),
        },
        {
          question: 'Can I control who sees my activity and diary entries?',
          answer: (
            <div>
              Yes, you can adjust your privacy settings in the
              &quot;Settings&quot; section of your profile to control who can
              see your activity, diary entries, and other personal information.
            </div>
          ),
        },
      ],
    },
  ],
};
