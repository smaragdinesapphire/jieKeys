import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import HomePage from '../mySrc/pages/home/Home';
import axios from 'axios';
import api from '../mySrc/services/api.json';

const Home: NextPage = () => {
  const [logs, setLogs] = useState({ total: 0, data: [] });

  useEffect(() => {
    axios
      .get(api.getChangeLog, {
        params: {
          page: 1,
          pitem: 10,
        },
      })
      .then(({ data }) => setLogs(data))
      .catch(e => console.log(e));
  }, []);
  return (
    <>
      <Head>
        <title>My page title</title>
        <meta name="description" content="This is a home page, just for practice." />
      </Head>
      <HomePage logs={logs} />
    </>
  );
};

export default Home;
