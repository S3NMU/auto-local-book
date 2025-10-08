import logoImage from "@/assets/crossed-wrenches-logo.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
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
              <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center p-1">
                <img src={logoImage} alt="H3 Automo Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-xl font-bold">H3 Automo</span>
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
              <li><Link to="/services#oil-change" className="hover:text-primary-foreground transition-fast">Oil Change</Link></li>
              <li><Link to="/services#brake-service" className="hover:text-primary-foreground transition-fast">Brake Service</Link></li>
              <li><Link to="/services#computer-diagnostic" className="hover:text-primary-foreground transition-fast">Diagnostics</Link></li>
              <li><Link to="/services#tire-service" className="hover:text-primary-foreground transition-fast">Tire Service</Link></li>
              <li><Link to="/services#battery-electrical" className="hover:text-primary-foreground transition-fast">Battery & Electrical</Link></li>
              <li><Link to="/services#air-conditioning" className="hover:text-primary-foreground transition-fast">Air Conditioning</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Company</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><Link to="/about" className="hover:text-primary-foreground transition-fast">About Us</Link></li>
              <li><Link to="/how-it-works" className="hover:text-primary-foreground transition-fast">How It Works</Link></li>
              <li><Link to="/list-shop" className="hover:text-primary-foreground transition-fast">List Your Shop</Link></li>
              <li><Link to="/careers" className="hover:text-primary-foreground transition-fast">Careers</Link></li>
              <li><Link to="/press" className="hover:text-primary-foreground transition-fast">Press</Link></li>
              <li><Link to="/blog" className="hover:text-primary-foreground transition-fast">Blog</Link></li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Stay Connected</h3>
            <div className="space-y-3 text-sm text-primary-foreground/80">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>support@h3automo.com</span>
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
              © {currentYear} H3 Automo Services Booking Platform. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-primary-foreground/60">
              <Link to="/privacy-policy" className="hover:text-primary-foreground transition-fast">Privacy Policy</Link>
              <Link to="/terms-of-service" className="hover:text-primary-foreground transition-fast">Terms of Service</Link>
              <Link to="/cookie-policy" className="hover:text-primary-foreground transition-fast">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;