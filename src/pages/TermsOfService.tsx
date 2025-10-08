import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TermsOfService = () => {
  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Terms of Service
            </h1>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>1. Acceptance of Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  By accessing and using H3 Automo's services, you accept and agree to be bound by these 
                  Terms of Service. If you do not agree to these terms, please do not use our services.
                </p>
                <p>
                  These Terms apply to all users of the service, including without limitation users who are 
                  customers, service providers, and/or contributors of content.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. Description of Service</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  H3 Automo is a platform that connects drivers with verified automotive service providers. 
                  We provide a marketplace where:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Customers can find, compare, and book automotive services</li>
                  <li>Service providers can list their services and manage bookings</li>
                  <li>Both parties can communicate and complete transactions</li>
                </ul>
                <p>
                  <strong>H3 Automo acts as an intermediary platform and is not itself an automotive service provider.</strong> 
                  We do not employ service providers, own repair shops, or perform automotive services.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. User Accounts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>To use certain features of our service, you must create an account. You agree to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate, current, and complete information during registration</li>
                  <li>Maintain and promptly update your account information</li>
                  <li>Maintain the security of your password and accept all risks of unauthorized access</li>
                  <li>Notify us immediately of any unauthorized use of your account</li>
                  <li>Be responsible for all activities that occur under your account</li>
                </ul>
                <p>
                  We reserve the right to suspend or terminate accounts that violate these Terms or are 
                  inactive for extended periods.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. Customer Responsibilities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>As a customer using our platform, you agree to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate information about your vehicle and service needs</li>
                  <li>Honor confirmed bookings or cancel with appropriate notice</li>
                  <li>Communicate respectfully with service providers</li>
                  <li>Pay for services as agreed upon with the provider</li>
                  <li>Leave honest and fair reviews based on your actual experience</li>
                  <li>Not misuse the platform for fraudulent purposes</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. Service Provider Responsibilities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>Service providers who list their services on our platform agree to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Maintain all necessary licenses, insurance, and certifications</li>
                  <li>Provide accurate information about services, pricing, and availability</li>
                  <li>Deliver services professionally and competently</li>
                  <li>Honor confirmed bookings or provide adequate notice of cancellation</li>
                  <li>Comply with all applicable laws and regulations</li>
                  <li>Maintain appropriate insurance coverage</li>
                  <li>Protect customer information and respect privacy</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. Booking and Payments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  When you book a service through our platform:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You enter into a direct agreement with the service provider</li>
                  <li>H3 Automo may facilitate payment processing but is not a party to the transaction</li>
                  <li>Pricing is set by the service provider and displayed before booking</li>
                  <li>You agree to pay the quoted price plus any applicable fees or taxes</li>
                  <li>Cancellation policies are set by individual service providers</li>
                </ul>
                <p>
                  H3 Automo may charge a platform fee for using our services, which will be clearly 
                  disclosed before any transaction.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7. Reviews and Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Users may post reviews, ratings, and other content on our platform. By posting content, you:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Grant H3 Automo a non-exclusive, worldwide license to use, display, and distribute your content</li>
                  <li>Represent that your content is truthful and based on your actual experience</li>
                  <li>Agree not to post defamatory, abusive, or misleading content</li>
                  <li>Acknowledge that we may remove content that violates these Terms</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>8. Disclaimer of Warranties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  <strong>OUR SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND.</strong>
                </p>
                <p>
                  We do not guarantee:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>The quality, safety, or legality of services provided by service providers</li>
                  <li>The accuracy of service provider information or ratings</li>
                  <li>That service providers will fulfill their obligations</li>
                  <li>Uninterrupted or error-free operation of our platform</li>
                </ul>
                <p>
                  You use our platform and engage service providers at your own risk.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>9. Limitation of Liability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  To the fullest extent permitted by law, H3 Automo shall not be liable for:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Any damages resulting from services provided by service providers</li>
                  <li>Loss of data, revenue, or business opportunities</li>
                  <li>Indirect, incidental, or consequential damages</li>
                  <li>Disputes between users and service providers</li>
                </ul>
                <p>
                  Our total liability shall not exceed the fees you paid to us in the six months 
                  preceding the event giving rise to liability.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>10. Indemnification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  You agree to indemnify and hold harmless H3 Automo from any claims, damages, losses, 
                  liabilities, and expenses arising from:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Your use of our services</li>
                  <li>Your violation of these Terms</li>
                  <li>Your violation of any rights of another party</li>
                  <li>Content you post on our platform</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>11. Dispute Resolution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Any disputes arising from these Terms or your use of our services shall be resolved through:
                </p>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Good faith negotiation between the parties</li>
                  <li>Binding arbitration if negotiation fails</li>
                </ol>
                <p>
                  You agree to waive any right to a jury trial or to participate in a class action lawsuit.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>12. Changes to Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  We reserve the right to modify these Terms at any time. We will notify users of material 
                  changes via email or through our platform. Your continued use of our services after changes 
                  take effect constitutes acceptance of the new Terms.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>13. Termination</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  We may suspend or terminate your access to our services at any time for:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Violation of these Terms</li>
                  <li>Fraudulent or illegal activity</li>
                  <li>Extended period of inactivity</li>
                  <li>Any reason at our sole discretion</li>
                </ul>
                <p>
                  Upon termination, your right to use our services will immediately cease.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>14. Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  If you have questions about these Terms, please contact us at:
                </p>
                <div className="mt-4">
                  <p><strong>H3 Automo</strong></p>
                  <p>Email: legal@h3automo.com</p>
                  <p>Phone: 1-800-LOCAL-AUTO</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;