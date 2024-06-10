import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

export const ReportCreatedEmail = () => {
  return (
    <Html>
      <Head />
      <Preview>We have received your report!</Preview>
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
              Thanks for your report!
            </Heading>

            <Section>
              <Row>
                <Text className="text-base">
                  We have receieved your report and will review it shortly. You
                  will get updates about the status of your report via email.
                  Thank you for helping us keep Wanderlust a safe and fun place.
                </Text>
              </Row>
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
