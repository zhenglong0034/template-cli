#!/usr/bin/env node
/*
 * @Author: your name
 * @Date: 2021-05-06 20:08:16
 * @LastEditTime: 2022-02-14 17:39:10
 * @LastEditors: zl
 * @Description: In User Settings Edit
 * @FilePath: /picture-book-tools/src/utils/download-picture-book/index.js
 */
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const AdmZip = require("adm-zip")


function downModule(url, downPath) {
  // 下载文件夹内的文件
  const filePath = path.join(downPath, `module.zip`);
  // 下载
  return new Promise((resolve) => {
    axios.get(url, { responseType: 'arraybuffer' }).then((res) => {
      if (res.status === 200 && res.statusText === 'OK') {
        if (!res.data) {
          return Promise.reject('err');
        }
        fs.writeFileSync(filePath, res.data);
        setTimeout(() => {
            extraZipFile(filePath, downPath).then((res) => {
            console.log("extracted path:", res);
            resolve();
            });
        }, 1000)
      }
    });
  });
}

async function extraZipFile(source, targetDir) {
  console.log('start extrac zip file');
  const zip = new AdmZip(source);
  try {
    zip.extractAllTo(targetDir, true);
    fs.unlinkSync(source)
    return Promise.resolve(targetDir);
  } catch (err) {
    console.log('Extraction failed');
    console.error(err);
    return Promise.resolve();
    // handle any errors
  }
}

downModule("http://static.du.youdao.com/cli-template/starfire-template.zip", __dirname + "/")