
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, Vote } from "lucide-react";

const boardMembers = [
  {
    name: "Dr. Layla Khatib",
    title: "AI Ethics Advisor",
    bio: "Dr. Khatib is a leading researcher in AI ethics, ensuring Hamraz develops responsibly and aligns with human values. Her work focuses on fairness and transparency in AI systems.",
    imageUrl: "https://picsum.photos/seed/board1/200/200",
    imageHint: "female professional"
  },
  {
    name: "Mr. Kian Parsa",
    title: "Linguistics & Pedagogy Expert",
    bio: "With decades of experience in language education, Mr. Parsa guides the pedagogical approach of our AI tutor, making learning effective and engaging for all ages.",
    imageUrl: "https://picsum.photos/seed/board2/200/200",
    imageHint: "male professional"
  },
  {
    name: "Ms. Shirin Alavi",
    title: "Community & Child Safety Advocate",
    bio: "Ms. Alavi is a passionate advocate for online child safety. She helps shape our community guidelines and safety policies to create a secure environment for our younger users.",
    imageUrl: "https://picsum.photos/seed/board3/200/200",
    imageHint: "woman smiling"
  },
   {
    name: "Dr. Arash Farahani",
    title: "Technology & Innovation Lead",
    bio: "A veteran in software architecture, Dr. Farahani provides strategic guidance on our technology stack, ensuring Hamraz is scalable, secure, and future-proof.",
    imageUrl: "https://picsum.photos/seed/board4/200/200",
    imageHint: "man technology"
  },
  {
    name: "Dr. Anahita Shams",
    title: "Cognitive Psychology & Neuroscience Advisor",
    bio: "Dr. Shams' research into human emotion and cognition is foundational to developing Hamraz's adaptive emotional intelligence, enabling true empathy in conversation.",
    imageUrl: "https://picsum.photos/seed/board5/200/200",
    imageHint: "female scientist"
  },
  {
    name: "Mr. Ramin Vossoughi",
    title: "Charismatic Communication & Persuasion Specialist",
    bio: "An expert in neurolinguistics, Mr. Vossoughi trains Hamraz to communicate with a tone and style that builds trust, inspires action, and creates a genuine connection.",
    imageUrl: "https://picsum.photos/seed/board6/200/200",
    imageHint: "male speaker"
  },
];


export default function BoardPage() {
  return (
    <div className="space-y-12">
       <div>
        <h1 className="text-3xl font-bold font-headline mb-2">Honorary Board of Directors</h1>
        <p className="text-muted-foreground max-w-3xl">Meet the experts and community leaders guiding our mission. Our board includes representatives from top apps built on Hamraz, giving them voting and advisory rights in our future direction.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {boardMembers.map((member) => (
          <Card key={member.name} className="shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="items-center text-center">
                <Avatar className="w-28 h-28 border-4 border-muted">
                    <AvatarImage src={member.imageUrl} alt={member.name} data-ai-hint={member.imageHint} />
                    <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="pt-4">
                    <CardTitle className="text-xl">{member.name}</CardTitle>
                    <CardDescription className="text-primary font-semibold">{member.title}</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">{member.bio}</p>
            </CardContent>
          </Card>
        ))}
      </div>

       <div className="space-y-6">
        <h2 className="text-3xl font-bold font-headline mb-2 flex items-center gap-3"><Users className="w-8 h-8 text-accent"/> Community Policy Council</h2>
        <p className="text-muted-foreground max-w-3xl">
            In Hamraz, power is shared. We believe the most invested citizens should have a direct role in shaping the city's future. This council ensures that the community's voice is not just heard, but is a deciding factor in our governance.
        </p>
         <Card className="bg-accent/10 border-accent/20">
            <CardHeader className="flex flex-row items-center gap-4">
                <Vote className="w-10 h-10 text-accent"/>
                <div>
                    <CardTitle className="text-xl font-bold text-accent-foreground">A Seat at the Table</CardTitle>
                    <CardDescription>The top 3 land purchasers each month will automatically be granted a seat on the Capable City's Policy Council.</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li><strong>Voting Rights:</strong> Council members gain the right to vote on key strategic decisions, future feature implementations, and community policies.</li>
                    <li><strong>Direct Influence:</strong> This is a real opportunity to influence the direction and evolution of the Hamraz ecosystem.</li>
                    <li><strong>Dynamic Governance:</strong> New members join monthly, ensuring the council remains fresh, active, and representative of the most engaged citizens.</li>
                </ul>
            </CardContent>
        </Card>
      </div>

    </div>
  );
}
