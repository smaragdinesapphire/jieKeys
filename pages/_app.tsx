import React from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import styled from 'styled-components';
import { StylesProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import '../styles/globals.scss';

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Head>
      <StylesProvider injectFirst>
        <CssBaseline>
          <Container>
            <Component {...pageProps} />
          </Container>
        </CssBaseline>
      </StylesProvider>
    </>
  );
};

export default MyApp;
