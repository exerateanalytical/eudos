import { useState } from "react";
import { MobileNav } from "@/components/MobileNav";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GraduationCap, Search, ShoppingCart, Filter, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

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
  
  // Top Canadian Universities
  { id: 101, name: "University of Toronto", location: "Toronto, ON, Canada", ranking: 1, price: "$14,000", country: "Canada" },
  { id: 102, name: "McGill University", location: "Montreal, QC, Canada", ranking: 2, price: "$14,000", country: "Canada" },
  { id: 103, name: "University of British Columbia", location: "Vancouver, BC, Canada", ranking: 3, price: "$13,000", country: "Canada" },
  { id: 104, name: "McMaster University", location: "Hamilton, ON, Canada", ranking: 4, price: "$12,000", country: "Canada" },
  { id: 105, name: "University of Alberta", location: "Edmonton, AB, Canada", ranking: 5, price: "$12,000", country: "Canada" },
  { id: 106, name: "University of Montreal", location: "Montreal, QC, Canada", ranking: 6, price: "$12,000", country: "Canada" },
  { id: 107, name: "University of Waterloo", location: "Waterloo, ON, Canada", ranking: 7, price: "$12,000", country: "Canada" },
  { id: 108, name: "Western University", location: "London, ON, Canada", ranking: 8, price: "$11,000", country: "Canada" },
  { id: 109, name: "Queen's University", location: "Kingston, ON, Canada", ranking: 9, price: "$11,000", country: "Canada" },
  { id: 110, name: "University of Calgary", location: "Calgary, AB, Canada", ranking: 10, price: "$11,000", country: "Canada" },
  { id: 111, name: "Dalhousie University", location: "Halifax, NS, Canada", ranking: 11, price: "$10,000", country: "Canada" },
  { id: 112, name: "University of Ottawa", location: "Ottawa, ON, Canada", ranking: 12, price: "$10,000", country: "Canada" },
  { id: 113, name: "Simon Fraser University", location: "Burnaby, BC, Canada", ranking: 13, price: "$10,000", country: "Canada" },
  { id: 114, name: "University of Victoria", location: "Victoria, BC, Canada", ranking: 14, price: "$10,000", country: "Canada" },
  { id: 115, name: "Laval University", location: "Quebec City, QC, Canada", ranking: 15, price: "$10,000", country: "Canada" },
  { id: 116, name: "York University", location: "Toronto, ON, Canada", ranking: 16, price: "$9,500", country: "Canada" },
  { id: 117, name: "University of Saskatchewan", location: "Saskatoon, SK, Canada", ranking: 17, price: "$9,500", country: "Canada" },
  { id: 118, name: "University of Manitoba", location: "Winnipeg, MB, Canada", ranking: 18, price: "$9,500", country: "Canada" },
  { id: 119, name: "Carleton University", location: "Ottawa, ON, Canada", ranking: 19, price: "$9,500", country: "Canada" },
  { id: 120, name: "University of Guelph", location: "Guelph, ON, Canada", ranking: 20, price: "$9,500", country: "Canada" },
  { id: 121, name: "Concordia University", location: "Montreal, QC, Canada", ranking: 21, price: "$9,000", country: "Canada" },
  { id: 122, name: "Memorial University of Newfoundland", location: "St. John's, NL, Canada", ranking: 22, price: "$9,000", country: "Canada" },
  { id: 123, name: "Ryerson University", location: "Toronto, ON, Canada", ranking: 23, price: "$9,000", country: "Canada" },
  { id: 124, name: "University of New Brunswick", location: "Fredericton, NB, Canada", ranking: 24, price: "$9,000", country: "Canada" },
  { id: 125, name: "University of Windsor", location: "Windsor, ON, Canada", ranking: 25, price: "$8,500", country: "Canada" },
  
  // Additional American Universities (not in original top 100)
  { id: 126, name: "University of Rochester", location: "Rochester, NY", ranking: 44, price: "$12,000" },
  { id: 127, name: "Case Western Reserve University", location: "Cleveland, OH", ranking: 45, price: "$11,000" },
  { id: 128, name: "Stony Brook University", location: "Stony Brook, NY", ranking: 53, price: "$9,500" },
  { id: 129, name: "University of California--Santa Cruz", location: "Santa Cruz, CA", ranking: 55, price: "$10,000" },
  { id: 130, name: "Lehigh University", location: "Bethlehem, PA", ranking: 56, price: "$10,000" },
  { id: 131, name: "Worcester Polytechnic Institute (WPI)", location: "Worcester, MA", ranking: 58, price: "$10,000" },
  { id: 132, name: "Rensselaer Polytechnic Institute (RPI)", location: "Troy, NY", ranking: 59, price: "$10,000" },
  { id: 133, name: "Brandeis University", location: "Waltham, MA", ranking: 60, price: "$10,000" },
  { id: 134, name: "Colorado School of Mines", location: "Golden, CO", ranking: 61, price: "$9,500" },
  { id: 135, name: "Oklahoma State University", location: "Stillwater, OK", ranking: 62, price: "$8,500" },
  { id: 136, name: "Miami University", location: "Oxford, OH", ranking: 64, price: "$9,000" },
  { id: 137, name: "University at Buffalo--SUNY", location: "Buffalo, NY", ranking: 66, price: "$9,000" },
  { id: 138, name: "Fordham University", location: "New York, NY", ranking: 70, price: "$10,000" },
  { id: 139, name: "University of Cincinnati", location: "Cincinnati, OH", ranking: 71, price: "$9,000" },
  { id: 140, name: "Baylor University", location: "Waco, TX", ranking: 72, price: "$9,000" },
  { id: 141, name: "George Washington University", location: "Washington, DC", ranking: 73, price: "$10,000" },
  { id: 142, name: "American University", location: "Washington, DC", ranking: 74, price: "$9,500" },
  { id: 143, name: "Southern Methodist University (SMU)", location: "Dallas, TX", ranking: 76, price: "$9,500" },
  { id: 144, name: "Temple University", location: "Philadelphia, PA", ranking: 77, price: "$9,000" },
  { id: 145, name: "Oregon State University", location: "Corvallis, OR", ranking: 80, price: "$8,500" },
  { id: 146, name: "University of South Florida", location: "Tampa, FL", ranking: 88, price: "$8,500" },
  { id: 147, name: "Hofstra University", location: "Hempstead, NY", ranking: 93, price: "$9,000" },
  { id: 148, name: "St. Louis University", location: "St. Louis, MO", ranking: 95, price: "$9,000" },
  { id: 149, name: "University of Richmond", location: "Richmond, VA", ranking: 96, price: "$9,500" },
  { id: 150, name: "Binghamton University--SUNY", location: "Binghamton, NY", ranking: 97, price: "$9,000" },
  { id: 151, name: "Northern Illinois University", location: "DeKalb, IL", ranking: 99, price: "$8,000" },
  { id: 152, name: "Clark University", location: "Worcester, MA", ranking: 100, price: "$9,000" },
  
  // Community Colleges
  { id: 153, name: "Santa Monica College", location: "Santa Monica, CA", ranking: 1, price: "$5,500", type: "Community College" },
  { id: 154, name: "Miami Dade College", location: "Miami, FL", ranking: 2, price: "$5,500", type: "Community College" },
  { id: 155, name: "Northern Virginia Community College", location: "Annandale, VA", ranking: 3, price: "$5,500", type: "Community College" },
  { id: 156, name: "Lone Star College", location: "The Woodlands, TX", ranking: 4, price: "$5,000", type: "Community College" },
  { id: 157, name: "Houston Community College", location: "Houston, TX", ranking: 5, price: "$5,000", type: "Community College" },
  { id: 158, name: "City College of San Francisco", location: "San Francisco, CA", ranking: 6, price: "$5,500", type: "Community College" },
  { id: 159, name: "Pasadena City College", location: "Pasadena, CA", ranking: 7, price: "$5,500", type: "Community College" },
  { id: 160, name: "Valencia College", location: "Orlando, FL", ranking: 8, price: "$5,000", type: "Community College" },
  { id: 161, name: "Austin Community College", location: "Austin, TX", ranking: 9, price: "$5,000", type: "Community College" },
  { id: 162, name: "Kirkwood Community College", location: "Cedar Rapids, IA", ranking: 10, price: "$4,500", type: "Community College" },
  { id: 163, name: "Salt Lake Community College", location: "Salt Lake City, UT", ranking: 11, price: "$4,500", type: "Community College" },
  { id: 164, name: "Borough of Manhattan Community College – CUNY", location: "New York, NY", ranking: 12, price: "$5,500", type: "Community College" },
  { id: 165, name: "Portland Community College", location: "Portland, OR", ranking: 13, price: "$5,000", type: "Community College" },
  { id: 166, name: "LaGuardia Community College – CUNY", location: "Queens, NY", ranking: 14, price: "$5,500", type: "Community College" },
  { id: 167, name: "El Camino College", location: "Torrance, CA", ranking: 15, price: "$5,000", type: "Community College" },
  { id: 168, name: "De Anza College", location: "Cupertino, CA", ranking: 16, price: "$5,500", type: "Community College" },
  { id: 169, name: "Foothill College", location: "Los Altos Hills, CA", ranking: 17, price: "$5,500", type: "Community College" },
  { id: 170, name: "Montgomery College", location: "Rockville, MD", ranking: 18, price: "$5,000", type: "Community College" },
  { id: 171, name: "College of DuPage", location: "Glen Ellyn, IL", ranking: 19, price: "$5,000", type: "Community College" },
  { id: 172, name: "Ivy Tech Community College", location: "Indianapolis, IN", ranking: 20, price: "$4,500", type: "Community College" },
  { id: 173, name: "Sinclair Community College", location: "Dayton, OH", ranking: 21, price: "$4,500", type: "Community College" },
  { id: 174, name: "Macomb Community College", location: "Warren, MI", ranking: 22, price: "$4,500", type: "Community College" },
  { id: 175, name: "Washtenaw Community College", location: "Ann Arbor, MI", ranking: 23, price: "$4,500", type: "Community College" },
  { id: 176, name: "North Central Texas College", location: "Gainesville, TX", ranking: 24, price: "$4,500", type: "Community College" },
  { id: 177, name: "Tarrant County College", location: "Fort Worth, TX", ranking: 25, price: "$4,500", type: "Community College" },
  { id: 178, name: "Hillsborough Community College", location: "Tampa, FL", ranking: 26, price: "$4,500", type: "Community College" },
  { id: 179, name: "Broward College", location: "Fort Lauderdale, FL", ranking: 27, price: "$4,500", type: "Community College" },
  { id: 180, name: "Palm Beach State College", location: "Lake Worth, FL", ranking: 28, price: "$4,500", type: "Community College" },
  { id: 181, name: "Orange Coast College", location: "Costa Mesa, CA", ranking: 29, price: "$5,000", type: "Community College" },
  { id: 182, name: "Saddleback College", location: "Mission Viejo, CA", ranking: 30, price: "$5,000", type: "Community College" },
  { id: 183, name: "Cypress College", location: "Cypress, CA", ranking: 31, price: "$5,000", type: "Community College" },
  { id: 184, name: "Cerritos College", location: "Norwalk, CA", ranking: 32, price: "$5,000", type: "Community College" },
  { id: 185, name: "Fullerton College", location: "Fullerton, CA", ranking: 33, price: "$5,000", type: "Community College" },
  { id: 186, name: "Mt. San Antonio College", location: "Walnut, CA", ranking: 34, price: "$5,000", type: "Community College" },
  { id: 187, name: "Riverside City College", location: "Riverside, CA", ranking: 35, price: "$5,000", type: "Community College" },
  { id: 188, name: "Chaffey College", location: "Rancho Cucamonga, CA", ranking: 36, price: "$5,000", type: "Community College" },
  { id: 189, name: "San Diego Mesa College", location: "San Diego, CA", ranking: 37, price: "$5,000", type: "Community College" },
  { id: 190, name: "Mesa Community College", location: "Mesa, AZ", ranking: 38, price: "$4,500", type: "Community College" },
  { id: 191, name: "Pima Community College", location: "Tucson, AZ", ranking: 39, price: "$4,500", type: "Community College" },
  { id: 192, name: "Glendale Community College", location: "Glendale, CA", ranking: 40, price: "$5,000", type: "Community College" },
  { id: 193, name: "Rio Hondo College", location: "Whittier, CA", ranking: 41, price: "$5,000", type: "Community College" },
  { id: 194, name: "East Los Angeles College", location: "Monterey Park, CA", ranking: 42, price: "$5,000", type: "Community College" },
  { id: 195, name: "Los Angeles City College", location: "Los Angeles, CA", ranking: 43, price: "$5,000", type: "Community College" },
  { id: 196, name: "Los Angeles Valley College", location: "Valley Glen, CA", ranking: 44, price: "$5,000", type: "Community College" },
  { id: 197, name: "Santa Barbara City College", location: "Santa Barbara, CA", ranking: 45, price: "$5,500", type: "Community College" },
  { id: 198, name: "College of San Mateo", location: "San Mateo, CA", ranking: 46, price: "$5,500", type: "Community College" },
  { id: 199, name: "Cañada College", location: "Redwood City, CA", ranking: 47, price: "$5,500", type: "Community College" },
  { id: 200, name: "Diablo Valley College", location: "Pleasant Hill, CA", ranking: 48, price: "$5,500", type: "Community College" },
  { id: 201, name: "Fresno City College", location: "Fresno, CA", ranking: 49, price: "$5,000", type: "Community College" },
  { id: 202, name: "Bakersfield College", location: "Bakersfield, CA", ranking: 50, price: "$5,000", type: "Community College" },
  { id: 203, name: "Modesto Junior College", location: "Modesto, CA", ranking: 51, price: "$5,000", type: "Community College" },
  { id: 204, name: "Long Beach City College", location: "Long Beach, CA", ranking: 52, price: "$5,000", type: "Community College" },
  { id: 205, name: "Los Angeles Pierce College", location: "Woodland Hills, CA", ranking: 53, price: "$5,000", type: "Community College" },
  { id: 206, name: "Cabrillo College", location: "Aptos, CA", ranking: 54, price: "$5,000", type: "Community College" },
  { id: 207, name: "Palomar College", location: "San Marcos, CA", ranking: 55, price: "$5,000", type: "Community College" },
  { id: 208, name: "Grossmont College", location: "El Cajon, CA", ranking: 56, price: "$5,000", type: "Community College" },
  { id: 209, name: "MiraCosta College", location: "Oceanside, CA", ranking: 57, price: "$5,000", type: "Community College" },
  { id: 210, name: "Ohlone College", location: "Fremont, CA", ranking: 58, price: "$5,500", type: "Community College" },
  { id: 211, name: "Laney College", location: "Oakland, CA", ranking: 59, price: "$5,500", type: "Community College" },
  { id: 212, name: "Merritt College", location: "Oakland, CA", ranking: 60, price: "$5,500", type: "Community College" },
  { id: 213, name: "Skyline College", location: "San Bruno, CA", ranking: 61, price: "$5,500", type: "Community College" },
  { id: 214, name: "West Valley College", location: "Saratoga, CA", ranking: 62, price: "$5,500", type: "Community College" },
  { id: 215, name: "Evergreen Valley College", location: "San Jose, CA", ranking: 63, price: "$5,500", type: "Community College" },
  { id: 216, name: "Solano Community College", location: "Fairfield, CA", ranking: 64, price: "$5,500", type: "Community College" },
  { id: 217, name: "Ventura College", location: "Ventura, CA", ranking: 65, price: "$5,000", type: "Community College" },
  { id: 218, name: "Moorpark College", location: "Moorpark, CA", ranking: 66, price: "$5,000", type: "Community College" },
  { id: 219, name: "Oxnard College", location: "Oxnard, CA", ranking: 67, price: "$5,000", type: "Community College" },
  { id: 220, name: "Allan Hancock College", location: "Santa Maria, CA", ranking: 68, price: "$5,000", type: "Community College" },
  { id: 221, name: "Monterey Peninsula College", location: "Monterey, CA", ranking: 69, price: "$5,000", type: "Community College" },
  { id: 222, name: "Hartnell College", location: "Salinas, CA", ranking: 70, price: "$5,000", type: "Community College" },
  { id: 223, name: "College of the Desert", location: "Palm Desert, CA", ranking: 71, price: "$5,000", type: "Community College" },
  { id: 224, name: "Antelope Valley College", location: "Lancaster, CA", ranking: 72, price: "$5,000", type: "Community College" },
  { id: 225, name: "Los Medanos College", location: "Pittsburg, CA", ranking: 73, price: "$5,500", type: "Community College" },
  { id: 226, name: "San Joaquin Delta College", location: "Stockton, CA", ranking: 74, price: "$5,000", type: "Community College" },
  { id: 227, name: "Butte College", location: "Oroville, CA", ranking: 75, price: "$5,000", type: "Community College" },
  { id: 228, name: "Shasta College", location: "Redding, CA", ranking: 76, price: "$5,000", type: "Community College" },
  { id: 229, name: "Sierra College", location: "Rocklin, CA", ranking: 77, price: "$5,000", type: "Community College" },
  { id: 230, name: "American River College", location: "Sacramento, CA", ranking: 78, price: "$5,000", type: "Community College" },
  { id: 231, name: "Sacramento City College", location: "Sacramento, CA", ranking: 79, price: "$5,000", type: "Community College" },
  { id: 232, name: "Cosumnes River College", location: "Sacramento, CA", ranking: 80, price: "$5,000", type: "Community College" },
  { id: 233, name: "San Jose City College", location: "San Jose, CA", ranking: 81, price: "$5,500", type: "Community College" },
  { id: 234, name: "City College of New York – CUNY", location: "New York, NY", ranking: 82, price: "$5,500", type: "Community College" },
  { id: 235, name: "Kingsborough Community College – CUNY", location: "Brooklyn, NY", ranking: 83, price: "$5,500", type: "Community College" },
  { id: 236, name: "Queensborough Community College – CUNY", location: "Bayside, NY", ranking: 84, price: "$5,500", type: "Community College" },
  { id: 237, name: "Bronx Community College – CUNY", location: "Bronx, NY", ranking: 85, price: "$5,500", type: "Community College" },
  { id: 238, name: "Hostos Community College – CUNY", location: "Bronx, NY", ranking: 86, price: "$5,500", type: "Community College" },
  { id: 239, name: "Rockland Community College", location: "Suffern, NY", ranking: 87, price: "$5,000", type: "Community College" },
  { id: 240, name: "Nassau Community College", location: "Garden City, NY", ranking: 88, price: "$5,500", type: "Community College" },
  { id: 241, name: "Suffolk County Community College", location: "Selden, NY", ranking: 89, price: "$5,500", type: "Community College" },
  { id: 242, name: "Westchester Community College", location: "Valhalla, NY", ranking: 90, price: "$5,500", type: "Community College" },
  { id: 243, name: "Monroe Community College", location: "Rochester, NY", ranking: 91, price: "$5,000", type: "Community College" },
  { id: 244, name: "Onondaga Community College", location: "Syracuse, NY", ranking: 92, price: "$5,000", type: "Community College" },
  { id: 245, name: "Hudson Valley Community College", location: "Troy, NY", ranking: 93, price: "$5,000", type: "Community College" },
  { id: 246, name: "Erie Community College", location: "Buffalo, NY", ranking: 94, price: "$5,000", type: "Community College" },
  { id: 247, name: "Corning Community College", location: "Corning, NY", ranking: 95, price: "$4,500", type: "Community College" },
  { id: 248, name: "Finger Lakes Community College", location: "Canandaigua, NY", ranking: 96, price: "$4,500", type: "Community College" },
  { id: 249, name: "Schenectady County Community College", location: "Schenectady, NY", ranking: 97, price: "$5,000", type: "Community College" },
  { id: 250, name: "Tompkins Cortland Community College", location: "Dryden, NY", ranking: 98, price: "$4,500", type: "Community College" },
  { id: 251, name: "Dutchess Community College", location: "Poughkeepsie, NY", ranking: 99, price: "$5,000", type: "Community College" },
  { id: 252, name: "Mohawk Valley Community College", location: "Utica, NY", ranking: 100, price: "$4,500", type: "Community College" },
  
  // Additional Canadian Universities (26-100)
  { id: 253, name: "Brock University", location: "St. Catharines, ON, Canada", ranking: 24, price: "$9,500", country: "Canada" },
  { id: 254, name: "Trent University", location: "Peterborough, ON, Canada", ranking: 25, price: "$9,500", country: "Canada" },
  { id: 255, name: "Wilfrid Laurier University", location: "Waterloo, ON, Canada", ranking: 26, price: "$9,500", country: "Canada" },
  { id: 256, name: "Lakehead University", location: "Thunder Bay, ON, Canada", ranking: 27, price: "$9,000", country: "Canada" },
  { id: 257, name: "University of Regina", location: "Regina, SK, Canada", ranking: 28, price: "$9,000", country: "Canada" },
  { id: 258, name: "Laurentian University", location: "Sudbury, ON, Canada", ranking: 30, price: "$9,000", country: "Canada" },
  { id: 259, name: "University of Northern British Columbia", location: "Prince George, BC, Canada", ranking: 31, price: "$9,000", country: "Canada" },
  { id: 260, name: "Acadia University", location: "Wolfville, NS, Canada", ranking: 32, price: "$9,000", country: "Canada" },
  { id: 261, name: "Bishop's University", location: "Sherbrooke, QC, Canada", ranking: 33, price: "$9,000", country: "Canada" },
  { id: 262, name: "Mount Allison University", location: "Sackville, NB, Canada", ranking: 34, price: "$9,000", country: "Canada" },
  { id: 263, name: "St. Francis Xavier University", location: "Antigonish, NS, Canada", ranking: 35, price: "$9,000", country: "Canada" },
  { id: 264, name: "University of Lethbridge", location: "Lethbridge, AB, Canada", ranking: 36, price: "$9,000", country: "Canada" },
  { id: 265, name: "Thompson Rivers University", location: "Kamloops, BC, Canada", ranking: 37, price: "$8,500", country: "Canada" },
  { id: 266, name: "Vancouver Island University", location: "Nanaimo, BC, Canada", ranking: 38, price: "$8,500", country: "Canada" },
  { id: 267, name: "Nipissing University", location: "North Bay, ON, Canada", ranking: 39, price: "$8,500", country: "Canada" },
  { id: 268, name: "Brandon University", location: "Brandon, MB, Canada", ranking: 40, price: "$8,500", country: "Canada" },
  { id: 269, name: "Cape Breton University", location: "Sydney, NS, Canada", ranking: 41, price: "$8,500", country: "Canada" },
  { id: 270, name: "University of Prince Edward Island", location: "Charlottetown, PE, Canada", ranking: 42, price: "$8,500", country: "Canada" },
  { id: 271, name: "Mount Saint Vincent University", location: "Halifax, NS, Canada", ranking: 43, price: "$8,500", country: "Canada" },
  { id: 272, name: "Saint Mary's University", location: "Halifax, NS, Canada", ranking: 44, price: "$8,500", country: "Canada" },
  { id: 273, name: "Université de Moncton", location: "Moncton, NB, Canada", ranking: 45, price: "$9,000", country: "Canada" },
  { id: 274, name: "Université de Sherbrooke", location: "Sherbrooke, QC, Canada", ranking: 46, price: "$9,500", country: "Canada" },
  { id: 275, name: "École Polytechnique de Montréal", location: "Montreal, QC, Canada", ranking: 47, price: "$10,000", country: "Canada" },
  { id: 276, name: "HEC Montréal", location: "Montreal, QC, Canada", ranking: 48, price: "$10,000", country: "Canada" },
  { id: 277, name: "École de technologie supérieure", location: "Montreal, QC, Canada", ranking: 49, price: "$9,500", country: "Canada" },
  { id: 278, name: "Royal Military College of Canada", location: "Kingston, ON, Canada", ranking: 50, price: "$10,000", country: "Canada" },
  { id: 279, name: "University of Winnipeg", location: "Winnipeg, MB, Canada", ranking: 51, price: "$8,500", country: "Canada" },
  { id: 280, name: "Algoma University", location: "Sault Ste. Marie, ON, Canada", ranking: 52, price: "$8,500", country: "Canada" },
  { id: 281, name: "Université du Québec à Montréal (UQAM)", location: "Montreal, QC, Canada", ranking: 53, price: "$9,000", country: "Canada" },
  { id: 282, name: "Université du Québec à Trois-Rivières", location: "Trois-Rivières, QC, Canada", ranking: 54, price: "$8,500", country: "Canada" },
  { id: 283, name: "Université du Québec à Chicoutimi", location: "Chicoutimi, QC, Canada", ranking: 55, price: "$8,500", country: "Canada" },
  { id: 284, name: "Université du Québec en Outaouais", location: "Gatineau, QC, Canada", ranking: 56, price: "$8,500", country: "Canada" },
  { id: 285, name: "Université du Québec à Rimouski", location: "Rimouski, QC, Canada", ranking: 57, price: "$8,500", country: "Canada" },
  { id: 286, name: "Université du Québec en Abitibi-Témiscamingue", location: "Rouyn-Noranda, QC, Canada", ranking: 58, price: "$8,500", country: "Canada" },
  { id: 287, name: "Université de Hearst", location: "Hearst, ON, Canada", ranking: 60, price: "$8,500", country: "Canada" },
  { id: 288, name: "Université Sainte-Anne", location: "Church Point, NS, Canada", ranking: 61, price: "$8,500", country: "Canada" },
  { id: 289, name: "Ontario Tech University", location: "Oshawa, ON, Canada", ranking: 62, price: "$9,000", country: "Canada" },
  { id: 290, name: "MacEwan University", location: "Edmonton, AB, Canada", ranking: 63, price: "$9,000", country: "Canada" },
  { id: 291, name: "Athabasca University", location: "Athabasca, AB, Canada", ranking: 64, price: "$8,500", country: "Canada" },
  { id: 292, name: "Redeemer University", location: "Ancaster, ON, Canada", ranking: 65, price: "$8,500", country: "Canada" },
  { id: 293, name: "Trinity Western University", location: "Langley, BC, Canada", ranking: 66, price: "$8,500", country: "Canada" },
  { id: 294, name: "Canadian Mennonite University", location: "Winnipeg, MB, Canada", ranking: 67, price: "$8,500", country: "Canada" },
  { id: 295, name: "Booth University College", location: "Winnipeg, MB, Canada", ranking: 68, price: "$8,500", country: "Canada" },
  { id: 296, name: "St. Thomas University", location: "Fredericton, NB, Canada", ranking: 69, price: "$8,500", country: "Canada" },
  { id: 297, name: "King's University", location: "Edmonton, AB, Canada", ranking: 70, price: "$8,500", country: "Canada" },
  { id: 298, name: "University of Saint Paul", location: "Ottawa, ON, Canada", ranking: 78, price: "$8,500", country: "Canada" },
  { id: 299, name: "Quest University", location: "Squamish, BC, Canada", ranking: 80, price: "$8,500", country: "Canada" },
  { id: 300, name: "Yukon University", location: "Whitehorse, YT, Canada", ranking: 81, price: "$8,000", country: "Canada" },
  { id: 301, name: "Aurora College", location: "Yellowknife, NT, Canada", ranking: 82, price: "$8,000", country: "Canada" },
  { id: 302, name: "Nunavut Arctic College", location: "Iqaluit, NU, Canada", ranking: 83, price: "$8,000", country: "Canada" },
  { id: 303, name: "Université TÉLUQ", location: "Quebec City, QC, Canada", ranking: 85, price: "$8,500", country: "Canada" },
  { id: 304, name: "First Nations University of Canada", location: "Regina, SK, Canada", ranking: 87, price: "$8,500", country: "Canada" },
  { id: 305, name: "Adler University", location: "Vancouver, BC, Canada", ranking: 89, price: "$8,500", country: "Canada" },
  { id: 306, name: "Ambrose University", location: "Calgary, AB, Canada", ranking: 91, price: "$8,500", country: "Canada" },
  { id: 307, name: "Providence University College", location: "Otterburne, MB, Canada", ranking: 92, price: "$8,500", country: "Canada" },
  { id: 308, name: "Crandall University", location: "Moncton, NB, Canada", ranking: 93, price: "$8,500", country: "Canada" },
  { id: 385, name: "King's University College", location: "London, ON, Canada", ranking: 71, price: "$8,500", country: "Canada" },
  { id: 386, name: "Huron University College", location: "London, ON, Canada", ranking: 72, price: "$8,500", country: "Canada" },
  { id: 387, name: "Brescia University College", location: "London, ON, Canada", ranking: 73, price: "$8,500", country: "Canada" },
  { id: 388, name: "Campion College", location: "Regina, SK, Canada", ranking: 74, price: "$8,500", country: "Canada" },
  { id: 389, name: "St. Paul's University College", location: "Waterloo, ON, Canada", ranking: 75, price: "$8,500", country: "Canada" },
  { id: 390, name: "Renison University College", location: "Waterloo, ON, Canada", ranking: 76, price: "$8,500", country: "Canada" },
  { id: 391, name: "Conrad Grebel University College", location: "Waterloo, ON, Canada", ranking: 77, price: "$8,500", country: "Canada" },
  { id: 392, name: "Collège Universitaire Dominicain", location: "Ottawa, ON, Canada", ranking: 79, price: "$8,500", country: "Canada" },
  { id: 393, name: "St. Stephen's University", location: "St. Stephen, NB, Canada", ranking: 84, price: "$8,000", country: "Canada" },
  { id: 394, name: "Vancouver School of Theology", location: "Vancouver, BC, Canada", ranking: 90, price: "$8,500", country: "Canada" },
  { id: 395, name: "Kingswood University", location: "Sussex, NB, Canada", ranking: 94, price: "$8,000", country: "Canada" },
  { id: 396, name: "Horizon College & Seminary", location: "Saskatoon, SK, Canada", ranking: 95, price: "$8,000", country: "Canada" },
  { id: 397, name: "St. Mark's College", location: "Vancouver, BC, Canada", ranking: 96, price: "$8,500", country: "Canada" },
  { id: 398, name: "Corpus Christi College", location: "Vancouver, BC, Canada", ranking: 97, price: "$8,500", country: "Canada" },
  { id: 399, name: "Dominican University College", location: "Ottawa, ON, Canada", ranking: 98, price: "$8,500", country: "Canada" },
  
  // Canadian Colleges
  { id: 309, name: "Humber College", location: "Toronto, ON, Canada", ranking: 1, price: "$6,500", country: "Canada", type: "College" },
  { id: 310, name: "Seneca College", location: "Toronto, ON, Canada", ranking: 2, price: "$6,500", country: "Canada", type: "College" },
  { id: 311, name: "George Brown College", location: "Toronto, ON, Canada", ranking: 3, price: "$6,500", country: "Canada", type: "College" },
  { id: 312, name: "Centennial College", location: "Toronto, ON, Canada", ranking: 4, price: "$6,500", country: "Canada", type: "College" },
  { id: 313, name: "Sheridan College", location: "Oakville, ON, Canada", ranking: 5, price: "$6,500", country: "Canada", type: "College" },
  { id: 314, name: "Algonquin College", location: "Ottawa, ON, Canada", ranking: 6, price: "$6,000", country: "Canada", type: "College" },
  { id: 315, name: "Fanshawe College", location: "London, ON, Canada", ranking: 7, price: "$6,000", country: "Canada", type: "College" },
  { id: 316, name: "Conestoga College", location: "Kitchener, ON, Canada", ranking: 8, price: "$6,000", country: "Canada", type: "College" },
  { id: 317, name: "Durham College", location: "Oshawa, ON, Canada", ranking: 9, price: "$6,000", country: "Canada", type: "College" },
  { id: 318, name: "Mohawk College", location: "Hamilton, ON, Canada", ranking: 10, price: "$6,000", country: "Canada", type: "College" },
  { id: 319, name: "St. Clair College", location: "Windsor, ON, Canada", ranking: 11, price: "$6,000", country: "Canada", type: "College" },
  { id: 320, name: "Niagara College", location: "Welland, ON, Canada", ranking: 12, price: "$6,000", country: "Canada", type: "College" },
  { id: 321, name: "Georgian College", location: "Barrie, ON, Canada", ranking: 13, price: "$6,000", country: "Canada", type: "College" },
  { id: 322, name: "Fleming College", location: "Peterborough, ON, Canada", ranking: 14, price: "$6,000", country: "Canada", type: "College" },
  { id: 323, name: "Loyalist College", location: "Belleville, ON, Canada", ranking: 15, price: "$5,500", country: "Canada", type: "College" },
  { id: 324, name: "St. Lawrence College", location: "Kingston, ON, Canada", ranking: 16, price: "$5,500", country: "Canada", type: "College" },
  { id: 325, name: "Cambrian College", location: "Sudbury, ON, Canada", ranking: 17, price: "$5,500", country: "Canada", type: "College" },
  { id: 326, name: "Canadore College", location: "North Bay, ON, Canada", ranking: 18, price: "$5,500", country: "Canada", type: "College" },
  { id: 327, name: "Confederation College", location: "Thunder Bay, ON, Canada", ranking: 19, price: "$5,500", country: "Canada", type: "College" },
  { id: 328, name: "Northern College", location: "Timmins, ON, Canada", ranking: 20, price: "$5,500", country: "Canada", type: "College" },
  { id: 329, name: "College of the North Atlantic", location: "St. John's, NL, Canada", ranking: 21, price: "$5,500", country: "Canada", type: "College" },
  { id: 330, name: "Marine Institute", location: "St. John's, NL, Canada", ranking: 22, price: "$6,000", country: "Canada", type: "College" },
  { id: 331, name: "New Brunswick Community College (NBCC)", location: "Fredericton, NB, Canada", ranking: 26, price: "$5,500", country: "Canada", type: "College" },
  { id: 332, name: "Collège communautaire du Nouveau-Brunswick (CCNB)", location: "Edmundston, NB, Canada", ranking: 27, price: "$5,500", country: "Canada", type: "College" },
  { id: 333, name: "Holland College", location: "Charlottetown, PE, Canada", ranking: 29, price: "$5,500", country: "Canada", type: "College" },
  { id: 334, name: "Nova Scotia Community College (NSCC)", location: "Halifax, NS, Canada", ranking: 31, price: "$5,500", country: "Canada", type: "College" },
  { id: 335, name: "Cégep de Sainte-Foy", location: "Quebec City, QC, Canada", ranking: 33, price: "$6,000", country: "Canada", type: "College" },
  { id: 336, name: "Cégep de Garneau", location: "Quebec City, QC, Canada", ranking: 34, price: "$6,000", country: "Canada", type: "College" },
  { id: 337, name: "Dawson College", location: "Montreal, QC, Canada", ranking: 35, price: "$6,000", country: "Canada", type: "College" },
  { id: 338, name: "Vanier College", location: "Montreal, QC, Canada", ranking: 36, price: "$6,000", country: "Canada", type: "College" },
  { id: 339, name: "John Abbott College", location: "Sainte-Anne-de-Bellevue, QC, Canada", ranking: 37, price: "$6,000", country: "Canada", type: "College" },
  { id: 340, name: "Cégep André-Laurendeau", location: "Montreal, QC, Canada", ranking: 38, price: "$5,500", country: "Canada", type: "College" },
  { id: 341, name: "Cégep du Vieux Montréal", location: "Montreal, QC, Canada", ranking: 39, price: "$5,500", country: "Canada", type: "College" },
  { id: 342, name: "Cégep Marie-Victorin", location: "Montreal, QC, Canada", ranking: 40, price: "$5,500", country: "Canada", type: "College" },
  { id: 343, name: "Collège LaSalle", location: "Montreal, QC, Canada", ranking: 41, price: "$6,500", country: "Canada", type: "College" },
  { id: 344, name: "Herzing College", location: "Montreal, QC, Canada", ranking: 42, price: "$6,000", country: "Canada", type: "College" },
  { id: 345, name: "CDI College", location: "Toronto, ON, Canada", ranking: 43, price: "$6,000", country: "Canada", type: "College" },
  { id: 346, name: "Vancouver Community College", location: "Vancouver, BC, Canada", ranking: 45, price: "$6,500", country: "Canada", type: "College" },
  { id: 347, name: "Douglas College", location: "New Westminster, BC, Canada", ranking: 46, price: "$6,500", country: "Canada", type: "College" },
  { id: 348, name: "Langara College", location: "Vancouver, BC, Canada", ranking: 47, price: "$6,500", country: "Canada", type: "College" },
  { id: 349, name: "Camosun College", location: "Victoria, BC, Canada", ranking: 48, price: "$6,000", country: "Canada", type: "College" },
  { id: 350, name: "Okanagan College", location: "Kelowna, BC, Canada", ranking: 49, price: "$6,000", country: "Canada", type: "College" },
  { id: 351, name: "Selkirk College", location: "Castlegar, BC, Canada", ranking: 50, price: "$5,500", country: "Canada", type: "College" },
  { id: 352, name: "College of the Rockies", location: "Cranbrook, BC, Canada", ranking: 51, price: "$5,500", country: "Canada", type: "College" },
  { id: 353, name: "Northern Lights College", location: "Dawson Creek, BC, Canada", ranking: 52, price: "$5,500", country: "Canada", type: "College" },
  { id: 354, name: "North Island College", location: "Courtenay, BC, Canada", ranking: 53, price: "$5,500", country: "Canada", type: "College" },
  { id: 355, name: "Coast Mountain College", location: "Terrace, BC, Canada", ranking: 54, price: "$5,500", country: "Canada", type: "College" },
  { id: 356, name: "SAIT Polytechnic", location: "Calgary, AB, Canada", ranking: 58, price: "$6,500", country: "Canada", type: "College" },
  { id: 357, name: "NAIT", location: "Edmonton, AB, Canada", ranking: 59, price: "$6,500", country: "Canada", type: "College" },
  { id: 358, name: "Bow Valley College", location: "Calgary, AB, Canada", ranking: 60, price: "$6,000", country: "Canada", type: "College" },
  { id: 359, name: "Medicine Hat College", location: "Medicine Hat, AB, Canada", ranking: 61, price: "$5,500", country: "Canada", type: "College" },
  { id: 360, name: "Lethbridge College", location: "Lethbridge, AB, Canada", ranking: 62, price: "$5,500", country: "Canada", type: "College" },
  { id: 361, name: "NorQuest College", location: "Edmonton, AB, Canada", ranking: 63, price: "$5,500", country: "Canada", type: "College" },
  { id: 362, name: "Red Deer Polytechnic", location: "Red Deer, AB, Canada", ranking: 64, price: "$5,500", country: "Canada", type: "College" },
  { id: 363, name: "Saskatchewan Polytechnic", location: "Saskatoon, SK, Canada", ranking: 66, price: "$6,000", country: "Canada", type: "College" },
  { id: 364, name: "Parkland College", location: "Melville, SK, Canada", ranking: 68, price: "$5,000", country: "Canada", type: "College" },
  { id: 365, name: "Carlton Trail College", location: "Humboldt, SK, Canada", ranking: 69, price: "$5,000", country: "Canada", type: "College" },
  { id: 366, name: "Southeast College", location: "Weyburn, SK, Canada", ranking: 70, price: "$5,000", country: "Canada", type: "College" },
  { id: 367, name: "North West College", location: "North Battleford, SK, Canada", ranking: 71, price: "$5,000", country: "Canada", type: "College" },
  { id: 368, name: "Great Plains College", location: "Swift Current, SK, Canada", ranking: 72, price: "$5,000", country: "Canada", type: "College" },
  { id: 369, name: "Lakeland College", location: "Vermilion, AB, Canada", ranking: 73, price: "$5,500", country: "Canada", type: "College" },
  { id: 370, name: "Olds College of Agriculture & Tech", location: "Olds, AB, Canada", ranking: 74, price: "$5,500", country: "Canada", type: "College" },
  { id: 371, name: "Manitoba Institute of Trades and Technology (MITT)", location: "Winnipeg, MB, Canada", ranking: 75, price: "$5,500", country: "Canada", type: "College" },
  { id: 372, name: "Assiniboine Community College", location: "Brandon, MB, Canada", ranking: 76, price: "$5,500", country: "Canada", type: "College" },
  { id: 373, name: "Red River College Polytechnic", location: "Winnipeg, MB, Canada", ranking: 77, price: "$6,000", country: "Canada", type: "College" },
  { id: 374, name: "Collège Ahuntsic", location: "Montreal, QC, Canada", ranking: 84, price: "$5,500", country: "Canada", type: "College" },
  { id: 375, name: "Collège Maisonneuve", location: "Montreal, QC, Canada", ranking: 85, price: "$5,500", country: "Canada", type: "College" },
  { id: 376, name: "Collège Rosemont", location: "Montreal, QC, Canada", ranking: 86, price: "$5,500", country: "Canada", type: "College" },
  { id: 377, name: "Cégep Lionel-Groulx", location: "Sainte-Thérèse, QC, Canada", ranking: 87, price: "$5,500", country: "Canada", type: "College" },
  { id: 378, name: "Collège Montmorency", location: "Laval, QC, Canada", ranking: 88, price: "$5,500", country: "Canada", type: "College" },
  { id: 379, name: "Cégep de l'Outaouais", location: "Gatineau, QC, Canada", ranking: 89, price: "$5,500", country: "Canada", type: "College" },
  { id: 380, name: "Cégep de Trois-Rivières", location: "Trois-Rivières, QC, Canada", ranking: 90, price: "$5,500", country: "Canada", type: "College" },
  { id: 381, name: "Collège Champlain", location: "Saint-Lambert, QC, Canada", ranking: 91, price: "$5,500", country: "Canada", type: "College" },
  { id: 382, name: "Collège de Bois-de-Boulogne", location: "Montreal, QC, Canada", ranking: 92, price: "$5,500", country: "Canada", type: "College" },
  { id: 383, name: "Collège Laflèche", location: "Trois-Rivières, QC, Canada", ranking: 93, price: "$5,500", country: "Canada", type: "College" },
  { id: 384, name: "Institut Teccart", location: "Montreal, QC, Canada", ranking: 95, price: "$5,500", country: "Canada", type: "College" },
  
  // Top EU Universities
  { id: 400, name: "ETH Zurich", location: "Zurich, Switzerland", ranking: 1, price: "$15,000", country: "EU" },
  { id: 401, name: "University of Copenhagen", location: "Copenhagen, Denmark", ranking: 2, price: "$13,000", country: "EU" },
  { id: 402, name: "LMU Munich", location: "Munich, Germany", ranking: 3, price: "$14,000", country: "EU" },
  { id: 403, name: "Heidelberg University", location: "Heidelberg, Germany", ranking: 4, price: "$14,000", country: "EU" },
  { id: 404, name: "University of Amsterdam", location: "Amsterdam, Netherlands", ranking: 5, price: "$13,000", country: "EU" },
  { id: 405, name: "Utrecht University", location: "Utrecht, Netherlands", ranking: 6, price: "$13,000", country: "EU" },
  { id: 406, name: "Delft University of Technology", location: "Delft, Netherlands", ranking: 7, price: "$13,000", country: "EU" },
  { id: 407, name: "KU Leuven", location: "Leuven, Belgium", ranking: 8, price: "$12,000", country: "EU" },
  { id: 408, name: "University of Vienna", location: "Vienna, Austria", ranking: 9, price: "$12,000", country: "EU" },
  { id: 409, name: "University of Helsinki", location: "Helsinki, Finland", ranking: 10, price: "$12,000", country: "EU" },
  { id: 410, name: "Technical University of Munich", location: "Munich, Germany", ranking: 11, price: "$14,000", country: "EU" },
  { id: 411, name: "École Polytechnique", location: "Paris, France", ranking: 12, price: "$14,000", country: "EU" },
  { id: 412, name: "Sorbonne University", location: "Paris, France", ranking: 13, price: "$14,000", country: "EU" },
  { id: 413, name: "University of Barcelona", location: "Barcelona, Spain", ranking: 14, price: "$11,000", country: "EU" },
  { id: 414, name: "University of Zurich", location: "Zurich, Switzerland", ranking: 16, price: "$14,000", country: "EU" },
  { id: 415, name: "University of Groningen", location: "Groningen, Netherlands", ranking: 17, price: "$12,000", country: "EU" },
  { id: 416, name: "University of Geneva", location: "Geneva, Switzerland", ranking: 18, price: "$14,000", country: "EU" },
  { id: 417, name: "University of Padua", location: "Padua, Italy", ranking: 19, price: "$11,000", country: "EU" },
  { id: 418, name: "University of Milan", location: "Milan, Italy", ranking: 20, price: "$11,000", country: "EU" },
  { id: 419, name: "Sapienza University of Rome", location: "Rome, Italy", ranking: 21, price: "$11,000", country: "EU" },
  { id: 420, name: "Politecnico di Milano", location: "Milan, Italy", ranking: 22, price: "$12,000", country: "EU" },
  { id: 421, name: "University of Bologna", location: "Bologna, Italy", ranking: 23, price: "$11,000", country: "EU" },
  { id: 422, name: "University of Lausanne", location: "Lausanne, Switzerland", ranking: 24, price: "$13,000", country: "EU" },
  { id: 423, name: "Trinity College Dublin", location: "Dublin, Ireland", ranking: 25, price: "$12,000", country: "EU" },
  { id: 424, name: "University of Antwerp", location: "Antwerp, Belgium", ranking: 27, price: "$11,000", country: "EU" },
  { id: 425, name: "University of Ghent", location: "Ghent, Belgium", ranking: 28, price: "$11,000", country: "EU" },
  { id: 426, name: "University of Oslo", location: "Oslo, Norway", ranking: 29, price: "$13,000", country: "EU" },
  { id: 427, name: "University of Bergen", location: "Bergen, Norway", ranking: 30, price: "$12,000", country: "EU" },
  { id: 428, name: "University of Stockholm", location: "Stockholm, Sweden", ranking: 31, price: "$12,000", country: "EU" },
  { id: 429, name: "Karolinska Institute", location: "Stockholm, Sweden", ranking: 32, price: "$13,000", country: "EU" },
  { id: 430, name: "Uppsala University", location: "Uppsala, Sweden", ranking: 33, price: "$12,000", country: "EU" },
  { id: 431, name: "Lund University", location: "Lund, Sweden", ranking: 34, price: "$12,000", country: "EU" },
  { id: 432, name: "Technical University of Denmark (DTU)", location: "Lyngby, Denmark", ranking: 36, price: "$12,000", country: "EU" },
  { id: 433, name: "University of Warsaw", location: "Warsaw, Poland", ranking: 37, price: "$9,500", country: "EU" },
  { id: 434, name: "University of Wrocław", location: "Wrocław, Poland", ranking: 38, price: "$9,500", country: "EU" },
  { id: 435, name: "University of Turku", location: "Turku, Finland", ranking: 40, price: "$11,000", country: "EU" },
  { id: 436, name: "University of Freiburg", location: "Freiburg, Germany", ranking: 41, price: "$13,000", country: "EU" },
  { id: 437, name: "University of Tübingen", location: "Tübingen, Germany", ranking: 42, price: "$13,000", country: "EU" },
  { id: 438, name: "University of Stuttgart", location: "Stuttgart, Germany", ranking: 43, price: "$13,000", country: "EU" },
  { id: 439, name: "RWTH Aachen University", location: "Aachen, Germany", ranking: 44, price: "$13,000", country: "EU" },
  { id: 440, name: "University of Leipzig", location: "Leipzig, Germany", ranking: 45, price: "$12,000", country: "EU" },
  { id: 441, name: "Autonomous University of Barcelona", location: "Barcelona, Spain", ranking: 48, price: "$11,000", country: "EU" },
  { id: 442, name: "Complutense University of Madrid", location: "Madrid, Spain", ranking: 49, price: "$11,000", country: "EU" },
  { id: 443, name: "University of Granada", location: "Granada, Spain", ranking: 50, price: "$10,000", country: "EU" },
  { id: 444, name: "University of Valencia", location: "Valencia, Spain", ranking: 51, price: "$10,000", country: "EU" },
  { id: 445, name: "Polytechnic University of Valencia", location: "Valencia, Spain", ranking: 52, price: "$11,000", country: "EU" },
  { id: 446, name: "University of Salamanca", location: "Salamanca, Spain", ranking: 53, price: "$10,000", country: "EU" },
  { id: 447, name: "University of Seville", location: "Seville, Spain", ranking: 54, price: "$10,000", country: "EU" },
  { id: 448, name: "University of Porto", location: "Porto, Portugal", ranking: 55, price: "$10,000", country: "EU" },
  { id: 449, name: "University of Lisbon", location: "Lisbon, Portugal", ranking: 56, price: "$10,000", country: "EU" },
  { id: 450, name: "University of Coimbra", location: "Coimbra, Portugal", ranking: 57, price: "$10,000", country: "EU" },
  { id: 451, name: "University of Ljubljana", location: "Ljubljana, Slovenia", ranking: 58, price: "$9,500", country: "EU" },
  { id: 452, name: "University of Zagreb", location: "Zagreb, Croatia", ranking: 59, price: "$9,500", country: "EU" },
  { id: 453, name: "Charles University", location: "Prague, Czech Republic", ranking: 60, price: "$10,000", country: "EU" },
  { id: 454, name: "Czech Technical University", location: "Prague, Czech Republic", ranking: 61, price: "$10,000", country: "EU" },
  { id: 455, name: "Graz University of Technology", location: "Graz, Austria", ranking: 63, price: "$11,000", country: "EU" },
  { id: 456, name: "University of Innsbruck", location: "Innsbruck, Austria", ranking: 64, price: "$11,000", country: "EU" },
  { id: 457, name: "University of Sofia", location: "Sofia, Bulgaria", ranking: 65, price: "$8,500", country: "EU" },
  { id: 458, name: "University of Belgrade", location: "Belgrade, Serbia", ranking: 67, price: "$8,500", country: "EU" },
  { id: 459, name: "University of Bucharest", location: "Bucharest, Romania", ranking: 68, price: "$8,500", country: "EU" },
  { id: 460, name: "Babeș-Bolyai University", location: "Cluj-Napoca, Romania", ranking: 69, price: "$8,500", country: "EU" },
  { id: 461, name: "Jagiellonian University", location: "Krakow, Poland", ranking: 71, price: "$9,500", country: "EU" },
  { id: 462, name: "University of Malta", location: "Msida, Malta", ranking: 74, price: "$9,500", country: "EU" },
  { id: 463, name: "University of Cyprus", location: "Nicosia, Cyprus", ranking: 75, price: "$9,500", country: "EU" },
  { id: 464, name: "University of Iceland", location: "Reykjavik, Iceland", ranking: 76, price: "$11,000", country: "EU" },
  { id: 465, name: "Reykjavik University", location: "Reykjavik, Iceland", ranking: 77, price: "$11,000", country: "EU" },
  { id: 466, name: "University of Hamburg", location: "Hamburg, Germany", ranking: 79, price: "$12,000", country: "EU" },
  { id: 467, name: "University of Mannheim", location: "Mannheim, Germany", ranking: 80, price: "$12,000", country: "EU" },
  { id: 468, name: "University of Bonn", location: "Bonn, Germany", ranking: 81, price: "$12,000", country: "EU" },
  { id: 469, name: "University of Cologne", location: "Cologne, Germany", ranking: 82, price: "$12,000", country: "EU" },
  { id: 470, name: "University of Münster", location: "Münster, Germany", ranking: 83, price: "$12,000", country: "EU" },
  { id: 471, name: "Eindhoven University of Technology", location: "Eindhoven, Netherlands", ranking: 85, price: "$12,000", country: "EU" },
  { id: 472, name: "Radboud University", location: "Nijmegen, Netherlands", ranking: 86, price: "$12,000", country: "EU" },
  { id: 473, name: "Tilburg University", location: "Tilburg, Netherlands", ranking: 87, price: "$11,000", country: "EU" },
  { id: 474, name: "Vrije Universiteit Brussel", location: "Brussels, Belgium", ranking: 90, price: "$11,000", country: "EU" },
  { id: 475, name: "University of Liège", location: "Liège, Belgium", ranking: 91, price: "$10,000", country: "EU" },
  { id: 476, name: "University of Basel", location: "Basel, Switzerland", ranking: 94, price: "$13,000", country: "EU" },
  { id: 477, name: "EPFL", location: "Lausanne, Switzerland", ranking: 98, price: "$15,000", country: "EU" },
  { id: 478, name: "University of Paris (Paris-Saclay)", location: "Paris, France", ranking: 99, price: "$13,000", country: "EU" },
  
  // EU Technical / Applied Institutions
  { id: 479, name: "TU Berlin", location: "Berlin, Germany", ranking: 8, price: "$11,000", country: "EU", type: "Technical" },
  { id: 480, name: "TU Eindhoven", location: "Eindhoven, Netherlands", ranking: 9, price: "$11,000", country: "EU", type: "Technical" },
  { id: 481, name: "TU Wien", location: "Vienna, Austria", ranking: 10, price: "$11,000", country: "EU", type: "Technical" },
  { id: 482, name: "KTH Royal Institute of Technology", location: "Stockholm, Sweden", ranking: 6, price: "$11,000", country: "EU", type: "Technical" },
  { id: 483, name: "Chalmers University of Technology", location: "Gothenburg, Sweden", ranking: 7, price: "$11,000", country: "EU", type: "Technical" },
  { id: 484, name: "Politecnico di Torino", location: "Turin, Italy", ranking: 16, price: "$10,000", country: "EU", type: "Technical" },
  { id: 485, name: "Instituto Superior Técnico", location: "Lisbon, Portugal", ranking: 18, price: "$9,500", country: "EU", type: "Technical" },
  { id: 486, name: "TU Darmstadt", location: "Darmstadt, Germany", ranking: 15, price: "$11,000", country: "EU", type: "Technical" },
  { id: 487, name: "FH Aachen", location: "Aachen, Germany", ranking: 19, price: "$8,500", country: "EU", type: "Technical" },
  { id: 488, name: "FH Köln", location: "Cologne, Germany", ranking: 21, price: "$8,500", country: "EU", type: "Technical" },
  { id: 489, name: "FH Münster", location: "Münster, Germany", ranking: 22, price: "$8,500", country: "EU", type: "Technical" },
  { id: 490, name: "FH Dortmund", location: "Dortmund, Germany", ranking: 23, price: "$8,500", country: "EU", type: "Technical" },
  { id: 491, name: "FH Munich", location: "Munich, Germany", ranking: 25, price: "$9,000", country: "EU", type: "Technical" },
  { id: 492, name: "FH Karlsruhe", location: "Karlsruhe, Germany", ranking: 26, price: "$8,500", country: "EU", type: "Technical" },
  { id: 493, name: "FH Stuttgart", location: "Stuttgart, Germany", ranking: 27, price: "$8,500", country: "EU", type: "Technical" },
  { id: 494, name: "FH Bielefeld", location: "Bielefeld, Germany", ranking: 29, price: "$8,000", country: "EU", type: "Technical" },
  { id: 495, name: "FH Kaiserslautern", location: "Kaiserslautern, Germany", ranking: 30, price: "$8,000", country: "EU", type: "Technical" },
  { id: 496, name: "TU Hamburg", location: "Hamburg, Germany", ranking: 32, price: "$11,000", country: "EU", type: "Technical" },
  { id: 497, name: "TU Dresden", location: "Dresden, Germany", ranking: 33, price: "$11,000", country: "EU", type: "Technical" },
  { id: 498, name: "FH Lübeck", location: "Lübeck, Germany", ranking: 35, price: "$8,000", country: "EU", type: "Technical" },
  { id: 499, name: "Hochschule Pforzheim", location: "Pforzheim, Germany", ranking: 37, price: "$8,500", country: "EU", type: "Technical" },
  { id: 500, name: "Hochschule Bonn-Rhein-Sieg", location: "Bonn, Germany", ranking: 38, price: "$8,500", country: "EU", type: "Technical" },
  { id: 501, name: "Hochschule Darmstadt", location: "Darmstadt, Germany", ranking: 39, price: "$8,500", country: "EU", type: "Technical" },
  { id: 502, name: "Hochschule München", location: "Munich, Germany", ranking: 40, price: "$8,500", country: "EU", type: "Technical" },
  { id: 503, name: "TU Clausthal", location: "Clausthal, Germany", ranking: 41, price: "$10,000", country: "EU", type: "Technical" },
  { id: 504, name: "TU Braunschweig", location: "Braunschweig, Germany", ranking: 42, price: "$10,000", country: "EU", type: "Technical" },
  { id: 505, name: "FH Joanneum", location: "Graz, Austria", ranking: 46, price: "$8,500", country: "EU", type: "Technical" },
  { id: 506, name: "University of Applied Sciences Salzburg", location: "Salzburg, Austria", ranking: 47, price: "$8,500", country: "EU", type: "Technical" },
  { id: 507, name: "Vienna University of Applied Sciences", location: "Vienna, Austria", ranking: 48, price: "$9,000", country: "EU", type: "Technical" },
  { id: 508, name: "Hochschule Luzern", location: "Lucerne, Switzerland", ranking: 51, price: "$9,500", country: "EU", type: "Technical" },
  { id: 509, name: "FHNW", location: "Basel, Switzerland", ranking: 53, price: "$9,500", country: "EU", type: "Technical" },
  { id: 510, name: "Blekinge Institute of Technology", location: "Karlskrona, Sweden", ranking: 56, price: "$9,000", country: "EU", type: "Technical" },
  { id: 511, name: "Luleå University of Technology", location: "Luleå, Sweden", ranking: 57, price: "$9,000", country: "EU", type: "Technical" },
  { id: 512, name: "Hochschule Lübeck", location: "Lübeck, Germany", ranking: 80, price: "$8,000", country: "EU", type: "Technical" },
  { id: 513, name: "Hochschule Bielefeld", location: "Bielefeld, Germany", ranking: 81, price: "$8,000", country: "EU", type: "Technical" },
];

const Diplomas = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([4000, 15000]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Get unique countries
  const countries = Array.from(new Set(universities.map(u => u.country || "USA"))).sort();
  
  // Get unique types
  const types = Array.from(new Set(universities.map(u => u.type || "University"))).sort();

  const toggleCountry = (country: string) => {
    setSelectedCountries(prev =>
      prev.includes(country)
        ? prev.filter(c => c !== country)
        : [...prev, country]
    );
  };

  const toggleType = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const clearFilters = () => {
    setSelectedCountries([]);
    setSelectedTypes([]);
    setPriceRange([4000, 15000]);
    setSearchQuery("");
  };

  const filteredUniversities = universities.filter((uni) => {
    const matchesSearch = uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      uni.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const country = uni.country || "USA";
    const matchesCountry = selectedCountries.length === 0 || selectedCountries.includes(country);
    
    const type = uni.type || "University";
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(type);
    
    const price = parseInt(uni.price.replace(/[$,]/g, ""));
    const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
    
    return matchesSearch && matchesCountry && matchesType && matchesPrice;
  });

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
              500+ Top Global Universities & Colleges
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Premium authentic diplomas from the world's most prestigious institutions. 
              All diplomas are <span className="font-semibold text-primary">apostilled</span>, <span className="font-semibold text-primary">registered in school databases</span>, <span className="font-semibold text-primary">fully verifiable</span>, and contain <span className="font-semibold text-primary">all security features</span>.
              Complete package with transcript, thesis, student ID, and database registration. Fast 2-week delivery worldwide.
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

      {/* Mobile Filter Toggle */}
      <div className="container mx-auto px-4 py-4 lg:hidden">
        <Button 
          variant="outline" 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-full"
        >
          <Filter className="mr-2 h-4 w-4" />
          {sidebarOpen ? "Hide Filters" : "Show Filters"}
        </Button>
      </div>

      {/* Main Content with Sidebar */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className={`lg:col-span-1 ${sidebarOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="lg:sticky lg:top-24 space-y-6">
              <Card className="border-border/50 bg-card backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Filter className="h-5 w-5 text-primary" />
                      Filters
                    </CardTitle>
                    {(selectedCountries.length > 0 || selectedTypes.length > 0 || priceRange[0] !== 4000 || priceRange[1] !== 15000) && (
                      <Button variant="ghost" size="sm" onClick={clearFilters}>
                        Clear All
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Price Range Filter */}
                  <div>
                    <h3 className="font-semibold mb-3 text-foreground">Price Range</h3>
                    <div className="space-y-4">
                      <Slider
                        min={4000}
                        max={15000}
                        step={500}
                        value={priceRange}
                        onValueChange={setPriceRange}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>${priceRange[0].toLocaleString()}</span>
                        <span>${priceRange[1].toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Institution Type Filter */}
                  <div className="pt-4 border-t border-border/50">
                    <h3 className="font-semibold mb-3 text-foreground">Institution Type</h3>
                    <div className="space-y-3">
                      {types.map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={`type-${type}`}
                            checked={selectedTypes.includes(type)}
                            onCheckedChange={() => toggleType(type)}
                          />
                          <Label
                            htmlFor={`type-${type}`}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {type}
                            <span className="text-muted-foreground ml-1">
                              ({universities.filter(u => (u.type || "University") === type).length})
                            </span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Country Filter */}
                  <div className="pt-4 border-t border-border/50">
                    <h3 className="font-semibold mb-3 text-foreground">Country</h3>
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                      {countries.map((country) => (
                        <div key={country} className="flex items-center space-x-2">
                          <Checkbox
                            id={`country-${country}`}
                            checked={selectedCountries.includes(country)}
                            onCheckedChange={() => toggleCountry(country)}
                          />
                          <Label
                            htmlFor={`country-${country}`}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {country}
                            <span className="text-muted-foreground ml-1">
                              ({universities.filter(u => (u.country || "USA") === country).length})
                            </span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Active Filters Summary */}
                  {(selectedCountries.length > 0 || selectedTypes.length > 0 || priceRange[0] !== 4000 || priceRange[1] !== 15000) && (
                    <div className="pt-4 border-t border-border/50">
                      <h3 className="font-semibold mb-2 text-foreground">Active Filters</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedTypes.map(type => (
                          <Badge key={type} variant="secondary" className="cursor-pointer" onClick={() => toggleType(type)}>
                            {type} <X className="ml-1 h-3 w-3" />
                          </Badge>
                        ))}
                        {selectedCountries.map(country => (
                          <Badge key={country} variant="secondary" className="cursor-pointer" onClick={() => toggleCountry(country)}>
                            {country} <X className="ml-1 h-3 w-3" />
                          </Badge>
                        ))}
                        {(priceRange[0] !== 4000 || priceRange[1] !== 15000) && (
                          <Badge variant="secondary" className="cursor-pointer" onClick={() => setPriceRange([4000, 15000])}>
                            ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()} <X className="ml-1 h-3 w-3" />
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </aside>

          {/* Universities Grid */}
          <div className="lg:col-span-3">
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
                        <span><span className="font-semibold">Apostille certified</span> - Internationally recognized</span>
                      </div>
                      <div className="flex items-start gap-3 text-sm">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                        </div>
                        <span><span className="font-semibold">Database registered</span> - Fully verifiable</span>
                      </div>
                      <div className="flex items-start gap-3 text-sm">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                        </div>
                        <span><span className="font-semibold">All security features</span> - Holograms, watermarks, seals</span>
                      </div>
                      <div className="flex items-start gap-3 text-sm">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                        </div>
                        <span>Complete package with transcript & thesis</span>
                      </div>
                      <div className="flex items-start gap-3 text-sm">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                        </div>
                        <span>Fast 2-week delivery worldwide</span>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full group-hover:shadow-lg transition-all duration-300" 
                      size="lg"
                      onClick={() => navigate(`/diploma/${encodeURIComponent(university.name.replace(/ /g, '-').toLowerCase())}`)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Diplomas;
