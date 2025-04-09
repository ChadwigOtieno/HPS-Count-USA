# HPS-Count-USA Dashboard

A comprehensive dashboard for exploring Hantavirus Pulmonary Syndrome (HPS) cases across the United States from 1993-2022.

## Overview

This interactive web application visualizes data on Hantavirus Pulmonary Syndrome (HPS) in the United States, allowing users to explore cases, rates, and correlations across different states and time periods. The dashboard presents CDC data in an accessible format with multiple visualization types.

## Features

- **Interactive US Map**: Color-coded visualization of HPS cases or rates by state
- **State Details**: Click on any state to view detailed HPS statistics and environmental factors
- **Multiple Metrics**: Switch between case counts, case rates, and mortality rates
- **Time Period Selection**: Filter data by year range using a slider
- **State Filtering**: Focus on specific states using the dropdown filter
- **Demographic Breakdown**: View demographic data by gender, race/ethnicity, or age group
- **Top States Chart**: Bar chart showing states with highest HPS incidence
- **Time Series Analysis**: Line chart tracking HPS cases over time
- **Environmental Correlations**: Table showing correlations between HPS and environmental factors

## Technology Stack

- **Next.js**: React framework for the frontend
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **React Simple Maps**: For the interactive US map
- **Visx/D3**: Data visualization libraries
- **Shadcn UI**: Component library

## Data Source

The data used in this dashboard comes from the CDC's reported cases of Hantavirus Disease. For more information, visit the [CDC Hantavirus page](https://www.cdc.gov/hantavirus/data-research/cases/index.html).

## Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/ChadwigOtieno/HPS-Count-USA.git
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Screenshots

![Dashboard Overview](./screenshot.png)

## License

This project is available as open source under the terms of the MIT License.

## Acknowledgments

- Data provided by the Centers for Disease Control and Prevention (CDC)
- Inspiration for this dashboard comes from the need to visualize public health data in an accessible format 