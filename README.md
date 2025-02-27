# Programming-Design-Paradigm_Homework-1-OOP_Functional-Programming

## Project Overview

This project provides a command-line tool for filtering, analyzing, and exporting Airbnb listings from a CSV file. It allows users to input filtering criteria, compute statistics, rank hosts, and export results.

The system is built using Node.js with ES6 modules and follows functional programming principles, using pure functions, higher-order functions, and method chaining.

## Author

**Shuhan Dong**

## Features

- Load CSV data dynamically – Users specify the CSV file path at runtime
- Filter listings – Filter based on price, number of rooms, and review scores
- Compute statistics – Get insights such as average price per room
- Rank hosts – Identify top hosts based on the number of listings
- Export data – Save filtered data to a CSV file
- Uses ES6 Modules and Promises – Asynchronous handling of file operations
- Command-line UI – Interact with the system via terminal

## Installation
-Before running the program, make sure that the dependencies fs/promises, csv-parse/sync, readline, and csv-stringify/sync are installed.
1. Clone the repository:
   ```sh
   git clone https://github.com/hansama0902/Programming-Design-Paradigm_Homework-3-OOP_Functional-Programming.git
   cd Programming-Design-Paradigm_Homework-3-OOP_Functional-Programming.git
   ```
2. Install dependencies:

   ```sh
   npm install
   ```

3. Run the program:
   ```sh
   node .solution/main.js
   ```
4. View JSDoc Documentation
   ```sh
   npx http-server out
   ```

## Project Structure

```
│── solution/AirBnBDataHandler.js  Core data processing logic
│── solution/main.js               Command-line interface for user input and output 
│── out                   JsDoc HTML                       
│── .gitignore            Git ignored files
│── eslint.config.js      ESLint configuration for code quality
│── LICENSE               Project license
│── package.json          Project dependencies
│── README.md             Documentation
```

## Functional Programming Principles

### Example: Pure Function

A pure function has no side effects and always returns the same output for the same input. Below is an example from `AirBnBDataHandler.js`, which computes statistics based on listings:

```js
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
```

### Counterexample: Impure Function

An impure function modifies external state, making it unreliable.

```js
let total = 0;

function addToTotal(value) {
  total += value;
  return total;
}

console.log(addToTotal(5)); // Returns different results based on previous calls
```

### Example: Higher-Order Function

A higher-order function takes another function as an argument or returns a function. Below is an example from `AirBnBDataHandler.js`, where filtering is applied dynamically based on criteria:

```js
function createFilterFunction(criteria) {
  return (listing) =>
    (criteria.minPrice == null || listing.price >= criteria.minPrice) &&
    (criteria.maxPrice == null || listing.price <= criteria.maxPrice) &&
    (criteria.minRooms == null || listing.accommodates >= criteria.minRooms) &&
    (criteria.maxRooms == null || listing.accommodates <= criteria.maxRooms) &&
    (criteria.minReviewScore == null ||
      listing.review_scores_rating >= criteria.minReviewScore);
}
```

### Counterexample: Without Higher-Order Function

A non-higher-order function simply performs the operation without flexibility.

```js
function double(num) {
  return num * 2;
}

console.log(double(5)); // Output: 10
```

The non-higher-order function is less reusable compared to the first example.  
## Using GenAI

This project utilized **ChatGPT 4o** at various stages of development, including documentation generation, functional programming principles, debugging, and API understanding. Below are specific use cases and how GenAI contributed:

### 1. Generating JSDoc Documentation  
**Prompt:**  
*"Generate JSDoc comments for a function that filters Airbnb listings based on criteria such as price, number of rooms, and review scores."*

**Response:**  
```js
/**
 * Filters Airbnb listings based on user-defined criteria.
 * @param {Object[]} listings - Array of Airbnb listings.
 * @param {Object} criteria - Filtering criteria.
 * @param {number} [criteria.minPrice] - Minimum price.
 * @param {number} [criteria.maxPrice] - Maximum price.
 * @param {number} [criteria.minRooms] - Minimum number of rooms.
 * @param {number} [criteria.maxRooms] - Maximum number of rooms.
 * @param {number} [criteria.minReviewScore] - Minimum review score.
 * @returns {Object[]} Filtered listings.
 */
function filterListings(listings, criteria) { ... }
```
**Use:**  
This response was integrated into the project’s JSDoc comments. However, when running `node_modules/jsdoc/jsdoc.js`, errors appeared, leading to manual adjustments in the JSDoc structure.

---

### 2. Understanding and Implementing Method Chaining  
**Prompt:**  
*"Explain method chaining and provide an example in JavaScript."*

**Response:**  
```js
class ListingsProcessor {
  constructor(listings) {
    this.listings = listings;
  }

  filterByPrice(min, max) {
    this.listings = this.listings.filter(
      (listing) => listing.price >= min && listing.price <= max
    );
    return this;
  }

  sortByReviewScore() {
    this.listings = this.listings.sort(
      (a, b) => b.review_scores_rating - a.review_scores_rating
    );
    return this;
  }

  getResults() {
    return this.listings;
  }
}
```
**Use:**  
The response inspired the initial implementation. However, the chaining style did not fully align with **Functional Programming Principles**, so functions were restructured into pure functions instead.

---

### 3. Learning About Pure Functions  
**Prompt:**  
*"What is a pure function? Provide an example."*

**Response:**  
```js
function computeStatistics(listings) {
  const validListings = listings.filter((listing) => listing.price > 0);
  const count = validListings.length;
  const totalRoomPrice = validListings.reduce(
    (acc, listing) => acc + listing.price / listing.accommodates,
    0
  );
  const avgPricePerRoom = count ? totalRoomPrice / count : 0;
  return { count, avgPricePerRoom };
}
```
**Use:**  
This explanation helped in structuring calculations as pure functions. Counterexamples of **impure functions** were also added to illustrate the difference.

---

### 4. Understanding Readline API  
**Prompt:**  
*"How do I use the Node.js Readline module to take user input in a command-line application?"*

**Response:**  
```js
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter a minimum price: ", (minPrice) => {
  console.log(`Filtering listings with a minimum price of ${minPrice}`);
  rl.close();
});
```
**Use:**  
This example served as the foundation for implementing the **CLI interface**, allowing users to provide filtering criteria dynamically.

---  
## Video  
[video](https://youtu.be/qQzs6osctW4) 
## WHAT I'M PROUD OF
Better understanding of Promises and async/awai and function programming && writing pure functions, higher-order functions.
## WHAT I STRUGGLED THE MOST WITH
Method chaining, I used console.log() to determine where the problem originated and I copied the code blocks to ChatGPT and asked if there were any issues.
## Creative Addition

1. All `price` and `review_scores_rating` values that are empty are assigned a default value of `0`. This ensures they are included in searches. Initially, these listings were skipped, which caused inaccuracies. Note that when setting a minimum value, the range starts from `1`.
2. `Total Listings Considered` includes listings where `price` and `review_scores_rating` are empty, while `Valid Listings` excludes them.
3. `Average Price per Room` represents the average price per room, while `Average Price of All Valid Listings` represents the average price per listing. These averages skip listings where `price` is empty.  
4. `Enter the file path to export results (or press enter to skip): result.csv` – You can export the CSV file in this way.

## License

This project is licensed under the MIT License.
