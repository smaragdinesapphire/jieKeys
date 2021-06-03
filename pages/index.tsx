import { NextPage } from 'next';
import Head from 'next/head';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>My page title</title>
        <meta name="description" content="This is a home page, just for practice." />
      </Head>
    </>
  );
};

export default Home;
