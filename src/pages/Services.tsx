import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench, Car, Settings, CheckCircle } from "lucide-react";

const Services = () => {
  const services = [
    {
      id: 1,
      title: "Oil Change",
      description: "Essential engine maintenance that keeps your vehicle running smoothly and extends engine life.",
      icon: Settings,
      details: "Regular oil changes are the most important maintenance service for your vehicle. During this service, old engine oil is drained and replaced with fresh oil, and the oil filter is replaced. The technician will also check fluid levels including brake fluid, transmission fluid, coolant, and windshield washer fluid. Fresh oil lubricates engine parts, reduces friction, and helps regulate engine temperature. Most vehicles need an oil change every 3,000-7,500 miles depending on the oil type and driving conditions.",
      whatToExpect: [
        "Drain old engine oil completely",
        "Replace oil filter with new one",
        "Install fresh motor oil (conventional or synthetic)",
        "Check and top off all fluid levels",
        "Inspect belts and hoses",
        "Visual inspection of battery and air filter"
      ]
    },
    {
      id: 2,
      title: "Brake Service",
      description: "Critical safety maintenance ensuring your vehicle can stop safely and effectively.",
      icon: Car,
      details: "Brake service encompasses inspection, maintenance, and repair of your vehicle's entire braking system. This includes brake pads, rotors, brake fluid, brake lines, and calipers. During service, technicians measure brake pad thickness, inspect rotors for wear or damage, check brake fluid level and quality, and test the overall braking performance. Signs you need brake service include squealing noises, grinding sounds, vibration when braking, or a spongy brake pedal. Regular brake maintenance prevents costly repairs and ensures your safety on the road.",
      whatToExpect: [
        "Comprehensive brake system inspection",
        "Brake pad measurement and replacement if needed",
        "Rotor inspection and resurfacing or replacement",
        "Brake fluid check and replacement",
        "Brake line and caliper inspection",
        "Road test to verify proper operation"
      ]
    },
    {
      id: 3,
      title: "Computer Diagnostic",
      description: "Advanced troubleshooting using modern technology to identify vehicle issues quickly and accurately.",
      icon: Wrench,
      details: "Modern vehicles are equipped with sophisticated computer systems that monitor various engine and vehicle functions. When something goes wrong, these systems store diagnostic trouble codes (DTCs) that help technicians identify the problem. During a diagnostic service, technicians use specialized scan tools to retrieve these codes and perform additional tests to pinpoint the exact issue. This service is essential when your check engine light comes on, but it's also useful for identifying potential problems before they become major repairs.",
      whatToExpect: [
        "OBD-II system scan for diagnostic trouble codes",
        "Code interpretation and analysis",
        "Additional testing of suspected components",
        "Review of vehicle history and symptoms",
        "Detailed explanation of findings",
        "Repair recommendations with cost estimates"
      ]
    },
    {
      id: 4,
      title: "Tire Service",
      description: "Comprehensive tire care including rotation, balancing, alignment, and replacement services.",
      icon: Settings,
      details: "Proper tire maintenance is crucial for vehicle safety, fuel efficiency, and tire longevity. Tire service includes rotation to ensure even wear, balancing to prevent vibration, alignment to prevent premature wear and improve handling, and replacement when tires are worn beyond safe limits. Regular tire maintenance can extend tire life by up to 50% and improve fuel economy. Technicians will also check tire pressure, inspect for damage, and assess tread depth to ensure your tires meet safety standards.",
      whatToExpect: [
        "Tire pressure check and adjustment",
        "Tread depth measurement",
        "Visual inspection for damage or irregular wear",
        "Tire rotation according to vehicle specifications",
        "Wheel balancing if needed",
        "Alignment check and adjustment"
      ]
    },
    {
      id: 5,
      title: "Battery & Electrical",
      description: "Testing, maintenance, and replacement of your vehicle's electrical system components.",
      icon: Wrench,
      details: "Your vehicle's electrical system powers everything from the engine ignition to lights, radio, and air conditioning. Battery and electrical service includes testing the battery's capacity and condition, checking the charging system (alternator), inspecting electrical connections, and testing the starter motor. A failing battery or electrical system can leave you stranded, so regular testing helps prevent unexpected breakdowns. Most car batteries last 3-5 years, but extreme temperatures and driving habits can affect battery life.",
      whatToExpect: [
        "Battery load test and capacity check",
        "Charging system (alternator) test",
        "Starter motor performance test",
        "Electrical connection inspection and cleaning",
        "Belt inspection (if applicable)",
        "Battery replacement if needed"
      ]
    },
    {
      id: 6,
      title: "Air Conditioning",
      description: "Complete A/C system service to keep you comfortable in all weather conditions.",
      icon: Car,
      details: "Air conditioning service ensures your vehicle's A/C system operates efficiently and provides optimal comfort. The service includes checking refrigerant levels, testing system pressure, inspecting for leaks, and evaluating the condition of major components like the compressor, condenser, and evaporator. Technicians will also replace the cabin air filter if needed. A properly maintained A/C system not only keeps you comfortable but also helps defog windows and maintain good air quality inside your vehicle.",
      whatToExpect: [
        "A/C system performance test",
        "Refrigerant level and pressure check",
        "Leak detection using specialized equipment",
        "Component inspection (compressor, condenser, evaporator)",
        "Cabin air filter replacement",
        "System evacuation and recharge if needed"
      ]
    }
  ];

  return (
    <div className="bg-background scroll-smooth">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-light py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            Auto Service Guide
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
            Learn about essential automotive services and what each one involves. 
            Understanding these services helps you make informed decisions about your vehicle's maintenance and care.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">

        <div className="grid grid-cols-1 gap-8">
          {services.map((service) => {
            const IconComponent = service.icon;
            const expectationsList = service.whatToExpect || [];
            
            // Create proper ID for anchor linking
            let serviceId = service.title.toLowerCase().replace(/[\s&]/g, '-');
            if (service.title === "Computer Diagnostic") serviceId = "computer-diagnostic";
            if (service.title === "Battery & Electrical") serviceId = "battery-electrical";
            if (service.title === "Air Conditioning") serviceId = "air-conditioning";
            
            return (
              <Card key={service.id} id={serviceId} className="hover:shadow-lg transition-shadow scroll-mt-8">
                <CardHeader>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-2">{service.title}</CardTitle>
                      <CardDescription className="text-base">{service.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-foreground mb-3">What This Service Includes</h4>
                      <p className="text-muted-foreground leading-relaxed">{service.details}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold text-foreground mb-3">What to Expect</h4>
                      <ul className="space-y-2">
                        {expectationsList.map((item, index) => (
                          <li key={index} className="flex items-start space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Services;