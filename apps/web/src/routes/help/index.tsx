import { createFileRoute } from '@tanstack/react-router';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@wanderlust/ui/components/accordion';
import { faqData } from './-data';

export const Route = createFileRoute('/help/')({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<div className="mt-16 flex flex-col items-center justify-center">
				<h2 className="scroll-m-20 pb-2 font-semibold text-3xl tracking-tight first:mt-0">
					{faqData.title}
				</h2>
				<h3 className="scroll-m-20 font-semibold text-2xl tracking-tight">
					{faqData.subtitle}
				</h3>
			</div>
			<div className="mx-auto my-16 max-w-xl">
				{faqData.groups.map((group) => (
					<div key={group.title}>
						<h4
							id={encodeURI(group.title)}
							className="mt-8 scroll-m-20 font-semibold text-xl tracking-tight"
						>
							{group.title}
						</h4>
						<Accordion type="single" collapsible className="w-full">
							{group.items.map((item) => (
								<AccordionItem value={item.question} key={item.question}>
									<AccordionTrigger>{item.question}</AccordionTrigger>
									<AccordionContent>{item.answer}</AccordionContent>
								</AccordionItem>
							))}
						</Accordion>
					</div>
				))}
			</div>
		</>
	);
}
