import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';

import queryClient from 'query-client';
import shipTheme from 'theme/ship-theme';

import { GrowthFlagsContextProvider } from 'contexts/growth-flags-context';

import PageConfig from './PageConfig';
import CrispChat from './CrispChat';
import Hotjar from './Hotjar';

const App = ({ Component, pageProps }) => (
  <>
    <Head>
      <title>Growthflags</title>
    </Head>
    <CrispChat />
    <Hotjar />
    <QueryClientProvider client={queryClient}>
      <MantineProvider
        theme={shipTheme}
        defaultProps={{
          Button: { size: 'md' },
          TextInput: { size: 'md' },
          PasswordInput: { size: 'md' },
          Select: { size: 'md' },
        }}
        withGlobalStyles
        withNormalizeCSS
      >
        <ModalsProvider>
          <NotificationsProvider autoClose={5000} limit={2}>
            <PageConfig>
              <GrowthFlagsContextProvider>
                <Component {...pageProps} />
              </GrowthFlagsContextProvider>
            </PageConfig>
          </NotificationsProvider>
        </ModalsProvider>
        <ReactQueryDevtools position="bottom-right" />
      </MantineProvider>
    </QueryClientProvider>
  </>
);

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.shape({}).isRequired,
};

export default App;
