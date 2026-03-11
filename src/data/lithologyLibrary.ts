export interface Lithology {
  id: string;
  name: string;
  mohs: number;
  luster: string;
  cleavage: string;
  crystalSystem: string;
  color: string;
  streak: string;
  chemicalFormula: string;
  description: string;
  image: string;
}

export const LITHOLOGY_LIBRARY: Lithology[] = [
  {
    id: 'quartz',
    name: 'Quartz',
    mohs: 7,
    luster: 'Vitreous',
    cleavage: 'None',
    crystalSystem: 'Hexagonal',
    color: 'Colorless, White, Purple, etc.',
    streak: 'White',
    chemicalFormula: 'SiO2',
    description: 'One of the most abundant minerals in the Earth\'s crust. It is a common constituent of many igneous, metamorphic, and sedimentary rocks.',
    image: 'https://picsum.photos/seed/quartz/400/300'
  },
  {
    id: 'calcite',
    name: 'Calcite',
    mohs: 3,
    luster: 'Vitreous to Pearly',
    cleavage: 'Perfect Rhombohedral',
    crystalSystem: 'Trigonal',
    color: 'Colorless, White, Yellow, etc.',
    streak: 'White',
    chemicalFormula: 'CaCO3',
    description: 'A carbonate mineral and the most stable polymorph of calcium carbonate. It is the main constituent of limestone and marble.',
    image: 'https://picsum.photos/seed/calcite/400/300'
  },
  {
    id: 'fluorite',
    name: 'Fluorite',
    mohs: 4,
    luster: 'Vitreous',
    cleavage: 'Perfect Octahedral',
    crystalSystem: 'Isometric',
    color: 'Purple, Green, Blue, Yellow, etc.',
    streak: 'White',
    chemicalFormula: 'CaF2',
    description: 'Known for its wide range of colors and its use as a flux in steelmaking. It often exhibits strong fluorescence under UV light.',
    image: 'https://picsum.photos/seed/fluorite/400/300'
  },
  {
    id: 'orthoclase',
    name: 'Orthoclase',
    mohs: 6,
    luster: 'Vitreous to Pearly',
    cleavage: 'Perfect in two directions',
    crystalSystem: 'Monoclinic',
    color: 'Pink, White, Gray, etc.',
    streak: 'White',
    chemicalFormula: 'KAlSi3O8',
    description: 'An important tectosilicate mineral which forms igneous rock. It is a key component of granite.',
    image: 'https://picsum.photos/seed/feldspar/400/300'
  },
  {
    id: 'talc',
    name: 'Talc',
    mohs: 1,
    luster: 'Pearly to Greasy',
    cleavage: 'Perfect Basal',
    crystalSystem: 'Monoclinic',
    color: 'White, Green, Gray',
    streak: 'White',
    chemicalFormula: 'Mg3Si4O10(OH)2',
    description: 'The softest known mineral. It is used in many industries, including cosmetics, paper, and ceramics.',
    image: 'https://picsum.photos/seed/talc/400/300'
  },
  {
    id: 'gypsum',
    name: 'Gypsum',
    mohs: 2,
    luster: 'Vitreous to Pearly',
    cleavage: 'Perfect in one direction',
    crystalSystem: 'Monoclinic',
    color: 'Colorless, White, Gray',
    streak: 'White',
    chemicalFormula: 'CaSO4·2H2O',
    description: 'A soft sulfate mineral used as a fertilizer and as the main constituent in many forms of plaster, blackboard chalk, and wallboard.',
    image: 'https://picsum.photos/seed/gypsum/400/300'
  },
  {
    id: 'apatite',
    name: 'Apatite',
    mohs: 5,
    luster: 'Vitreous',
    cleavage: 'Poor',
    crystalSystem: 'Hexagonal',
    color: 'Green, Blue, Brown, etc.',
    streak: 'White',
    chemicalFormula: 'Ca5(PO4)3(F,Cl,OH)',
    description: 'A group of phosphate minerals. It is one of the few minerals produced and used by biological micro-environmental systems.',
    image: 'https://picsum.photos/seed/apatite/400/300'
  },
  {
    id: 'topaz',
    name: 'Topaz',
    mohs: 8,
    luster: 'Vitreous',
    cleavage: 'Perfect Basal',
    crystalSystem: 'Orthorhombic',
    color: 'Colorless, Yellow, Blue, Pink, etc.',
    streak: 'White',
    chemicalFormula: 'Al2SiO4(F,OH)2',
    description: 'A silicate mineral of aluminium and fluorine. It is one of the hardest naturally occurring minerals.',
    image: 'https://picsum.photos/seed/topaz/400/300'
  },
  {
    id: 'corundum',
    name: 'Corundum',
    mohs: 9,
    luster: 'Adamantine to Vitreous',
    cleavage: 'None',
    crystalSystem: 'Trigonal',
    color: 'Gray, Brown, Red (Ruby), Blue (Sapphire)',
    streak: 'White',
    chemicalFormula: 'Al2O3',
    description: 'A crystalline form of aluminium oxide. It is naturally transparent, but can have different colors when impurities are present.',
    image: 'https://picsum.photos/seed/corundum/400/300'
  },
  {
    id: 'diamond',
    name: 'Diamond',
    mohs: 10,
    luster: 'Adamantine',
    cleavage: 'Perfect Octahedral',
    crystalSystem: 'Isometric',
    color: 'Colorless, Yellow, Brown, etc.',
    streak: 'White',
    chemicalFormula: 'C',
    description: 'A solid form of the element carbon with its atoms arranged in a crystal structure called diamond cubic. It has the highest hardness and thermal conductivity of any natural material.',
    image: 'https://picsum.photos/seed/diamond/400/300'
  }
];
