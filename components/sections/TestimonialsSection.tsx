import { Container } from "@/components/common/Container";
import { Section } from "@/components/common/Section";
import { SectionHeader } from "@/components/common/SectionHeader";
import { TestimonialCard } from "@/components/common/TestimonialCard";
import { Grid } from "@/components/common/Grid";

const testimonials = [
  {
    name: "Dr. Amara Mensah",
    role: "Chief Technology Officer",
    company: "Pan-African Financial Group",
    content: "Ghamkheti Guru transformed our entire digital infrastructure. Their depth of expertise and commitment to delivery timelines is unmatched. We saw a 40% improvement in operational efficiency within six months.",
    rating: 5,
  },
  {
    name: "Sarah Okonkwo",
    role: "Director of Operations",
    company: "Horizon Healthcare Systems",
    content: "Working with Ghamkheti Guru was the best decision we made. They delivered a world-class patient management system and ensured our team was fully trained and confident from day one.",
    rating: 5,
  },
  {
    name: "James Kariuki",
    role: "Chief Executive Officer",
    company: "Savannah AgriTech",
    content: "From strategy to execution, the team exceeded every expectation. Their consulting methodology is rigorous yet practical, and the solar-agri integration they designed has already paid back its investment.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <Section variant="surface" id="testimonials">
      <Container>
        <SectionHeader
          badge="Client Stories"
          title="Trusted by Industry Leaders"
          titleGradient
          description="Hear from the organisations that have partnered with us to achieve extraordinary results."
        />
        <Grid cols={1} colsMd={3} gap="default">
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.name} {...t} index={i} />
          ))}
        </Grid>
      </Container>
    </Section>
  );
}
