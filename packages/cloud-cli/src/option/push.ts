import fs, { promises as fsPromises } from "fs";
import signale from "signale";
import superagent from "superagent";
import path from "path";
import COS from "cos-nodejs-sdk-v5";
import zip from "cross-zip";
import tmp from "tmp";
import fsExtra from "fs-extra";
import {
  getPackageConfig,
  pkgNameToNormalPkgName,
  getCustomConfig,
} from "../config/utils";
import { Cli } from "../type";
import build from "./build";

const BUCKET_NAME = 'cloud-zip-1254430332';
const UNZIP_BUCKET_NAME = 'cloud-unzip-1254430332';
const REGION = 'ap-guangzhou';
const SUBDIR = 'cloud-object';
const BUCKET_URL =
  `https://${BUCKET_NAME}.cos.${REGION}.myqcloud.com/${SUBDIR}`;
const UNZIP_BUCKET_URL =
  `https://${UNZIP_BUCKET_NAME}.cos.${REGION}.myqcloud.com/${SUBDIR}`;
// const CLOUD_API = "http://api.tainlx.site/api/v1/cloud_object";
const CLOUD_API = "http://localhost:8080/api/v1";

const CLOUD_OBJECT_QUERY_API = `${CLOUD_API}/cloud_object/query`;
const CLOUD_OBJECT_COMMIT_API = `${CLOUD_API}/cloud_object/commit`;
const CLOUD_OBJECT_COMMIT_UPDATE_API = `${CLOUD_API}/cloud_object/update_commit`;
const CLOUD_UPLOAD_KEY_API = `${CLOUD_API}/cos/key`;
const USER = "tainlx";
interface ProcessResponse {
  success: boolean;
  data?: any;
  message?: string;
}

const DEFAULT_CLI_CONFIG: Cli = {
  out: "dist",
  type: "mpa",
};

export default async function (cliConfig: Cli) {
  const id = cliConfig.id;
  if (!id) return;
  signale.start("正在获取云物件信息...");
  const rsl = await superagent
    .get(CLOUD_OBJECT_QUERY_API)
    .query({ cloud_object_id: id })
    .then((r) => r.body.data as any[]);
  signale.success("ok");
  if (rsl.length) {
    signale.start("正在获取上传配置...");
    const keyData = await superagent
      .get(CLOUD_UPLOAD_KEY_API)
      .query({ user: USER })
      .then(
        (r) =>
          r.body as {
            expiredTime: number;
            credentials: {
              sessionToken: string;
              tmpSecretId: string;
              tmpSecretKey: string;
            };
            startTime: number;
          }
      );
    signale.success("ok");
    const cos = new COS({
      getAuthorization(options, callback) {
        callback({
          TmpSecretId: keyData.credentials.tmpSecretId, // 临时密钥的 tmpSecretId
          TmpSecretKey: keyData.credentials.tmpSecretKey, // 临时密钥的 tmpSecretKey
          XCosSecurityToken: keyData.credentials.sessionToken, // 临时密钥的 sessionToken
          ExpiredTime: keyData.expiredTime, // 临时密钥失效时间戳，是申请临时密钥时，时间戳加 durationSeconds
          StartTime: keyData.startTime,
        });
      },
    });
    const { name: pkgName, version, path: pkgPath } = getPackageConfig();
    const outputPath = DEFAULT_CLI_CONFIG.out;
    const customConfig = getCustomConfig();
    const { cloud = {} } = customConfig;
    const tasks = [];
    if (cloud) {
      tasks.push(
        fsPromises.writeFile(`${outputPath}/cloud.json`, JSON.stringify(cloud))
      );
    }
    tasks.push(fsPromises.copyFile(pkgPath, `${outputPath}/pkg.json`));
    const f = rsl[0];
    const params = {
      cloud_object_id: id,
      name: f.name,
      pkg_name: pkgName,
      pkg_version: version,
      creator: "test",
    };

    signale.start("正在创建提交信息...");
    const {
      success,
      data: { commit_id },
    } = await superagent
      .get(CLOUD_OBJECT_COMMIT_API)
      .query(params)
      .then((r) => r.body as { success: boolean; data: { commit_id: string } });
    if (!success) return;
    signale.success("ok");
    const tmpDir = tmp.dirSync();
    // console.log(tmpDir.name);
    const bucketPath = `${f.name}/${pkgNameToNormalPkgName(
      pkgName
    )}/${version}/${commit_id}`;
    const zipDeepestDir = path.resolve(tmpDir.name, bucketPath);
    DEFAULT_CLI_CONFIG.publicPath = `${UNZIP_BUCKET_URL}/${bucketPath}/`;
    await build(DEFAULT_CLI_CONFIG).catch((err) => console.log(err));
    await fsExtra.ensureDir(path.join(tmpDir.name, zipDeepestDir));
    await fsExtra.copy(`${path.resolve(outputPath)}`, zipDeepestDir);
    // console.log(fs.readdirSync(zipDeepestDir));
    const dist = path.join(tmpDir.name, `${f.name}.zip`)
    zip.zipSync(
      path.join(tmpDir.name, f.name),
      dist
    );
    signale.start("正在上传...");
    await cos.putObject({
      Bucket: BUCKET_NAME,
      Region: REGION,
      Key: `${SUBDIR}/${bucketPath.split('/').join('_')}.zip`,
      StorageClass: 'STANDARD',
      Body: fs.createReadStream(dist)
    })
    signale.success("ok");
    await superagent
      .get(CLOUD_OBJECT_COMMIT_UPDATE_API)
      .query({ commit_id, src: `${UNZIP_BUCKET_URL}/${bucketPath}` })
      .then((r) => {
        if (r.body.success) {
          signale.success("上传完成");
        } else {
          signale.error("更新src失败");
        }
      });
    await fsExtra.remove(tmpDir.name);
  }
}