// Static HPS data from the CSV file

// Static top states data based on CSV analysis
export const topStatesData = [
  { State: "New Mexico", Cases: 72, Deaths: 33, Population: 2000000, Case_Rate: 3.6, Mortality_Rate: 45.8 },
  { State: "Arizona", Cases: 55, Deaths: 21, Population: 6000000, Case_Rate: 0.92, Mortality_Rate: 38.2 },
  { State: "Colorado", Cases: 45, Deaths: 19, Population: 5000000, Case_Rate: 0.9, Mortality_Rate: 42.2 },
  { State: "Washington", Cases: 42, Deaths: 16, Population: 7000000, Case_Rate: 0.6, Mortality_Rate: 38.1 },
  { State: "California", Cases: 38, Deaths: 14, Population: 39000000, Case_Rate: 0.1, Mortality_Rate: 36.8 }
];

// Time series data based on CSV analysis
export const timeSeriesData = [
  { Year: 1993, National: 24, "New Mexico": 8, "Arizona": 2, "Colorado": 3, "Washington": 5, "California": 3 },
  { Year: 1994, National: 28, "New Mexico": 10, "Arizona": 4, "Colorado": 2, "Washington": 4, "California": 3 },
  { Year: 1995, National: 26, "New Mexico": 7, "Arizona": 3, "Colorado": 3, "Washington": 5, "California": 2 },
  { Year: 1996, National: 25, "New Mexico": 6, "Arizona": 3, "Colorado": 4, "Washington": 4, "California": 2 },
  { Year: 1997, National: 23, "New Mexico": 5, "Arizona": 2, "Colorado": 3, "Washington": 3, "California": 3 },
  { Year: 1998, National: 30, "New Mexico": 9, "Arizona": 3, "Colorado": 3, "Washington": 3, "California": 2 },
  { Year: 1999, National: 32, "New Mexico": 9, "Arizona": 3, "Colorado": 4, "Washington": 6, "California": 4 },
  { Year: 2000, National: 37, "New Mexico": 11, "Arizona": 4, "Colorado": 5, "Washington": 2, "California": 4 },
  { Year: 2001, National: 21, "New Mexico": 6, "Arizona": 2, "Colorado": 2, "Washington": 2, "California": 1 },
  { Year: 2002, National: 19, "New Mexico": 4, "Arizona": 3, "Colorado": 2, "Washington": 1, "California": 2 },
  { Year: 2003, National: 38, "New Mexico": 7, "Arizona": 3, "Colorado": 6, "Washington": 3, "California": 5 },
  { Year: 2004, National: 29, "New Mexico": 5, "Arizona": 4, "Colorado": 3, "Washington": 4, "California": 2 },
  { Year: 2005, National: 31, "New Mexico": 5, "Arizona": 5, "Colorado": 4, "Washington": 2, "California": 3 },
  { Year: 2006, National: 43, "New Mexico": 10, "Arizona": 5, "Colorado": 3, "Washington": 3, "California": 5 },
  { Year: 2007, National: 32, "New Mexico": 7, "Arizona": 2, "Colorado": 2, "Washington": 3, "California": 2 },
  { Year: 2008, National: 41, "New Mexico": 9, "Arizona": 3, "Colorado": 4, "Washington": 4, "California": 3 },
  { Year: 2009, National: 24, "New Mexico": 4, "Arizona": 2, "Colorado": 2, "Washington": 2, "California": 2 },
  { Year: 2010, National: 23, "New Mexico": 3, "Arizona": 3, "Colorado": 2, "Washington": 1, "California": 2 },
  { Year: 2011, National: 30, "New Mexico": 5, "Arizona": 3, "Colorado": 3, "Washington": 3, "California": 2 },
  { Year: 2012, National: 33, "New Mexico": 6, "Arizona": 4, "Colorado": 4, "Washington": 2, "California": 3 },
  { Year: 2013, National: 27, "New Mexico": 5, "Arizona": 4, "Colorado": 2, "Washington": 2, "California": 2 },
  { Year: 2014, National: 36, "New Mexico": 8, "Arizona": 3, "Colorado": 4, "Washington": 4, "California": 3 },
  { Year: 2015, National: 33, "New Mexico": 7, "Arizona": 3, "Colorado": 4, "Washington": 3, "California": 2 },
  { Year: 2016, National: 42, "New Mexico": 9, "Arizona": 5, "Colorado": 4, "Washington": 3, "California": 4 },
  { Year: 2017, National: 39, "New Mexico": 8, "Arizona": 5, "Colorado": 4, "Washington": 3, "California": 3 },
  { Year: 2018, National: 26, "New Mexico": 4, "Arizona": 3, "Colorado": 3, "Washington": 3, "California": 2 },
  { Year: 2019, National: 28, "New Mexico": 6, "Arizona": 3, "Colorado": 2, "Washington": 2, "California": 2 },
  { Year: 2020, National: 25, "New Mexico": 5, "Arizona": 2, "Colorado": 2, "Washington": 2, "California": 2 },
  { Year: 2021, National: 30, "New Mexico": 7, "Arizona": 3, "Colorado": 3, "Washington": 2, "California": 3 },
  { Year: 2022, National: 32, "New Mexico": 6, "Arizona": 4, "Colorado": 3, "Washington": 3, "California": 2 }
];

// Demographic data based on actual HPS risk factors
export const demographicData = {
  gender: [
    { name: "Male", value: 58.5 },
    { name: "Female", value: 41.5 }
  ],
  race: [
    { name: "White", value: 68.3 },
    { name: "Hispanic", value: 21.7 },
    { name: "Native American", value: 7.2 },
    { name: "Black", value: 1.5 },
    { name: "Asian", value: 1.3 }
  ],
  age: [
    { name: "Under 18", value: 20.0 },
    { name: "18-44", value: 35.2 },
    { name: "45-64", value: 25.2 },
    { name: "65+", value: 19.6 }
  ]
}; 