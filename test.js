import fs from "fs/promises";
import readline from "readline";
import { parse } from "csv-parse/sync";

const FILE_PATH = "./data/listings.csv";

const loadListings = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, "utf8");
    const records = parse(data, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });
        
    return records.map(listing => {
      listing.price = listing.price ? parseFloat(listing.price.replace(/[^0-9.]/g, "")) || 0 : 0;
      listing.accommodates = parseInt(listing.accommodates) || 1;
      listing.review_scores_rating = listing.review_scores_rating ? parseFloat(listing.review_scores_rating) || 0 : 0;
      listing.host_id = listing.host_id && /^[0-9]+$/.test(listing.host_id) ? listing.host_id : null;
      return listing;
    }).filter(listing => listing.host_id);
  } catch (error) {
    console.error("Error reading file:", error);
    process.exit(1);
  }
};

const filterListings = (listings, criteria) =>
  listings.filter(listing =>
    (criteria.minPrice == null || (listing.price >= criteria.minPrice)) &&
        (criteria.maxPrice == null || (listing.price <= criteria.maxPrice)) &&
        (criteria.minRooms == null || (listing.accommodates >= criteria.minRooms)) &&
        (criteria.maxRooms == null || (listing.accommodates <= criteria.maxRooms)) &&
        (criteria.minReviewScore == null || (listing.review_scores_rating >= criteria.minReviewScore))
  );

const computeStatistics = (filteredListings) => {
  const validListings = filteredListings.filter(listing => listing.price > 0);
  const total_count = filteredListings.length;
  const count = validListings.length;
  const totalRoomPrice = validListings.reduce((acc, listing) => acc + (listing.price / listing.accommodates), 0);
  const avgPricePerRoom = count ? totalRoomPrice / count : 0;
  return { total_count, count, avgPricePerRoom };
};


const rankHostsByListings = (filteredListings) => {
  const hostCount = filteredListings.reduce((acc, { host_id }) => {
    const cleanHostId = host_id.trim();
    acc[cleanHostId] = (acc[cleanHostId] || 0) + 1;
    return acc;
  }, {});
    
    
  return Object.entries(hostCount)
    .sort((a, b) => b[1] - a[1])
    .map(([host_id, count]) => ({ host_id, count }))
    .slice(0, 10);
};

const exportResults = async (filePath, data) => {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    console.log(`Results exported to ${filePath}`);
  } catch (error) {
    console.error("Error writing to file:", error);
  }
};

const ask = (rl, question) => new Promise(resolve => rl.question(`~> ${question} `, resolve));

const main = async () => {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    
  console.log(`Loading data from ${FILE_PATH}...`);
  const listings = await loadListings(FILE_PATH);
    
  const minPrice = parseFloat(await ask(rl, "Enter min price (or press enter to skip): ")) || null;
  const maxPrice = parseFloat(await ask(rl, "Enter max price (or press enter to skip): ")) || null;
  const minRooms = parseInt(await ask(rl, "Enter min number of rooms (or press enter to skip): ")) || null;
  const maxRooms = parseInt(await ask(rl, "Enter max number of rooms (or press enter to skip): ")) || null;
  const minReviewScore = parseFloat(await ask(rl, "Enter min review score (or press enter to skip): ")) || null;
    
  const filteredListings = filterListings(listings, { minPrice, maxPrice, minRooms, maxRooms, minReviewScore });
  console.log(`Filtered Listings Count: ${filteredListings.length}`);
    
  const stats = computeStatistics(filteredListings);
  if (stats.count > 0) {
    console.log(`
Statistics Summary:
`);
    console.log(`- Total Listings Considered: ${stats.total_count}`);
    console.log(`- Valid Listings (price > 0): ${stats.count}`);
    console.log(`- Average Price per Room: $${stats.avgPricePerRoom.toFixed(2)}`);
  } else {
    console.log(`
No valid listings found based on the applied filters.`);
  }
    
  const hostRanking = rankHostsByListings(filteredListings);
  if (hostRanking.length > 0) {
    console.log(`
Top Hosts by Number of Listings:`);
    hostRanking.forEach((host, index) => {
      console.log(`${index + 1}. Host ID: ${host.host_id}, Listings: ${host.count}`);
    });
  } else {
    console.log(`
No hosts found based on the applied filters.`);
  }
    
  const exportPath = await ask(rl, "Enter the file path to export results (or press enter to skip): ");
  if (exportPath) await exportResults(exportPath, { stats, hostRanking });
    
  rl.close();
};

main();






