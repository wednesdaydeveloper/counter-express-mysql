import 'reflect-metadata';
import * as Express from 'express';
import * as Log4js from 'log4js';
import { error, getCountFromDb, initdb, loanDb } from './db';

type Request  = Express.Request;
type Response = Express.Response;

Log4js.configure('log4js.json');

//  logger
const logger = Log4js.getLogger();

/**
 * CORS 対策用のヘッダをセット
 * @param res レスポンス
 */
function cors(res: Response) {
  res.setHeader('Access-Control-Allow-Origin', '*');
}

/**
 * パラメーターから変化量（val）を取得し、DBを行進する。
 * @param req リクエスト
 * @param res レスポンス
 * @param sign +の値の場合は増加、-の値の場合は減少
 */
async function changeCount(req: Request, res: Response, sign: number): Promise<Response> {
  cors(res);
  const num = parseInt(req.params.val, 10);
  const result = Number.isNaN(num)
    ? error('val is NaN.')
    : await loanDb(c => c.count = c.count + num * sign);
  logger.info(`count: ${result.count}`);
  return res.json(result);
}

/**
 * DBから count を取得
 * @param res response
 */
async function getCurrentCount(res: Response): Promise<Response> {
  cors(res);
  const result = await getCountFromDb();
  logger.info(`count: ${result.count}`);
  return res.json(result);
}

//  Express でエントリポイントを作成する。
const app = Express();
app.get('/increment/:val', (req: Request, res: Response) => changeCount(req, res, +1));
app.get('/decrement/:val', (req: Request, res: Response) => changeCount(req, res, -1));
app.get('/current_count',  (req: Request, res: Response) => getCurrentCount(res));

//  DBを初期化し、Webサーバを起動。
initdb(() => app.listen(3000, () => logger.info('Example app listening on port 3000!')));
