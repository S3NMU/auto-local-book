import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CookiePolicy = () => {
  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Cookie Policy
            </h1>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>1. What Are Cookies?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Cookies are small text files that are placed on your device when you visit a website. 
                  They are widely used to make websites work more efficiently and provide information to 
                  the site owners.
                </p>
                <p>
                  Cookies help us understand how you use our website, remember your preferences, and 
                  improve your overall experience.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. Types of Cookies We Use</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Essential Cookies</h4>
                    <p>
                      These cookies are necessary for the website to function properly. They enable core 
                      functionality such as security, network management, and accessibility. You cannot 
                      opt-out of essential cookies.
                    </p>
                    <p className="mt-2 text-sm">
                      Examples: Authentication cookies, session cookies, security cookies
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Performance Cookies</h4>
                    <p>
                      These cookies collect information about how you use our website, such as which pages 
                      you visit most often and if you receive error messages. This helps us improve how our 
                      website works.
                    </p>
                    <p className="mt-2 text-sm">
                      Examples: Analytics cookies, speed testing cookies, error tracking cookies
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Functionality Cookies</h4>
                    <p>
                      These cookies allow the website to remember choices you make (such as your username, 
                      language, or region) and provide enhanced, more personal features.
                    </p>
                    <p className="mt-2 text-sm">
                      Examples: User preference cookies, language selection cookies, location cookies
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Targeting/Advertising Cookies</h4>
                    <p>
                      These cookies are used to deliver advertisements more relevant to you and your interests. 
                      They also limit the number of times you see an advertisement and help measure the 
                      effectiveness of advertising campaigns.
                    </p>
                    <p className="mt-2 text-sm">
                      Examples: Ad targeting cookies, remarketing cookies, behavioral advertising cookies
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. Third-Party Cookies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  In addition to our own cookies, we may use various third-party cookies to report usage 
                  statistics, deliver advertisements, and provide enhanced functionality.
                </p>
                <p>
                  Third parties that may set cookies through our website include:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Analytics Services:</strong> Google Analytics, to help us understand how users 
                    interact with our website
                  </li>
                  <li>
                    <strong>Advertising Networks:</strong> To deliver relevant advertisements based on your 
                    browsing behavior
                  </li>
                  <li>
                    <strong>Social Media Platforms:</strong> To enable social sharing features and track 
                    social media engagement
                  </li>
                  <li>
                    <strong>Payment Processors:</strong> To facilitate secure payment transactions
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. How Long Do Cookies Last?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Session Cookies</h4>
                    <p>
                      These cookies are temporary and are deleted when you close your browser. They are 
                      typically used to maintain your session as you navigate through our website.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Persistent Cookies</h4>
                    <p>
                      These cookies remain on your device for a set period or until you delete them. They 
                      help us remember your preferences and settings for your next visit.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. Managing Your Cookie Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  You have the right to decide whether to accept or reject cookies. You can exercise your 
                  cookie preferences in several ways:
                </p>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Browser Settings</h4>
                    <p>
                      Most web browsers allow you to control cookies through their settings. You can:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mt-2">
                      <li>Delete cookies that are already stored on your device</li>
                      <li>Block cookies from being set</li>
                      <li>Allow cookies only from specific websites</li>
                      <li>Be notified when a cookie is being set</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Browser-Specific Instructions</h4>
                    <ul className="list-disc pl-6 space-y-2">
                      <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
                      <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</li>
                      <li><strong>Safari:</strong> Preferences → Privacy → Cookies and website data</li>
                      <li><strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and data stored</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Opt-Out Tools</h4>
                    <p>
                      You can opt out of targeted advertising by visiting:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mt-2">
                      <li>Network Advertising Initiative (NAI): www.networkadvertising.org/choices</li>
                      <li>Digital Advertising Alliance (DAA): www.aboutads.info/choices</li>
                      <li>European Interactive Digital Advertising Alliance (EDAA): www.youronlinechoices.eu</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm">
                    <strong>Please note:</strong> If you disable cookies, some features of our website may 
                    not function properly, and your user experience may be limited.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. Cookies and Personal Data</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Some cookies may collect information that can identify you. We treat information collected 
                  by cookies as personal data. This means all information we collect through cookies is 
                  subject to our Privacy Policy.
                </p>
                <p>
                  We use this information to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Recognize you when you return to our website</li>
                  <li>Remember your preferences and settings</li>
                  <li>Provide personalized content and recommendations</li>
                  <li>Improve our services based on your usage patterns</li>
                  <li>Analyze website performance and user behavior</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7. Do Not Track Signals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Some browsers have a "Do Not Track" feature that lets you tell websites that you do not 
                  want to have your online activities tracked. At this time, we do not respond to browser 
                  "Do Not Track" signals.
                </p>
                <p>
                  However, you can still control cookies and tracking through your browser settings as 
                  described in this policy.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>8. Updates to This Policy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  We may update this Cookie Policy from time to time to reflect changes in our practices 
                  or for other operational, legal, or regulatory reasons. We will notify you of any 
                  material changes by posting the new policy on this page and updating the "Last updated" date.
                </p>
                <p>
                  We encourage you to review this Cookie Policy periodically to stay informed about how 
                  we use cookies.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>9. Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  If you have questions about our use of cookies or this Cookie Policy, please contact us at:
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

export default CookiePolicy;