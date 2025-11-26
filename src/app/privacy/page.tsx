import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-headline">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-lg dark:prose-invert max-w-none">
          <h2>Your Secrets are Safe with Hamraz</h2>
          <p>
            At Hamraz AI, we are committed to protecting your privacy and ensuring that your personal information is handled in a safe and responsible manner. This Privacy Policy outlines how we collect, use, and protect your information.
          </p>
          <h3>1. Information We Collect</h3>
          <p>
            We collect information to provide and improve our services. This includes:
          </p>
          <ul>
            <li><strong>Account Information:</strong> When you create an account, we may ask for information such as your username and avatar preference.</li>
            <li><strong>Conversation Data:</strong> Your conversations with Hamraz are processed to provide responses but are not stored long-term in an identifiable way. We are committed to ensuring these conversations remain private.</li>
            <li><strong>Usage Data:</strong> We collect data on how you interact with our app, such as features used and points earned, to improve user experience.</li>
          </ul>
          <h3>2. How We Use Your Information</h3>
          <p>
            We use the information we collect to:
          </p>
          <ul>
            <li>Personalize your experience with custom lessons and AI interactions.</li>
            <li>Operate and maintain the Hamraz AI services.</li>
            <li>Improve our application and develop new features.</li>
            <li>Ensure the safety and security of our community.</li>
          </ul>
           <h3>3. Data Security</h3>
          <p>
            We implement a variety of security measures to maintain the safety of your personal information. Your conversations are treated with the utmost confidentiality. We do not share your personal conversation data with third parties.
          </p>
          <h3>4. Age Restrictions</h3>
          <p>
            Our services are available for users aged 12 and older. We have strict policies against inappropriate content and prohibit conversations of an 18+ nature to ensure a safe environment for all users.
          </p>
           <h3>5. Changes to This Policy</h3>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
          </p>
          <p>
            If you have any questions about this Privacy Policy, please contact us.
          </p>
          <p className="text-sm text-muted-foreground">Last updated: [Current Date]</p>
        </CardContent>
      </Card>
    </div>
  );
}
