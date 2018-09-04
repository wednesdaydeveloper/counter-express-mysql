import { ConnectionOptions, createConnection, Repository } from 'typeorm';
import { Counter } from './entity/counter';

/** counter テーブルのレポジトリ */
let repository : Repository<Counter>;

/**
 * APIのレスポンスをあらわすインターフェイス
 */
export interface ICounterResult {
  /** 更新後の counter レコード。または undefined */
  count: number | undefined;
  /** エラー時の原因 */
  error: string | undefined;
}

/**
 * エラー時の ICounterResult のインスタンスを返す。
 * @param reason エラーの理由
 */
export function error(error: string) : ICounterResult {
  return { error, count: undefined };
}

/**
 * 正常に count を取得できたときに ICounterResult のインスタンスに値をセットして返す。
 * @param count count の値
 */
function succeed(count: number) : ICounterResult {
  return { count, error: undefined };
}

/**
 * Loan パターンを用いて、counter テーブルの読み込みと行進を行う処理を行う。
 * @param updateCounterFunc counter　レコードの値を更新するためのラムダ式
 */
export function loanDb(updateCounterFunc: (c : Counter) => void): Promise<ICounterResult> {
  return repository.findOne({ id: 1 })
    .then((counter) => {
      updateCounterFunc(counter!);
      return repository.save(counter!);
    })
    .then(update => update!.count)
    .then(succeed)
    .catch(err => error('It failed to update record.'));
}

/**
 * DB から現在の count を取得して返す。
 */
export function getCountFromDb(): Promise<ICounterResult> {
  return repository.findOne({ id: 1 })
    .then(counter => counter!.count)
    .then(succeed)
    .catch(err => error('It failed to get record.'));
}

/**
 * DBへの接続情報
 */
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

/**
 * DBを初期化する。
 * @param func DB 初期化後に呼ばれるラムダ式
 */
export function initdb(func: () => void) {
  //  DBへのConnectionを取得し、Webサーバを起動するので。
  createConnection(options)
    .then(async (connection) => {
      repository = connection.getRepository(Counter);
      func();
    })
    .catch(error => console.log(error));
}
