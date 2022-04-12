## SHUOSC 藏书目录 – 图书信息

### 说明

`metadata` 路径下以 json 格式存放 SHUOSC 藏书的基础信息，用于对外展示藏书目录的基础信息来源。

文件名需要按照 `{isbn}__{title}.json` 格式，文件名只允许出现简体中文、英文和数字，符号等用 `_` 代替，题名、副题名和版本信息之间用`__`分隔，其余连续的 `_` 写为一个。典型的文件名为：`9787111403920__分布式系统__概念与设计__原书第5版.json`。

### 数据字典

#### 图书

| 中文名称 | 英文名称           | 数据类型 | 值域     | 约束 / 条件 |
| -------- | ------------------ | -------- | -------- | --------- |
| ISBN 号 | `isbn` | `string` | 符合国际标准书号要求，无分隔符<br />如：9787111251217 | M |
| 题名 | `title`           | `string` | 自由文本 | M         |
| 并列题名 | `parallel_title`   | `string` | 自由文本 | O         |
| 丛书名   | `series_title`     | `string` | 自由文本 | O         |
| 责任者 | `author` | `string` | 自由文本 | M |
| 正文语种 | `language_code` | `string`   | [ISO 639-2/B 语种代号](https://zh.wikipedia.org/wiki/ISO_639-2%E4%BB%A3%E7%A0%81%E8%A1%A8)<br />如：中文(汉语)——chi，英语——eng | M         |
| 内容简介 | `description`      | `string`   | 自由文本                                                     | M         |
| 出版社 | `publisher` | `string`   | 自由文本                                                     | M        |
| 中图分类号 | `clc_number` | `string` | 自由文本                        | O         |
| 出版时间 | `publication_date` | `string` | 按照 `YYYY-MM` 格式 | M |
| 定价 | `pricing` | `string` | 两位小数<br />如：89.00 | M |
| 页数 | `total_pages` | `string` | 自由文本 | M |
| 装帧 | `binding` | `string` | 如：平装、精装 | M |
| 是否套装 | `suit_flag` | `boolean` | false——否，true——是 | M |

