import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { typeDefs } from '@/graphql/schemas';
import { resolvers } from '@/graphql/resolvers';
import { createContext } from '@/graphql/context';
import { PubSub } from 'graphql-subscriptions';
import { makeExecutableSchema } from '@graphql-tools/schema';

// Create PubSub instance
const pubsub = new PubSub();

// Create the schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Create Apollo Server with schema
const apolloServer = new ApolloServer({
  schema,
});

// Singleton pattern for WebSocket server
let wsServer: WebSocketServer | null = null;

if (process.env.NODE_ENV !== 'production') {
  // Only create the WebSocket server if it hasn't been created yet
  if (!wsServer) {
    try {
      const httpServer = createServer();

      wsServer = new WebSocketServer({
        server: httpServer,
        path: '/api/graphql',
      });

      // Use the WebSocket server with GraphQL
      useServer(
        {
          schema,
          context: createContext,
          onConnect: async (ctx) => {
            console.log('Client connected');
            return true;
          },
          onDisconnect: async (ctx) => {
            console.log('Client disconnected');
          },
        },
        wsServer
      );

      // Try to listen on the port
      httpServer.listen(3123, () => {
        console.log('WebSocket server is running on port 3123');
      }).on('error', (err: any) => {
        if (err.code !== 'EADDRINUSE') {
          console.error('WebSocket server error:', err);
        }
        // If port is in use, we'll just skip creating a new server
        // as one is probably already running
      });
    } catch (error) {
      console.error('Error setting up WebSocket server:', error);
    }
  }
}

// Export the handler for Next.js API route
const handler = startServerAndCreateNextHandler(apolloServer, {
  context: async (req, res) => ({
    ...await createContext({ req, res }),
    pubsub,
  }),
});

export { handler as GET, handler as POST };