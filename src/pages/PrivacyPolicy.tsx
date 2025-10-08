import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PrivacyPolicy = () => {
  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>1. Information We Collect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  At H3 Automo, we collect information that you provide directly to us when you:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Create an account and set up your profile</li>
                  <li>Book automotive services through our platform</li>
                  <li>Communicate with us via email, phone, or chat</li>
                  <li>Subscribe to our newsletter or marketing communications</li>
                  <li>Participate in surveys, contests, or promotional activities</li>
                </ul>
                <p>
                  This information may include your name, email address, phone number, vehicle information, 
                  location data, payment information, and any other information you choose to provide.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. How We Use Your Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>We use the information we collect to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process and complete transactions and send related information</li>
                  <li>Send you technical notices, updates, security alerts, and support messages</li>
                  <li>Respond to your comments, questions, and customer service requests</li>
                  <li>Communicate with you about products, services, offers, and events</li>
                  <li>Monitor and analyze trends, usage, and activities in connection with our services</li>
                  <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
                  <li>Personalize and improve the services and provide content or features that match your interests</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. Information Sharing and Disclosure</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  We may share your information in the following circumstances:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>With Service Providers:</strong> We share your information with auto service providers 
                    when you book their services through our platform.
                  </li>
                  <li>
                    <strong>With Third-Party Service Providers:</strong> We may share your information with 
                    third-party vendors, consultants, and other service providers who need access to such 
                    information to carry out work on our behalf.
                  </li>
                  <li>
                    <strong>For Legal Reasons:</strong> We may disclose your information if required to do so 
                    by law or in response to valid requests by public authorities.
                  </li>
                  <li>
                    <strong>Business Transfers:</strong> We may share or transfer your information in connection 
                    with, or during negotiations of, any merger, sale of company assets, financing, or acquisition.
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. Data Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  We take reasonable measures to help protect your personal information from loss, theft, 
                  misuse, unauthorized access, disclosure, alteration, and destruction. However, no internet 
                  or email transmission is ever fully secure or error-free.
                </p>
                <p>
                  We use industry-standard encryption protocols to protect sensitive information transmitted 
                  online. All payment information is encrypted and processed through secure payment gateways.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. Your Rights and Choices</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access and receive a copy of your personal information</li>
                  <li>Correct or update your personal information</li>
                  <li>Delete your personal information</li>
                  <li>Object to or restrict the processing of your personal information</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Withdraw consent where we rely on your consent to process your personal information</li>
                </ul>
                <p>
                  To exercise any of these rights, please contact us at privacy@h3automo.com.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. Cookies and Tracking Technologies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  We use cookies and similar tracking technologies to collect and track information about 
                  your activities on our services. You can instruct your browser to refuse all cookies or 
                  to indicate when a cookie is being sent. However, if you do not accept cookies, you may 
                  not be able to use some portions of our services.
                </p>
                <p>
                  For more information about our use of cookies, please see our Cookie Policy.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7. Children's Privacy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Our services are not directed to children under the age of 18, and we do not knowingly 
                  collect personal information from children under 18. If we learn that we have collected 
                  personal information from a child under 18, we will take steps to delete such information.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>8. Changes to This Privacy Policy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  We may update this Privacy Policy from time to time. If we make material changes, we will 
                  notify you by email or by posting a notice on our services prior to the effective date of 
                  the changes. We encourage you to review this Privacy Policy periodically to stay informed 
                  about how we are protecting your information.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>9. Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
                </p>
                <div className="mt-4">
                  <p><strong>H3 Automo</strong></p>
                  <p>Email: privacy@h3automo.com</p>
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

export default PrivacyPolicy;