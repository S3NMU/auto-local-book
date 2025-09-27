import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin 
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-accent-foreground font-bold">L</span>
              </div>
              <span className="text-xl font-bold">LocalAuto</span>
            </div>
            <p className="text-primary-foreground/80 text-sm">
              The trusted platform connecting drivers with verified auto service 
              providers for transparent, instant booking.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 text-primary-foreground/60 hover:text-primary-foreground cursor-pointer transition-fast" />
              <Twitter className="w-5 h-5 text-primary-foreground/60 hover:text-primary-foreground cursor-pointer transition-fast" />
              <Instagram className="w-5 h-5 text-primary-foreground/60 hover:text-primary-foreground cursor-pointer transition-fast" />
              <Linkedin className="w-5 h-5 text-primary-foreground/60 hover:text-primary-foreground cursor-pointer transition-fast" />
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Services</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><a href="#" className="hover:text-primary-foreground transition-fast">Oil Change</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-fast">Brake Service</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-fast">Diagnostics</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-fast">Tune-Up</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-fast">Inspection</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-fast">Auto Detailing</a></li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Company</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><a href="#" className="hover:text-primary-foreground transition-fast">About Us</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-fast">How It Works</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-fast">List Your Shop</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-fast">Careers</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-fast">Press</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-fast">Blog</a></li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Stay Connected</h3>
            <div className="space-y-3 text-sm text-primary-foreground/80">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>support@localauto.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>1-800-LOCAL-AUTO</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Nationwide Coverage</span>
              </div>
            </div>
            
            <div className="pt-2">
              <p className="text-sm text-primary-foreground/80 mb-2">Get updates & offers</p>
              <div className="flex gap-2">
                <Input 
                  placeholder="Your email"
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
                />
                <Button variant="accent" size="sm">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-primary-foreground/60">
              © {currentYear} LocalAuto Services Booking Platform. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-primary-foreground/60">
              <a href="#" className="hover:text-primary-foreground transition-fast">Privacy Policy</a>
              <a href="#" className="hover:text-primary-foreground transition-fast">Terms of Service</a>
              <a href="#" className="hover:text-primary-foreground transition-fast">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;