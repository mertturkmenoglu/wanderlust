import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";

interface WelcomeEmailProps {
  steps?: {
    id: number;
    Description: React.ReactNode;
  }[];
  name: string;
}

const baseUrl = Bun.env["BASE_URL"];

const defaults: WelcomeEmailProps = {
  steps: [
    {
      id: 1,
      Description: (
        <li className="mb-20" key={1}>
          <strong>Discover new locations.</strong> Find unknown locations and
          discover new places to explore.{" "}
          <Link className="text-brand font-semibold">Explore locations</Link>.
        </li>
      ),
    },
    {
      id: 2,
      Description: (
        <li className="mb-20" key={2}>
          <strong>Get notifications about upcoming events</strong> Stay informed
          about events happening near you.{" "}
          <Link className="text-brand font-semibold">Explore events</Link>.
        </li>
      ),
    },
    {
      id: 3,
      Description: (
        <li className="mb-20" key={3}>
          <strong>Follow your friends</strong> Keep up with your friends'
          activities and share your own.{" "}
          <Link className="text-brand font-semibold">Find friends</Link>.
        </li>
      ),
    },
    {
      id: 4,
      Description: (
        <li className="mb-20" key={4}>
          <strong>Create travel plans</strong> Plan your next trip with friends
          and family.{" "}
          <Link className="text-brand font-semibold">Start planning</Link>.
        </li>
      ),
    },
  ],
  name: "John Doe",
};

export const WelcomeEmail = ({
  steps = defaults.steps,
  name,
}: WelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Wanderlust</Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: "#18815e",
                offwhite: "#fafbfb",
              },
              spacing: {
                0: "0px",
                20: "20px",
                45: "45px",
              },
            },
          },
        }}
      >
        <Body className="bg-offwhite text-base font-sans">
          <Img
            src={`https://raw.githubusercontent.com/mertturkmenoglu/wanderlust/main/apps/web/src/app/icon.png`}
            width="128"
            height="128"
            alt="Wanderlust"
            className="mx-auto my-20"
          />
          <Container className="bg-white p-45">
            <Heading className="text-center my-0 leading-8">
              Welcome to Wanderlust
            </Heading>

            <Section>
              <Row>
                <Text className="text-base">
                  Congratulations {name}! You're joining a community of
                  explorers and adventurers. We're excited to have you on board.
                  Wanderlust is the place to discover new locations, get
                  notifications about upcoming events, follow your friends, and
                  create travel plans.
                </Text>

                <Text className="text-base">Here's how to get started:</Text>
              </Row>
            </Section>

            <ul>{steps?.map(({ Description }) => Description)}</ul>

            <Section className="text-center">
              <Button
                className="bg-brand text-white rounded-lg py-3 px-[18px]"
                href={baseUrl}
              >
                Go to Wanderlust
              </Button>
            </Section>
          </Container>

          <Container className="mt-20">
            <Text className="text-center text-gray-400 mb-45">
              Wanderlust, 1234 Wanderlust St, Wanderlust, WL 12345, Wanderlust
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default WelcomeEmail;
