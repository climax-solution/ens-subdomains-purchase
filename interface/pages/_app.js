import  { ApolloProvider } from "@apollo/client";
import { AppWrapper } from "../context/state";
import Layout from '../components/layout'
import '../styles/globals.css'

import { clientReactive, networkIdReactive } from '../utility/apollo/reactiveVars'
import { setupClient } from '../utility/apollo/apolloClient'
import setup from "../utility/setup";
setup(false);

function MyApp({ Component, pageProps }) {
  const client = clientReactive(setupClient(networkIdReactive()))
  return (
    <ApolloProvider client={client}>
      <AppWrapper>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AppWrapper>
    </ApolloProvider>
  )
}

export default MyApp