import 'reflect-metadata';
import { ConnectionOptions, createConnection, Repository } from 'typeorm';
import { Counter } from './entity/counter';
import * as Express from 'express';

/** counter テーブルのレポジトリ */
let repository : Repository<Counter>;

/**
 * APIのレスポンスをあらわすインターフェイス
 */
interface IJson {
  /** 結果コード */
  code: number;
  /** 更新後の counter レコード。または undefined */
  count: number | undefined;
  /** エラー時の原因 */
  reason: string | undefined;
}

/**
 * Loan パターンを用いて、counter テーブルの読み込みと行進を行う処理を行う。
 * @param updateCounterFunc counter　レコードの値を更新するためのラムダ式
 */
async function loanDb(updateCounterFunc: (c : Counter) => void) {
  const counter = await repository.findOne({ id: 1 });
  let json : IJson;
  if (counter !== undefined) {
    updateCounterFunc(counter);
    const result = await repository.save(counter);
    json = { code: 0,  count: result.count, reason: undefined };
  } else {
    json = error('It failed to get record.');
  }
  console.log(json);
  return json;
}

/**
 * エラー時の IJson のインスタンスを返す。
 * @param reason エラーの理由
 */
function error(reason: string) : IJson {
  return { reason, code: 500, count: undefined };
}

/**
 * パラメーターから変化量（val）を取得し、DBを行進する。
 * @param req リクエスト
 * @param res レスポンス
 * @param sign +の値の場合は増加、-の値の場合は減少
 */
async function process(req: Express.Request, res: Express.Response, sign: number) {
  const num = parseInt(req.params.val, 10);
  res.setHeader('Access-Control-Allow-Origin', '*');
  return Number.isNaN(num)
    ? res.json(error('val is NaN.'))
    : res.json(await loanDb(c => c.count = c.count + num * sign));
}

//  Express でエントリポイントを作成する。
const app = Express();
app.get('/increment/:val', (req: Express.Request, res: Express.Response) => process(req, res, +1));
app.get('/decrement/:val', (req: Express.Request, res: Express.Response) => process(req, res, -1));

//  DBへの接続情報
const options: ConnectionOptions = {
  type: 'mysql',
  host: 'mysql',
  port: 3306,
  username: 'counter_user',
  password: 'counter_userpass',
  database: 'counter_db',
  synchronize: false,
  entities: [Counter],
  logging: true,
};

//  DBへのConnectionを取得し、Webサーバを起動するので。
createConnection(options)
  .then(async (connection) => {
    repository = connection.getRepository(Counter);
    app.listen(3000, () => console.log('Example app listening on port 3000!'));
  })
  .catch(error => console.log(error));
