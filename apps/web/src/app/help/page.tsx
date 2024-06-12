import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { faqData } from "@/app/help/data"

export default function Page() {

  return (
    <>
      <div className="flex flex-col justify-center items-center mt-16">
        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">{faqData.title}</h2>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">{faqData.subtitle}</h3>
      </div>
      <div className="max-w-xl mx-auto my-16">
        {faqData.groups.map((group) => (
          <div key={group.title}>
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight mt-8">{group.title}</h4>
            <Accordion type="single" collapsible className="w-full">
              {group.items.map((item) => (
                <AccordionItem value={item.question} key={item.question}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
      </div>
    </>
  );
}
