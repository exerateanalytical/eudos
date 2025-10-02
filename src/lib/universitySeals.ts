// University Seals Import
import harvardSeal from "@/assets/university-seals/harvard.png";
import stanfordSeal from "@/assets/university-seals/stanford.png";
import mitSeal from "@/assets/university-seals/mit.png";
import berkeleySeal from "@/assets/university-seals/berkeley.png";
import princetonSeal from "@/assets/university-seals/princeton.png";
import yaleSeal from "@/assets/university-seals/yale.png";
import columbiaSeal from "@/assets/university-seals/columbia.png";
import chicagoSeal from "@/assets/university-seals/chicago.png";
import caltechSeal from "@/assets/university-seals/caltech.png";
import johnsHopkinsSeal from "@/assets/university-seals/johns-hopkins.png";
import upennSeal from "@/assets/university-seals/upenn.png";
import cornellSeal from "@/assets/university-seals/cornell.png";
import michiganSeal from "@/assets/university-seals/michigan.png";
import northwesternSeal from "@/assets/university-seals/northwestern.png";
import dukeSeal from "@/assets/university-seals/duke.png";
import uclaSeal from "@/assets/university-seals/ucla.png";
import brownSeal from "@/assets/university-seals/brown.png";
import dartmouthSeal from "@/assets/university-seals/dartmouth.png";
import vanderbiltSeal from "@/assets/university-seals/vanderbilt.png";
import riceSeal from "@/assets/university-seals/rice.png";
import wustlSeal from "@/assets/university-seals/wustl.png";
import notreDameSeal from "@/assets/university-seals/notre-dame.png";
import ucsdSeal from "@/assets/university-seals/ucsd.png";
import emorySeal from "@/assets/university-seals/emory.png";
import georgetownSeal from "@/assets/university-seals/georgetown.png";
import cmuSeal from "@/assets/university-seals/cmu.png";
import uscSeal from "@/assets/university-seals/usc.png";
import uvaSeal from "@/assets/university-seals/uva.png";
import nyuSeal from "@/assets/university-seals/nyu.png";
import tuftsSeal from "@/assets/university-seals/tufts.png";
import uncSeal from "@/assets/university-seals/unc.png";
import bostonCollegeSeal from "@/assets/university-seals/boston-college.png";
import ucsbSeal from "@/assets/university-seals/ucsb.png";
import uciSeal from "@/assets/university-seals/uci.png";
import gatechSeal from "@/assets/university-seals/gatech.png";
import floridaSeal from "@/assets/university-seals/florida.png";
import buSeal from "@/assets/university-seals/bu.png";
import texasSeal from "@/assets/university-seals/texas.png";
import wisconsinSeal from "@/assets/university-seals/wisconsin.png";
import illinoisSeal from "@/assets/university-seals/illinois.png";
import washingtonSeal from "@/assets/university-seals/washington.png";
import ohioStateSeal from "@/assets/university-seals/ohio-state.png";
import pennStateSeal from "@/assets/university-seals/penn-state.png";
import purdueSeal from "@/assets/university-seals/purdue.png";
import ucdavisSeal from "@/assets/university-seals/ucdavis.png";

// Canadian Universities
import torontoSeal from "@/assets/university-seals/toronto.png";
import mcgillSeal from "@/assets/university-seals/mcgill.png";
import ubcSeal from "@/assets/university-seals/ubc.png";
import mcmasterSeal from "@/assets/university-seals/mcmaster.png";
import albertaSeal from "@/assets/university-seals/alberta.png";
import montrealSeal from "@/assets/university-seals/montreal.png";
import waterlooSeal from "@/assets/university-seals/waterloo.png";
import westernSeal from "@/assets/university-seals/western.png";
import queensSeal from "@/assets/university-seals/queens.png";
import calgarySeal from "@/assets/university-seals/calgary.png";
import dalhousieSeal from "@/assets/university-seals/dalhousie.png";
import ottawaSeal from "@/assets/university-seals/ottawa.png";
import sfuSeal from "@/assets/university-seals/sfu.png";
import uvicSeal from "@/assets/university-seals/uvic.png";
import lavalSeal from "@/assets/university-seals/laval.png";
import yorkSeal from "@/assets/university-seals/york.png";
import saskatchewanSeal from "@/assets/university-seals/saskatchewan.png";
import manitobaSeal from "@/assets/university-seals/manitoba.png";
import carletonSeal from "@/assets/university-seals/carleton.png";
import guelphSeal from "@/assets/university-seals/guelph.png";
import concordiaSeal from "@/assets/university-seals/concordia.png";
import memorialSeal from "@/assets/university-seals/memorial.png";

export const universitySealMap: Record<string, string> = {
  // Top U.S. Universities
  "Harvard University": harvardSeal,
  "Stanford University": stanfordSeal,
  "Massachusetts Institute of Technology (MIT)": mitSeal,
  "University of California, Berkeley": berkeleySeal,
  "Princeton University": princetonSeal,
  "Yale University": yaleSeal,
  "Columbia University": columbiaSeal,
  "University of Chicago": chicagoSeal,
  "California Institute of Technology (Caltech)": caltechSeal,
  "Johns Hopkins University": johnsHopkinsSeal,
  "University of Pennsylvania": upennSeal,
  "Cornell University": cornellSeal,
  "University of Michigan": michiganSeal,
  "Northwestern University": northwesternSeal,
  "Duke University": dukeSeal,
  "University of California, Los Angeles (UCLA)": uclaSeal,
  "Brown University": brownSeal,
  "Dartmouth College": dartmouthSeal,
  "Vanderbilt University": vanderbiltSeal,
  "Rice University": riceSeal,
  "Washington University in St. Louis": wustlSeal,
  "University of Notre Dame": notreDameSeal,
  "University of California, San Diego": ucsdSeal,
  "Emory University": emorySeal,
  "Georgetown University": georgetownSeal,
  "Carnegie Mellon University": cmuSeal,
  "University of Southern California": uscSeal,
  "University of Virginia": uvaSeal,
  "New York University": nyuSeal,
  "Tufts University": tuftsSeal,
  "University of North Carolina at Chapel Hill": uncSeal,
  "Boston College": bostonCollegeSeal,
  "University of California, Santa Barbara": ucsbSeal,
  "University of California, Irvine": uciSeal,
  "Georgia Institute of Technology": gatechSeal,
  "University of Florida": floridaSeal,
  "Boston University": buSeal,
  "University of Texas at Austin": texasSeal,
  "University of Wisconsin-Madison": wisconsinSeal,
  "University of Illinois at Urbana-Champaign": illinoisSeal,
  "University of Washington": washingtonSeal,
  "Ohio State University": ohioStateSeal,
  "Pennsylvania State University": pennStateSeal,
  "Purdue University": purdueSeal,
  "University of California, Davis": ucdavisSeal,

  // Canadian Universities
  "University of Toronto": torontoSeal,
  "McGill University": mcgillSeal,
  "University of British Columbia": ubcSeal,
  "McMaster University": mcmasterSeal,
  "University of Alberta": albertaSeal,
  "University of Montreal": montrealSeal,
  "University of Waterloo": waterlooSeal,
  "Western University": westernSeal,
  "Queen's University": queensSeal,
  "University of Calgary": calgarySeal,
  "Dalhousie University": dalhousieSeal,
  "University of Ottawa": ottawaSeal,
  "Simon Fraser University": sfuSeal,
  "University of Victoria": uvicSeal,
  "Laval University": lavalSeal,
  "York University": yorkSeal,
  "University of Saskatchewan": saskatchewanSeal,
  "University of Manitoba": manitobaSeal,
  "Carleton University": carletonSeal,
  "University of Guelph": guelphSeal,
  "Concordia University": concordiaSeal,
  "Memorial University of Newfoundland": memorialSeal,
};
