import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema/typeDefs.js';
import { resolvers } from './schema/resolvers.js';
import { ConfigurablePokeAPIDataSource } from './datasources/ConfigurablePokeAPI.js';
import { logger } from './utils/logger.js';
import { validateEnv } from './utils/validateEnv.js';
import dotenv from 'dotenv';

dotenv.config();

// Validate environment variables
const env = validateEnv();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startServer = async () => {
  // Create datasource instance
  const pokeAPIDataSource = new ConfigurablePokeAPIDataSource(env.API_MODE);

  const { url } = await startStandaloneServer(server, {
    listen: { port: env.PORT },
    context: async () => ({
      dataSources: {
        pokeAPI: pokeAPIDataSource,
      },
    }),
  });

  logger.info('\n🎮 Pokemon Quiz Backend');
  logger.info(`📍 API Mode: ${pokeAPIDataSource.getMode()}`);
  logger.info(`🚀 Server ready at: ${url}`);
  logger.info('📊 GraphQL Playground available\n');
};

startServer().catch((error) => {
  logger.error('❌ Error starting server:', error);
  process.exit(1);
});
