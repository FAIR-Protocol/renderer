import { ApolloProvider } from "@apollo/client";
import { AppThemeProvider } from './context/theme';
import { CssBaseline } from '@mui/material';
import { client } from "./utils/apollo";
import Asset from "./components/asset";

const Root = () => {
  return <ApolloProvider client={client}>
    <AppThemeProvider>
      <CssBaseline />
      <Asset />
    </AppThemeProvider>
  </ApolloProvider>
};

export default Root;