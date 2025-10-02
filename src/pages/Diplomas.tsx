import { useState } from "react";
import { MobileNav } from "@/components/MobileNav";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GraduationCap, Search, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const universities = [
  { id: 1, name: "Harvard University", location: "Cambridge, MA", ranking: 1, price: "$15,000" },
  { id: 2, name: "Stanford University", location: "Stanford, CA", ranking: 2, price: "$15,000" },
  { id: 3, name: "Massachusetts Institute of Technology (MIT)", location: "Cambridge, MA", ranking: 3, price: "$15,000" },
  { id: 4, name: "University of California, Berkeley", location: "Berkeley, CA", ranking: 4, price: "$12,000" },
  { id: 5, name: "Princeton University", location: "Princeton, NJ", ranking: 5, price: "$15,000" },
  { id: 6, name: "Yale University", location: "New Haven, CT", ranking: 6, price: "$15,000" },
  { id: 7, name: "Columbia University", location: "New York, NY", ranking: 7, price: "$15,000" },
  { id: 8, name: "University of Chicago", location: "Chicago, IL", ranking: 8, price: "$14,000" },
  { id: 9, name: "California Institute of Technology (Caltech)", location: "Pasadena, CA", ranking: 9, price: "$15,000" },
  { id: 10, name: "Johns Hopkins University", location: "Baltimore, MD", ranking: 10, price: "$14,000" },
  { id: 11, name: "University of Pennsylvania", location: "Philadelphia, PA", ranking: 11, price: "$14,000" },
  { id: 12, name: "Cornell University", location: "Ithaca, NY", ranking: 12, price: "$14,000" },
  { id: 13, name: "University of Michigan", location: "Ann Arbor, MI", ranking: 13, price: "$12,000" },
  { id: 14, name: "Northwestern University", location: "Evanston, IL", ranking: 14, price: "$14,000" },
  { id: 15, name: "Duke University", location: "Durham, NC", ranking: 15, price: "$14,000" },
  { id: 16, name: "University of California, Los Angeles (UCLA)", location: "Los Angeles, CA", ranking: 16, price: "$12,000" },
  { id: 17, name: "Brown University", location: "Providence, RI", ranking: 17, price: "$14,000" },
  { id: 18, name: "Dartmouth College", location: "Hanover, NH", ranking: 18, price: "$14,000" },
  { id: 19, name: "Vanderbilt University", location: "Nashville, TN", ranking: 19, price: "$13,000" },
  { id: 20, name: "Rice University", location: "Houston, TX", ranking: 20, price: "$13,000" },
  { id: 21, name: "Washington University in St. Louis", location: "St. Louis, MO", ranking: 21, price: "$13,000" },
  { id: 22, name: "University of Notre Dame", location: "Notre Dame, IN", ranking: 22, price: "$13,000" },
  { id: 23, name: "University of California, San Diego", location: "San Diego, CA", ranking: 23, price: "$12,000" },
  { id: 24, name: "Emory University", location: "Atlanta, GA", ranking: 24, price: "$13,000" },
  { id: 25, name: "Georgetown University", location: "Washington, DC", ranking: 25, price: "$13,000" },
  { id: 26, name: "Carnegie Mellon University", location: "Pittsburgh, PA", ranking: 26, price: "$14,000" },
  { id: 27, name: "University of Southern California", location: "Los Angeles, CA", ranking: 27, price: "$13,000" },
  { id: 28, name: "University of Virginia", location: "Charlottesville, VA", ranking: 28, price: "$12,000" },
  { id: 29, name: "New York University", location: "New York, NY", ranking: 29, price: "$13,000" },
  { id: 30, name: "Tufts University", location: "Medford, MA", ranking: 30, price: "$13,000" },
  { id: 31, name: "University of North Carolina at Chapel Hill", location: "Chapel Hill, NC", ranking: 31, price: "$11,000" },
  { id: 32, name: "Boston College", location: "Chestnut Hill, MA", ranking: 32, price: "$12,000" },
  { id: 33, name: "University of California, Santa Barbara", location: "Santa Barbara, CA", ranking: 33, price: "$11,000" },
  { id: 34, name: "University of California, Irvine", location: "Irvine, CA", ranking: 34, price: "$11,000" },
  { id: 35, name: "Georgia Institute of Technology", location: "Atlanta, GA", ranking: 35, price: "$12,000" },
  { id: 36, name: "University of Florida", location: "Gainesville, FL", ranking: 36, price: "$11,000" },
  { id: 37, name: "Boston University", location: "Boston, MA", ranking: 37, price: "$12,000" },
  { id: 38, name: "University of Texas at Austin", location: "Austin, TX", ranking: 38, price: "$11,000" },
  { id: 39, name: "University of Wisconsin-Madison", location: "Madison, WI", ranking: 39, price: "$11,000" },
  { id: 40, name: "University of Illinois at Urbana-Champaign", location: "Champaign, IL", ranking: 40, price: "$11,000" },
  { id: 41, name: "University of Washington", location: "Seattle, WA", ranking: 41, price: "$11,000" },
  { id: 42, name: "Ohio State University", location: "Columbus, OH", ranking: 42, price: "$10,000" },
  { id: 43, name: "Pennsylvania State University", location: "University Park, PA", ranking: 43, price: "$10,000" },
  { id: 44, name: "Purdue University", location: "West Lafayette, IN", ranking: 44, price: "$10,000" },
  { id: 45, name: "University of California, Davis", location: "Davis, CA", ranking: 45, price: "$11,000" },
  { id: 46, name: "University of Minnesota", location: "Minneapolis, MN", ranking: 46, price: "$10,000" },
  { id: 47, name: "University of Maryland", location: "College Park, MD", ranking: 47, price: "$10,000" },
  { id: 48, name: "Rutgers University", location: "New Brunswick, NJ", ranking: 48, price: "$10,000" },
  { id: 49, name: "Texas A&M University", location: "College Station, TX", ranking: 49, price: "$10,000" },
  { id: 50, name: "University of Pittsburgh", location: "Pittsburgh, PA", ranking: 50, price: "$10,000" },
  { id: 51, name: "Michigan State University", location: "East Lansing, MI", ranking: 51, price: "$9,500" },
  { id: 52, name: "University of Miami", location: "Coral Gables, FL", ranking: 52, price: "$11,000" },
  { id: 53, name: "Indiana University Bloomington", location: "Bloomington, IN", ranking: 53, price: "$9,500" },
  { id: 54, name: "University of Arizona", location: "Tucson, AZ", ranking: 54, price: "$9,500" },
  { id: 55, name: "Arizona State University", location: "Tempe, AZ", ranking: 55, price: "$9,500" },
  { id: 56, name: "University of Colorado Boulder", location: "Boulder, CO", ranking: 56, price: "$10,000" },
  { id: 57, name: "University of Georgia", location: "Athens, GA", ranking: 57, price: "$9,500" },
  { id: 58, name: "North Carolina State University", location: "Raleigh, NC", ranking: 58, price: "$9,500" },
  { id: 59, name: "Virginia Tech", location: "Blacksburg, VA", ranking: 59, price: "$9,500" },
  { id: 60, name: "University of Iowa", location: "Iowa City, IA", ranking: 60, price: "$9,500" },
  { id: 61, name: "Clemson University", location: "Clemson, SC", ranking: 61, price: "$9,500" },
  { id: 62, name: "University of Connecticut", location: "Storrs, CT", ranking: 62, price: "$10,000" },
  { id: 63, name: "University of Massachusetts Amherst", location: "Amherst, MA", ranking: 63, price: "$9,500" },
  { id: 64, name: "University of Delaware", location: "Newark, DE", ranking: 64, price: "$9,500" },
  { id: 65, name: "Syracuse University", location: "Syracuse, NY", ranking: 65, price: "$10,000" },
  { id: 66, name: "University of Oregon", location: "Eugene, OR", ranking: 66, price: "$9,500" },
  { id: 67, name: "University of Tennessee", location: "Knoxville, TN", ranking: 67, price: "$9,000" },
  { id: 68, name: "Auburn University", location: "Auburn, AL", ranking: 68, price: "$9,000" },
  { id: 69, name: "University of Alabama", location: "Tuscaloosa, AL", ranking: 69, price: "$9,000" },
  { id: 70, name: "University of South Carolina", location: "Columbia, SC", ranking: 70, price: "$9,000" },
  { id: 71, name: "University of Oklahoma", location: "Norman, OK", ranking: 71, price: "$9,000" },
  { id: 72, name: "Florida State University", location: "Tallahassee, FL", ranking: 72, price: "$9,000" },
  { id: 73, name: "Iowa State University", location: "Ames, IA", ranking: 73, price: "$9,000" },
  { id: 74, name: "University of Kansas", location: "Lawrence, KS", ranking: 74, price: "$9,000" },
  { id: 75, name: "University of Nebraska-Lincoln", location: "Lincoln, NE", ranking: 75, price: "$9,000" },
  { id: 76, name: "University of Missouri", location: "Columbia, MO", ranking: 76, price: "$9,000" },
  { id: 77, name: "University of Kentucky", location: "Lexington, KY", ranking: 77, price: "$9,000" },
  { id: 78, name: "Louisiana State University", location: "Baton Rouge, LA", ranking: 78, price: "$9,000" },
  { id: 79, name: "University of Arkansas", location: "Fayetteville, AR", ranking: 79, price: "$8,500" },
  { id: 80, name: "University of Utah", location: "Salt Lake City, UT", ranking: 80, price: "$9,000" },
  { id: 81, name: "University of New Mexico", location: "Albuquerque, NM", ranking: 81, price: "$8,500" },
  { id: 82, name: "University of Mississippi", location: "Oxford, MS", ranking: 82, price: "$8,500" },
  { id: 83, name: "West Virginia University", location: "Morgantown, WV", ranking: 83, price: "$8,500" },
  { id: 84, name: "Kansas State University", location: "Manhattan, KS", ranking: 84, price: "$8,500" },
  { id: 85, name: "University of Rhode Island", location: "Kingston, RI", ranking: 85, price: "$9,000" },
  { id: 86, name: "University of Vermont", location: "Burlington, VT", ranking: 86, price: "$9,000" },
  { id: 87, name: "University of New Hampshire", location: "Durham, NH", ranking: 87, price: "$9,000" },
  { id: 88, name: "University of Maine", location: "Orono, ME", ranking: 88, price: "$8,500" },
  { id: 89, name: "University of Hawaii at Manoa", location: "Honolulu, HI", ranking: 89, price: "$9,500" },
  { id: 90, name: "University of Alaska Fairbanks", location: "Fairbanks, AK", ranking: 90, price: "$8,500" },
  { id: 91, name: "University of Wyoming", location: "Laramie, WY", ranking: 91, price: "$8,500" },
  { id: 92, name: "University of Montana", location: "Missoula, MT", ranking: 92, price: "$8,500" },
  { id: 93, name: "University of Idaho", location: "Moscow, ID", ranking: 93, price: "$8,500" },
  { id: 94, name: "University of Nevada, Reno", location: "Reno, NV", ranking: 94, price: "$8,500" },
  { id: 95, name: "University of South Dakota", location: "Vermillion, SD", ranking: 95, price: "$8,000" },
  { id: 96, name: "University of North Dakota", location: "Grand Forks, ND", ranking: 96, price: "$8,000" },
  { id: 97, name: "South Dakota State University", location: "Brookings, SD", ranking: 97, price: "$8,000" },
  { id: 98, name: "North Dakota State University", location: "Fargo, ND", ranking: 98, price: "$8,000" },
  { id: 99, name: "Montana State University", location: "Bozeman, MT", ranking: 99, price: "$8,500" },
  { id: 100, name: "Idaho State University", location: "Pocatello, ID", ranking: 100, price: "$8,000" },
];

const Diplomas = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUniversities = universities.filter(
    (uni) =>
      uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      uni.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <MobileNav />

      {/* Hero Section */}
      <section className="relative py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-background" />
        <div className="container mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
              <GraduationCap className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary">Premium Diplomas</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Top 100 American Universities
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Premium authentic university diplomas from America's most prestigious institutions. 
              Fast processing and worldwide delivery.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" onClick={() => navigate("/apply")}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Order Now
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/faq")}>
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 px-4 border-b">
        <div className="container mx-auto max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search universities by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Showing {filteredUniversities.length} of {universities.length} universities
          </p>
        </div>
      </section>

      {/* Universities Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUniversities.map((university, index) => (
              <Card 
                key={university.id} 
                className="group relative overflow-hidden hover:shadow-2xl transition-all duration-300 animate-fade-in border-2 hover:border-primary/50"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <CardHeader className="relative">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="secondary" className="text-xs font-bold">
                      #{university.ranking}
                    </Badge>
                    <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg text-sm font-bold px-3 py-1">
                      {university.price}
                    </Badge>
                  </div>
                  
                  {/* University Icon */}
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                    <GraduationCap className="h-6 w-6 text-primary" />
                  </div>
                  
                  <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors duration-300">
                    {university.name}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="relative">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 pb-4 border-b">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span className="font-medium">{university.location}</span>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-3 text-sm">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                      </div>
                      <span>Authentic diploma with official seal</span>
                    </div>
                    <div className="flex items-start gap-3 text-sm">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                      </div>
                      <span>Official university format & paper</span>
                    </div>
                    <div className="flex items-start gap-3 text-sm">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                      </div>
                      <span>Fast 2-3 week delivery worldwide</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full group-hover:shadow-lg transition-all duration-300" 
                    size="lg"
                    onClick={() => navigate(`/apply?type=diploma&university=${encodeURIComponent(university.name)}`)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Order Diploma
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Diplomas;
