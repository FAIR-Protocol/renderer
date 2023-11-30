import { ApolloProvider } from "@apollo/client";
import { AppThemeProvider } from './context/theme';
import { CssBaseline } from '@mui/material';
// import Asset from "./components/asset";
import { Outlet } from "react-router-dom";
import { client } from "./utils/apollo";

const Root = () => {
  return <ApolloProvider client={client}>
    <AppThemeProvider>
      <CssBaseline />
      <Outlet />
    </AppThemeProvider>
  </ApolloProvider>
};

export default Root;