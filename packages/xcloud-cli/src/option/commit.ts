import fs, { promises as fsPromises } from 'fs';
import tar from 'tar'
import signale from 'signale';
import superagent from 'superagent';
import path from 'path';
import rimraf from 'rimraf';
import getWebpackConfig from '../config';
import { getPackageConfig, pkgNameToNormalPkgName } from '../config/utils';

const COMMIT_URL = 'http://localhost:8080/component/commit';

interface ICommitCli {
  id: string,
}

interface ProcessResponse {
  success: boolean,
  data?: any,
  message?: string,
}

export default async function(cliConfig: ICommitCli) {
  const { id } = cliConfig;
  const { config, customConfig } = getWebpackConfig('prod');
  const { name: pkgName, version, path: pkgPath } = getPackageConfig();
  const validPkgName = pkgNameToNormalPkgName(pkgName);
  const outputPath = config?.output?.path;
  const hasDist = fs.existsSync(outputPath);
  if (!hasDist) {
    signale.fatal('未找到 dist 文件夹, 请先打包应用')
    return;
  }

  if (!id) {
    signale.fatal('未设置组件id，添加选项 --id [component_id]')
    return;
  }

  const { remotes, exposes } = customConfig;

  const tasks = [];
  if (remotes) {
    tasks.push(
      fsPromises.writeFile(`${outputPath}/remotes.json`, JSON.stringify(remotes))
    )
  }

  if (exposes) {
    tasks.push(
      fsPromises.writeFile(`${outputPath}/exposes.json`, JSON.stringify(exposes))
    )
  }

  await Promise.all(tasks);

  await fsPromises.copyFile(pkgPath, `${outputPath}/pkg.json`)
  const prefix = '';
  const dist = path.basename(outputPath);
  const filesInDist = fs.readdirSync(outputPath);
  const gzipFilename = `${validPkgName}.tar.gz`;
  const { success } = await tarFiles(prefix, dist, filesInDist, gzipFilename);
  if (success) {
    await upload({
      filename: gzipFilename,
      component_id: id,
      package_name: pkgName,
      package_version: version,
    }).catch((e) => {});
  }
  rimraf.sync(gzipFilename)
}

async function tarFiles(prefix, dist: string,files: string[], name): Promise<ProcessResponse> {
  if (!name) {
    console.error('无项目名称');
    return {
      success: false,
      message: '无项目名称'
    }
  }

  return await new Promise<ProcessResponse>((res, rej) => {
    signale.pending('正在压缩文件...');
    tar.c(
      {
        file: name,
        prefix: prefix,
        preservePaths: false,
        cwd: path.join(process.cwd(), dist),
        gzip: true,
      },
      files
    ).then(() => {
      res({
        success: true,
      });
      signale.success('压缩完成!');
    }).catch((e) => {
      signale.fatal(`压缩失败: ${e}`);
      rej({
        success: false,
        message: e
      })
    })
  })

}

async function upload(params: {
  filename: string;
  component_id: string;
  package_name: string;
  package_version: string;
}) {
  const {
    filename,
    component_id,
    package_name,
    package_version,
  } = params;
  const file = fs.createReadStream(filename);
  signale.pending('正在上传...');
  await superagent
    .post(COMMIT_URL)
    .attach('file', file)
    .field('component_id', component_id)
    .field('package_name', package_name)
    .field('package_version', package_version)
    .then(({ body }) => {
      const { success, data, error } = body;
      if (success) {
        signale.success(data);
      } else {
        signale.fatal(error || '上传失败，请联系管理员');
      }
    })
    .catch(e => {
      signale.fatal(e || '上传异常，请联系管理员');
    });
}