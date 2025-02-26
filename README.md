# Programming-Design-Paradigm_Homework-1-OOP_Functional-Programming

## Project Overview

This project provides a command-line tool for filtering, analyzing, and exporting Airbnb listings from a CSV file. It allows users to input filtering criteria, compute statistics, rank hosts, and export results.

The system is built using Node.js with ES6 modules and follows functional programming principles, using pure functions, higher-order functions, and method chaining.

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
   git clone https://github.com/yourusername/airbnb-data-handler.git
   cd airbnb-data-handler
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Run the program:
   ```sh
   node main.js
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
  const totalRoomPrice = validListings.reduce((acc, listing) => acc + listing.price / listing.accommodates, 0);
  const avgPricePerRoom = count ? totalRoomPrice / count : 0;
  const totalPriceValidListings = validListings.reduce((acc, listing) => acc + listing.price, 0);
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
    (criteria.minReviewScore == null || listing.review_scores_rating >= criteria.minReviewScore);
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

## License

This project is licensed under the MIT License.


