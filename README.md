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

1. Clone the repository:
   ```sh
   git clone https://github.com/hansama0902/Programming-Design-Paradigm_Homework-1-OOP_Functional-Programming.git
   cd Programming-Design-Paradigm_Homework-1-OOP_Functional-Programming.git
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
solution/
│── AirBnBDataHandler.js  Core data processing logic
│── main.js               Command-line interface for user input
│── test.js               Unit tests for validation
│── .gitignore            Git ignored files
│── eslint.config.js      ESLint configuration for code quality
│── LICENSE               Project license
│── package.json          Project dependencies
│── README.md             Documentation
```

## Functional Programming Principles

This project follows pure functions and higher-order functions principles.

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

## Creative Addition

1. All `price` and `review_scores_rating` values that are empty are assigned a default value of `0`. This ensures they are included in searches. Initially, these listings were skipped, which caused inaccuracies. Note that when setting a minimum value, the range starts from `1`.
2. `Total Listings Considered` includes listings where `price` and `review_scores_rating` are empty, while `Valid Listings` excludes them.
3. `Average Price per Room` represents the average price per room, while `Average Price of All Valid Listings` represents the average price per listing. These averages skip listings where `price` is empty.

## License

This project is licensed under the MIT License.
