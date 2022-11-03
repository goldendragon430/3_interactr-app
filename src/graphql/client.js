import {ApolloClient, gql, InMemoryCache, createHttpLink, makeVar, ApolloLink} from '@apollo/client'
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import {getToken}  from '@/modules/auth/utils';
import {playerVar} from "./LocalState/player";
import {composerVar} from "./LocalState/composer";

// get the authentication token from local storage if it exists
const token =  getToken();

export const cache = new InMemoryCache({
  possibleTypes: {
    Element: ["ButtonElement", "TriggerElement", "HotspotElement", "ImageElement", "TextElement", "CustomhtmlElement"]
  },
  typePolicies: {
    Query: {
      fields: {
        player: {
          read() {
            return playerVar();
          }
        },
        composer: {
          read(){
            return composerVar();
          }
        }
      }
    },
  }
});

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_API_URL + '/graphql',
});


const authLink = setContext((_, { headers }) => {
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const errorLink = onError((errorData) => {
  const { graphQLErrors, networkError } = errorData;

  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) => {

      // If the user got unauthenticated error from server redirect to login page with current path
      if (message === 'Unauthenticated.') {
        let redirectUrl = window.location.pathname;

        if (window.location.search) {
          redirectUrl += window.location.search;
        }

        window.location.href = `/login?redirect=${encodeURIComponent(redirectUrl)}`;
      }

      console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    });
  }
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const client = new ApolloClient({
  cache,
  link: errorLink.concat(authLink).concat(httpLink),
});
export default client;