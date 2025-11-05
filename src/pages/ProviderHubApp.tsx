import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download, CheckCircle2, Smartphone, Laptop, Monitor, AlertCircle, Apple, Chrome } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";

const ProviderHubApp = () => {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    // Listen for install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // Listen for app installed
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;

    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;

    if (outcome === "accepted") {
      setInstallPrompt(null);
      setIsInstalled(true);
    }
  };

  const downloadButtons = [
    {
      platform: "Windows",
      icon: Monitor,
      description: "Chrome, Edge, or Opera browser",
      action: "Click the install icon in the address bar or use the button above",
    },
    {
      platform: "macOS",
      icon: Apple,
      description: "Chrome, Edge, or Safari 16.4+",
      action: "Click the install icon in the address bar or use the button above",
    },
    {
      platform: "Linux",
      icon: Laptop,
      description: "Chrome, Edge, or Opera browser",
      action: "Click the install icon in the address bar or use the button above",
    },
    {
      platform: "iOS",
      icon: Smartphone,
      description: "Safari browser",
      action: "Tap Share → Add to Home Screen",
    },
    {
      platform: "Android",
      icon: Chrome,
      description: "Chrome or Edge browser",
      action: "Tap menu (⋮) → Install App or Add to Home Screen",
    },
  ];

  const features = [
    {
      title: "Offline Access",
      description: "Access your provider dashboard even without internet connection",
      icon: Monitor,
    },
    {
      title: "Fast Performance",
      description: "Lightning-fast load times with cached resources",
      icon: CheckCircle2,
    },
    {
      title: "Desktop Integration",
      description: "Installs like a native app on Windows, Mac, and Linux",
      icon: Laptop,
    },
    {
      title: "Mobile Friendly",
      description: "Works seamlessly on smartphones and tablets too",
      icon: Smartphone,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Laptop className="w-12 h-12 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">H3 Provider HUB</h1>
          </div>
          <p className="text-muted-foreground text-lg mb-2">
            Desktop Management Software for Service Providers
          </p>
          <Badge variant="secondary" className="text-sm">Progressive Web App</Badge>
        </div>

        <Separator className="mb-8" />

        {/* Installation Status */}
        {isInstalled ? (
          <Alert className="mb-8 border-green-500/50 bg-green-500/10">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertTitle className="text-green-700 dark:text-green-400">Successfully Installed!</AlertTitle>
            <AlertDescription className="text-green-600 dark:text-green-300">
              The H3 Provider HUB is now installed on your device. See installation options for other devices below.
            </AlertDescription>
          </Alert>
        ) : isInstallable ? (
          <Alert className="mb-8 border-primary/50 bg-primary/10">
            <Download className="h-4 w-4 text-primary" />
            <AlertTitle>Ready to Install</AlertTitle>
            <AlertDescription className="mb-4">
              Install the H3 Provider HUB on your device for quick access and offline functionality.
            </AlertDescription>
            <Button onClick={handleInstall} className="w-full sm:w-auto">
              <Download className="w-4 h-4 mr-2" />
              Install Provider HUB
            </Button>
          </Alert>
        ) : null}

        {/* Download/Install Options for All Devices */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Install on Your Device</h2>
          
          {/* Desktop Platforms */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-muted-foreground mb-4">Desktop</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {downloadButtons.slice(0, 3).map((platform, index) => {
                const Icon = platform.icon;
                return (
                  <Card key={index} className="hover:border-primary/50 transition-all hover:shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                          <Icon className="w-8 h-8 text-primary" />
                        </div>
                        <CardTitle className="text-xl mb-2">{platform.platform}</CardTitle>
                        <CardDescription className="mb-4">{platform.description}</CardDescription>
                        <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-md">
                          <strong className="block mb-1">Installation:</strong>
                          {platform.action}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Mobile Platforms */}
          <div>
            <h3 className="text-lg font-semibold text-muted-foreground mb-4">Mobile</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {downloadButtons.slice(3).map((platform, index) => {
                const Icon = platform.icon;
                return (
                  <Card key={index} className="hover:border-primary/50 transition-all hover:shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                          <Icon className="w-8 h-8 text-primary" />
                        </div>
                        <CardTitle className="text-xl mb-2">{platform.platform}</CardTitle>
                        <CardDescription className="mb-4">{platform.description}</CardDescription>
                        <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-md">
                          <strong className="block mb-1">Installation:</strong>
                          {platform.action}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Key Features</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                        <CardDescription className="mt-1">{feature.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>

        {/* What's Included */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What's Included</CardTitle>
            <CardDescription>Everything you need to manage your provider account</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">Full provider dashboard with real-time analytics</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">Booking management and customer communications</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">Service pricing and inventory management</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">Revenue tracking and financial reports</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">Customer reviews and ratings management</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">Offline access to essential features</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* System Requirements */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>System Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2 text-foreground">Desktop</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Windows 10+, macOS 10.13+, or Linux</li>
                  <li>• Chrome 67+, Edge 79+, or Safari 15.4+</li>
                  <li>• 100 MB free disk space</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-foreground">Mobile</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• iOS 15.4+ or Android 8.0+</li>
                  <li>• Safari 15.4+ or Chrome 67+</li>
                  <li>• 50 MB free storage</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={() => navigate("/provider-dashboard")} 
            variant="outline"
            className="flex-1"
          >
            Open Dashboard
          </Button>
          <Button 
            onClick={() => navigate("/provider-resources/downloads")} 
            variant="outline"
            className="flex-1"
          >
            Back to Downloads
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProviderHubApp;
