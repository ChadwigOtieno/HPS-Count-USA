// Sample data generation functions for the HPS dashboard
import { topStatesData, timeSeriesData, demographicData } from "./static-hps-data";

// List of US states
const states = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
]

// Helper function to generate pseudo-random but deterministic number based on seed
const deterministicRandom = (min: number, max: number, seed: number) => {
  // Simple deterministic algorithm
  const x = Math.sin(seed) * 10000;
  const result = min + (Math.abs(x - Math.floor(x)) * (max - min));
  return result;
}

// Cache the generated data
let hpsDataCache: any[] | null = null;
let environmentalDataCache: any[] | null = null;
let demographicDataCache: any[] | null = null;

// Generate environmental data for all states
const generateEnvironmentalData = () => {
  return states.map((state) => {
    // Higher elevation and forest coverage for western states
    const isWestern = ["Colorado", "Wyoming", "Montana", "Idaho", "Utah", "New Mexico", "Arizona", "Nevada"].includes(
      state,
    )

    const avgElevation = isWestern ? deterministicRandom(1000, 3000, state.charCodeAt(0)) : deterministicRandom(100, 1000, state.charCodeAt(0))

    const forestCoverage = isWestern ? deterministicRandom(30, 70, state.charCodeAt(1)) : deterministicRandom(10, 50, state.charCodeAt(1))

    // Population density varies by state
    let populationDensity
    if (["New Jersey", "Rhode Island", "Massachusetts", "Connecticut", "Maryland"].includes(state)) {
      populationDensity = deterministicRandom(300, 1200, state.charCodeAt(2))
    } else if (["Alaska", "Wyoming", "Montana", "North Dakota", "South Dakota"].includes(state)) {
      populationDensity = deterministicRandom(1, 20, state.charCodeAt(3))
    } else {
      populationDensity = deterministicRandom(20, 300, state.charCodeAt(4))
    }

    return {
      State: state,
      avgElevation,
      forestCoverage,
      populationDensity,
      annualPrecipitation: deterministicRandom(10, 60, state.charCodeAt(5)),
    }
  })
}

// Generate demographic data for all states
const generateDemographicData = () => {
  return states.map((state) => {
    const malePct = deterministicRandom(48, 52, state.charCodeAt(0))

    return {
      State: state,
      malePct,
      femalePct: 100 - malePct,
      whitePct: deterministicRandom(50, 90, state.charCodeAt(1)),
      blackPct: deterministicRandom(5, 20, state.charCodeAt(2)),
      hispanicPct: deterministicRandom(5, 30, state.charCodeAt(3)),
      asianPct: deterministicRandom(1, 15, state.charCodeAt(4)),
      otherPct: deterministicRandom(1, 10, state.charCodeAt(5)),
      under18Pct: deterministicRandom(15, 25, state.charCodeAt(0) + 1),
      age18to44Pct: deterministicRandom(30, 40, state.charCodeAt(1) + 1),
      age45to64Pct: deterministicRandom(20, 30, state.charCodeAt(2) + 1),
      age65PlusPct: deterministicRandom(10, 20, state.charCodeAt(3) + 1),
    }
  })
}

// Type definition for state data
interface StateData {
  State: string;
  Cases: number;
  Deaths: number;
  Population: number;
  Case_Rate: number;
  Mortality_Rate: number;
  [key: string]: any; // Allow indexing with string
}

// API functions
export const fetchStateData = async (yearRange: [number, number], metric: string): Promise<StateData[]> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  // Return the top states data from our static data
  return [...topStatesData];
}

export const fetchTopStatesData = async (yearRange: [number, number], metric: string, state: string = "All States"): Promise<StateData[]> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  // Filter the data based on the selected state
  let filteredData = [...topStatesData];
  
  // If a specific state is selected, only return data for that state
  if (state !== "All States") {
    filteredData = filteredData.filter(item => item.State === state);
    
    // If no data for the selected state, return an empty array
    if (filteredData.length === 0) {
      return [];
    }
  }

  // Return the top states data from our static source
  return filteredData
    .filter(item => item[metric] !== undefined)
    .sort((a, b) => b[metric] - a[metric])
    .slice(0, 5);
}

export const fetchTimeSeriesData = async (yearRange: [number, number], metric: string, state: string = "All States") => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  // Filter by year range
  const filteredByYear = timeSeriesData.filter(item => item.Year >= yearRange[0] && item.Year <= yearRange[1]);

  // If no specific state filter is applied, return as is
  if (state === "All States") {
    return filteredByYear;
  }

  // If a specific state is selected but it's not one of our top 5 states, still return all data
  // as the component will handle which lines to display
  const topStates = ["New Mexico", "Arizona", "Colorado", "California", "Washington"];
  if (!topStates.includes(state)) {
    return filteredByYear;
  }

  // Otherwise, filter the data to only include the National and selected state data
  return filteredByYear.map(item => {
    const { Year, National } = item;
    const filteredItem: any = { Year, National };
    
    // Add the selected state's data
    if (state in item) {
      filteredItem[state] = item[state as keyof typeof item];
    }
    
    return filteredItem;
  });
}

export const fetchDemographicData = async (demographicType: string, state: string = "All States") => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  
  // Return the appropriate demographic data
  // If a specific state is selected, we can adjust the data slightly to simulate state differences
  let multiplier = 1.0;
  if (state !== "All States") {
    // Generate a consistent multiplier based on state name length
    const seed = state.length;
    multiplier = 0.85 + (seed % 5) * 0.05; // This gives values between 0.85 and 1.05
  }
  
  // Apply multiplier to the appropriate demographic data and return
  if (demographicType === 'gender') {
    return demographicData.gender.map(item => ({
      ...item,
      value: Math.min(100, Math.max(0, item.value * multiplier)) // Ensure value is between 0 and 100
    }));
  } else if (demographicType === 'race') {
    return demographicData.race.map(item => ({
      ...item,
      value: Math.min(100, Math.max(0, item.value * multiplier)) // Ensure value is between 0 and 100
    }));
  } else {
    // Default to age
    return demographicData.age.map(item => ({
      ...item,
      value: Math.min(100, Math.max(0, item.value * multiplier)) // Ensure value is between 0 and 100
    }));
  }
}

export const fetchCorrelationData = async (state: string = "All States") => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  // Base correlation data
  const baseData = [
    {
      Factor: "Average Elevation",
      Correlation: 0.68,
      P_Value: 0.012,
      Significance: "Significant",
    },
    {
      Factor: "Forest Coverage",
      Correlation: 0.72,
      P_Value: 0.008,
      Significance: "Significant",
    },
    {
      Factor: "Population Density",
      Correlation: -0.45,
      P_Value: 0.078,
      Significance: "Not Significant",
    },
    {
      Factor: "Annual Precipitation",
      Correlation: 0.31,
      P_Value: 0.215,
      Significance: "Not Significant",
    },
  ];

  // If a specific state is selected, adjust the correlation values slightly
  if (state !== "All States") {
    // Generate a seed based on the state name for consistent but varied results
    const seed = state.length;
    const multiplier = 0.9 + (seed % 10) * 0.02; // Values between 0.9 and 1.08
    
    return baseData.map(item => ({
      ...item,
      Correlation: Math.min(1, Math.max(-1, item.Correlation * multiplier)),
      P_Value: Math.min(1, Math.max(0, item.P_Value / multiplier)),
      // Adjust significance if P-Value crosses the 0.05 threshold
      Significance: item.P_Value / multiplier < 0.05 ? "Significant" : "Not Significant"
    }));
  }

  return baseData;
}

export const fetchStateDetails = async (state: string, yearRange: [number, number]) => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  // Find the state in our top states data
  const stateData = topStatesData.find(s => s.State === state);
  
  if (!stateData) {
    return {
      caseStats: {
        totalCases: 0,
        totalDeaths: 0,
        caseRate: 0,
        mortalityRate: 0,
        avgPopulation: 0,
      },
      environmental: {
        avgElevation: 0,
        forestCoverage: 0,
        populationDensity: 0,
        annualPrecipitation: 0,
      },
      demographic: {
        malePct: 0,
        femalePct: 0,
        whitePct: 0,
        blackPct: 0,
        hispanicPct: 0,
        asianPct: 0,
        otherPct: 0,
      },
    };
  }

  // Use data from our static source
  return {
    caseStats: {
      totalCases: stateData.Cases,
      totalDeaths: stateData.Deaths,
      caseRate: stateData.Case_Rate,
      mortalityRate: stateData.Mortality_Rate,
      avgPopulation: stateData.Population,
    },
    environmental: {
      avgElevation: state === "Colorado" ? 2200 : 
                   state === "New Mexico" ? 1700 :
                   state === "Arizona" ? 1250 :
                   state === "Washington" ? 520 : 
                   state === "California" ? 880 : 500,
      forestCoverage: state === "Washington" ? 52 :
                     state === "Colorado" ? 34 :
                     state === "California" ? 33 :
                     state === "New Mexico" ? 25 :
                     state === "Arizona" ? 18 : 30,
      populationDensity: state === "California" ? 253 :
                        state === "Washington" ? 113 :
                        state === "Arizona" ? 64 :
                        state === "Colorado" ? 55 : 
                        state === "New Mexico" ? 17 : 100,
      annualPrecipitation: state === "Washington" ? 38 :
                          state === "California" ? 22 :
                          state === "Colorado" ? 15 :
                          state === "New Mexico" ? 14 :
                          state === "Arizona" ? 13 : 20,
    },
    demographic: {
      malePct: 58.5,
      femalePct: 41.5,
      whitePct: 68.3,
      blackPct: 1.5,
      hispanicPct: 21.7,
      asianPct: 1.3,
      otherPct: 7.2,
    },
  }
}
