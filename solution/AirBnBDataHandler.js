import fs from "fs/promises";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";
/**
 * @module AirBnBDataHandler
 */
/**
 * Represents a single Airbnb listing.
 * @typedef {Object} Listing
 * @property {string} id - The unique identifier for the listing.
 * @property {number} price - The listing price.
 * @property {number} accommodates - Number of guests accommodated.
 * @property {number} review_scores_rating - Review score rating.
 * @property {string|null} host_id - The ID of the host (null if not valid).
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
 * Loads and parses an Airbnb listings CSV file.
 * @async
 * @param {string} filePath - Path to the CSV file.
 * @returns {Promise<Array<Listing>>} Resolves with an array of listing objects.
 */
async function loadListings(filePath) {
  try {
    const data = await fs.readFile(filePath, "utf8");
    const records = parse(data, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    return records
      .map((listing) => ({
        ...listing,
        price: listing.price
          ? parseFloat(listing.price.replace(/[^0-9.]/g, "")) || 0
          : 0,
        accommodates: parseInt(listing.accommodates) || 1,
        review_scores_rating: listing.review_scores_rating
          ? parseFloat(listing.review_scores_rating) || 0
          : 0,
        host_id:
          listing.host_id && /^[0-9]+$/.test(listing.host_id)
            ? listing.host_id.trim()
            : null,
      }))
      .filter((listing) => listing.host_id);
  } catch (error) {
    console.error("Error reading file:", error);
    throw error;
  }
}

/**
 * Represents the Airbnb Data Handler object with chainable methods.
 * @typedef {Object} AirBnBDataHandlerObject
 * @property {Function} filter - Filters listings based on criteria.
 * @property {Function} computeStats - Computes statistics for the filtered listings.
 * @property {Function} rankHosts - Ranks hosts based on the number of listings.
 * @property {Function} exportData - Exports the filtered records to a CSV file asynchronously.
 * @property {Function} getData - Retrieves the current state of records, statistics, and top hosts.
 */

/**
 * Creates a handler for filtering, computing statistics, and exporting data.
 * @param {Array<Listing>} listings - List of Airbnb listings.
 * @returns {AirBnBDataHandlerObject} Handler with chainable methods.
 */
function AirBnBDataHandler(listings) {
  let filteredRecords = [...listings];
  let stats = {};
  let topHosts = [];

  const handler = {
    /**
     * Filters listings based on criteria.
     * @param {Object} criteria - Filtering options.
     * @returns {AirBnBDataHandlerObject} The handler for chaining.
     */
    filter(criteria) {
      filteredRecords = filteredRecords.filter(createFilterFunction(criteria));
      return handler;
    },

    /**
     * Computes statistics for the filtered listings.
     * @returns {AirBnBDataHandlerObject} The handler for chaining.
     */
    computeStats() {
      stats = computeStatistics(filteredRecords);
      return handler;
    },

    /**
     * Ranks hosts by the number of listings they own.
     * @returns {AirBnBDataHandlerObject} The handler for chaining.
     */
    rankHosts() {
      const hostCount = filteredRecords.reduce((acc, { host_id }) => {
        acc[host_id] = (acc[host_id] || 0) + 1;
        return acc;
      }, {});

      topHosts = Object.entries(hostCount)
        .sort((a, b) => b[1] - a[1])
        .map(([host_id, count]) => ({ host_id, count }))
        .slice(0, 15);

      return handler;
    },

    /**
     * Exports filtered listings to a CSV file.
     * @async
     * @param {string} filePath - Output file path.
     * @returns {Promise<AirBnBDataHandlerObject>} The handler for chaining.
     */
    async exportData(filePath) {
      try {
        if (filteredRecords.length === 0) {
          console.log("No data to export.");
          return handler;
        }

        const csvString = stringify(filteredRecords, { header: true });
        await fs.writeFile(filePath, csvString, "utf8");
        console.log(`Results exported to ${filePath}`);
      } catch (error) {
        console.error("Error writing to file:", error);
      }
      return handler;
    },

    /**
     * Retrieves the current state of records, statistics, and top hosts.
     * @returns {Function} {filteredRecords: Array<Listing>, stats: Statistics, topHosts: Array<HostRanking>}
     */
    getData() {
      return { filteredRecords, stats, topHosts };
    },
  };

  return handler;
}

/**
 * Creates a filtering function based on given criteria.
 * @param {Object} criteria - Filtering options.
 * @returns {Function} Function to filter listings - (listing: Listing) => boolean.
 */
function createFilterFunction(criteria) {
  return (listing) =>
    (criteria.minPrice == null || listing.price >= criteria.minPrice) &&
    (criteria.maxPrice == null || listing.price <= criteria.maxPrice) &&
    (criteria.minRooms == null || listing.accommodates >= criteria.minRooms) &&
    (criteria.maxRooms == null || listing.accommodates <= criteria.maxRooms) &&
    (criteria.minReviewScore == null ||
      listing.review_scores_rating >= criteria.minReviewScore);
}

/**
 * Computes statistics for a list of Airbnb listings.
 * @param {Array<Listing>} listings - List of listings.
 * @returns {Statistics} Computed statistics including total count, valid count, and averages.
 */
function computeStatistics(listings) {
  const validListings = listings.filter((listing) => listing.price > 0);
  const total_count = listings.length;
  const count = validListings.length;
  const totalRoomPrice = validListings.reduce(
    (acc, listing) => acc + listing.price / listing.accommodates,
    0,
  );
  const avgPricePerRoom = count ? totalRoomPrice / count : 0;
  const totalPriceValidListings = validListings.reduce(
    (acc, listing) => acc + listing.price,
    0,
  );
  const avgPriceValidListings = count ? totalPriceValidListings / count : 0;

  return { total_count, count, avgPricePerRoom, avgPriceValidListings };
}

export { loadListings, AirBnBDataHandler };
