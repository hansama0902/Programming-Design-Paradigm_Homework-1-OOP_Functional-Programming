import readline from "readline";
import { loadListings, AirBnBDataHandler } from "./AirBnBDataHandler.js";

const FILE_PATH = "./data/listings.csv";

/**
 * Represents the filter criteria input by the user.
 * @typedef {Object} FilterCriteria
 * @property {number|null} minPrice - Minimum price filter.
 * @property {number|null} maxPrice - Maximum price filter.
 * @property {number|null} minRooms - Minimum number of rooms filter.
 * @property {number|null} maxRooms - Maximum number of rooms filter.
 * @property {number|null} minReviewScore - Minimum review score filter.
 */

/**
 * Represents computed statistics for Airbnb listings.
 * @typedef {Object} Statistics
 * @property {number} total_count - Total number of listings.
 * @property {number} count - Number of valid listings (price > 0).
 * @property {number} avgPricePerRoom - Average price per room.
 * @property {number} avgPriceValidListings - Average price of all valid listings.
 */

/**
 * Represents a host's ranking based on the number of listings.
 * @typedef {Object} HostRanking
 * @property {string} host_id - The ID of the host.
 * @property {number} count - Number of listings owned by the host.
 */

/**
 * Prompts the user with a question and returns their input.
 * @param {readline.Interface} rl - Readline interface instance.
 * @param {string} question - The question to ask the user.
 * @returns {Promise<string>} The user's input as a string.
 */
const ask = (rl, question) => new Promise(resolve => rl.question(`~> ${question} `, resolve));

/**
 * Initializes the main module for processing Airbnb listings.
 * @returns {{run: function(): Promise<void>}} Object containing the `run` function.
 */
function MainModule() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  /**
   * Executes the main workflow for filtering, analyzing, and exporting Airbnb listings.
   * @async
   * @returns {Promise<void>} Resolves when the program completes execution.
   */
  async function run() {
    console.log(`Loading data from ${FILE_PATH}...`);
    
    try {
      // Load Airbnb listings from CSV file
      const listings = await loadListings(FILE_PATH);
      const handler = AirBnBDataHandler(listings);

      // Prompt user for filtering criteria
      const minPrice = parseFloat(await ask(rl, "Enter min price (or press enter to skip): ")) || null;
      const maxPrice = parseFloat(await ask(rl, "Enter max price (or press enter to skip): ")) || null;
      const minRooms = parseInt(await ask(rl, "Enter min number of rooms (or press enter to skip): ")) || null;
      const maxRooms = parseInt(await ask(rl, "Enter max number of rooms (or press enter to skip): ")) || null;
      const minReviewScore = parseFloat(await ask(rl, "Enter min review score (or press enter to skip): ")) || null;

      // Apply filters and process data
      handler
        .filter({ minPrice, maxPrice, minRooms, maxRooms, minReviewScore }) 
        .computeStats() 
        .rankHosts(); 

      // Retrieve filtered results
      const { filteredRecords, stats, topHosts } = handler.getData();
      
      console.log(`Filtered Listings Count: ${filteredRecords.length}`);

      // Display statistics
      if (stats.count > 0) {
        console.log("\nStatistics Summary:\n");
        console.log(`- Total Listings Considered: ${stats.total_count}`);
        console.log(`- Valid Listings (price > 0): ${stats.count}`);
        console.log(`- Average Price per Room: $${stats.avgPricePerRoom.toFixed(2)}`);
        console.log(`- Average Price of All Valid Listings: $${stats.avgPriceValidListings.toFixed(2)}`);
      } else {
        console.log("\nNo valid listings found based on the applied filters.");
      }

      // Display top hosts
      if (topHosts.length > 0) {
        console.log("\nTop 15 Hosts by Number of Listings:");
        topHosts.forEach((host, index) => {
          console.log(`${index + 1}. Host ID: ${host.host_id}, Listings: ${host.count}`);
        });
      } else {
        console.log("\nNo hosts found based on the applied filters.");
      }

      // Ask user if they want to export results
      const exportPath = await ask(rl, "Enter the file path to export results (or press enter to skip): ");
      if (exportPath) {
        await handler.exportData(exportPath);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      rl.close();
    }
  }

  return { run };
}

// Initialize and run the module
const mainModule = MainModule();
mainModule.run();

