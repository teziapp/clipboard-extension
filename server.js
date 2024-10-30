const { closest, distance } = require('fastest-levenshtein')

console.log(closest('herwehaveacat', ['wehavecat', 'hereacat']))