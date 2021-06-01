import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import remark from 'remark';
import html from 'remark-html';

type LogIds = Array<string>;

export interface GetAllLogIds {
  (): LogIds;
}

const changeLogsDirectory = path.join(process.cwd(), '/mySrc/changeLogs');

const getAllLogIds: GetAllLogIds = () => {
  const fileNames = fs.readdirSync(changeLogsDirectory);

  return fileNames.map(fileName => fileName.replace(/\.md/, ''));
};

export interface ChangeLogData {
  id: string;
  contentHtml: string;
  [key: string]: string;
}

interface GetChangeLogData {
  (id: string): Promise<ChangeLogData>;
}

const getChangeLogData: GetChangeLogData = async id => {
  const fullPath = path.join(changeLogsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const matterResult = matter(fileContents);

  const processedContent = await remark().use(html).process(matterResult.content);
  const contentHtml = processedContent.toString();

  return { id, contentHtml, ...matterResult.data };
};

type Version = Array<number>;
const parseVersion = (logId: string): Version =>
  logId
    .replace('v', '')
    .split('.')
    .map(value => Number(value));

const sortRule = (logA: Version, logB: Version): number => {
  for (let i = 0; i < logA.length; i += 1) {
    if (logA[i] > logB[i]) return -1;
    else if (logA[i] < logB[i]) return 1;
  }
  return 0;
};

interface SortLogId {
  (logIds: LogIds): LogIds;
}

const sortLogId: SortLogId = (logIds = []) =>
  logIds
    .map(logId => parseVersion(logId))
    .sort((a, b) => sortRule(a, b))
    .map(version => `v${version.join('.')}`);

const getRange = (page: number, pitem: number): Array<number> => [(page - 1) * pitem, page * pitem - 1];

interface GetChangeLogDatasProps {
  page: number;
  pitem: number;
}

export interface ChangeLogDatas {
  total: number;
  data: Array<ChangeLogData>;
}

interface GetChangeLogDatas {
  (props: GetChangeLogDatasProps): Promise<ChangeLogDatas>;
}
const getChangeLogDatas: GetChangeLogDatas = ({ page, pitem }) => {
  const allLogIds = sortLogId(getAllLogIds());
  const total = allLogIds.length;
  const [minIndex, maxIndex] = getRange(page, pitem);

  return new Promise(resolve => {
    Promise.all(
      allLogIds.filter((logId, index) => index >= minIndex && index <= maxIndex).map(logId => getChangeLogData(logId))
    ).then(changeLogDatas => resolve({ total, data: changeLogDatas }));
  });
};

export default getChangeLogDatas;
