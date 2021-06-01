import React from 'react';
import styled from 'styled-components';
import useTranslation from 'next-translate/useTranslation';

const Home = styled.div`
  padding: 8px;
  width: 100%;
  height: 100%;
  position: relative;
  background-color: blue;
  color: white;
`;

interface Props {
  logs: {
    total: number;
    data: Array<unknown>;
  };
}

const Logs = styled.div`
  background-color: yellow;
  padding: 4px;
  border: 1px solid black;
  margin: 10px;
  height: 300px;
  overflow: auto;
  color: black;
`;

const HomePage: React.FC<Props> = ({ logs }) => {
  const { t } = useTranslation();
  return (
    <Home>
      <h1>{`${t('home:home')} ${t('common:ok')}?`}</h1>
      <p>JIE TODO</p>
      <div>{`Log count: ${logs.total}`}</div>
      <Logs>
        {logs.data.map(({ id, title, contentHtml }) => (
          <div key={id}>
            <h3>{title}</h3>
            <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
          </div>
        ))}
      </Logs>
    </Home>
  );
};

export default HomePage;
