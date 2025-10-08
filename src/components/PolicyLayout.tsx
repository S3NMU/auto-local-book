import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { FileText, Shield, Cookie } from 'lucide-react';

interface PolicyLayoutProps {
  children: ReactNode;
}

const PolicyLayout = ({ children }: PolicyLayoutProps) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const policyPages = [
    {
      title: 'Privacy Policy',
      path: '/privacy-policy',
      icon: Shield,
      description: 'How we collect and use your data'
    },
    {
      title: 'Terms of Service',
      path: '/terms-of-service',
      icon: FileText,
      description: 'Rules and guidelines for using our platform'
    },
    {
      title: 'Cookie Policy',
      path: '/cookie-policy',
      icon: Cookie,
      description: 'How we use cookies and tracking'
    }
  ];

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-8">
              <h2 className="text-lg font-semibold mb-4">Legal & Privacy</h2>
              <nav className="space-y-2">
                {policyPages.map((page) => {
                  const Icon = page.icon;
                  const isActive = currentPath === page.path;
                  
                  return (
                    <Link
                      key={page.path}
                      to={page.path}
                      className={`block rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <Card className={`border-0 shadow-none ${
                        isActive ? 'bg-transparent' : ''
                      }`}>
                        <div className="p-4">
                          <div className="flex items-start gap-3">
                            <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                              isActive ? 'text-primary-foreground' : 'text-primary'
                            }`} />
                            <div className="flex-1 min-w-0">
                              <div className={`font-medium mb-1 ${
                                isActive ? 'text-primary-foreground' : 'text-foreground'
                              }`}>
                                {page.title}
                              </div>
                              <div className={`text-sm ${
                                isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'
                              }`}>
                                {page.description}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default PolicyLayout;