
Object.defineProperty(exports, "__esModule", { value: true });

const { InjectGeneratedOutput } = require('./inject-generated-output');

const injectedOutput = new InjectGeneratedOutput({});

async function runFetcher(fetcher, input, generateOutput) {
  const q = `TEST`;
  return fetcher(q, { input });
}


Object.assign(exports, {
  getLocationQuery: runFetcher,
  hereUpdateLocation: () => ({}),
  hereGetLocation: () => ({}),
  updateLocationMutation: runFetcher,
});
