#!/usr/bin/env -S node -r "ts-node/register"

const { main } = require('../dist/main')

main().catch(e => {
  console.error(e);
  process.exit(1);
});
