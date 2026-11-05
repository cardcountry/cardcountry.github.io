# META LAB — TCG Intelligence Hub

> 维护记录更新：2026-11-05。本站为 Card Country KC 维护的静态多页资料站。

## 发布方式

- 唯一发布目标：<https://www.cardcountrymetalab.run.place/>。
- 源码仓库：<https://github.com/cardcountry/cardcountry.github.io>，`main` 分支。
- 用户明确要求后续只更新自有域名；不要发布或同步到 QW Pages。
- GitHub Pages 发布时保留仓库根目录的 `CNAME` 和 `.nojekyll`。
- 站点由 HTML、CSS、JavaScript 与本地数据文件构成，无构建步骤。页面脚本依赖 `window.*` 数据变量，保留 HTML 中的脚本顺序。

## 页面与当前资料

| 页面 | 当前内容 | 已核对资料 / 覆盖日期 |
|---|---|---|
| `index.html` | 站点入口，7 个已开放游戏 | 首页游戏数与 Union Arena 入口已同步 |
| `ptcg.html` | Pokémon TCG Standard | 10 个卡组类型、111 份赛事卡表及 4 份近期社区赛事卡表；完整赛事资料覆盖至 2026-10-31 |
| `gcg.html` | Gundam Card Game | 1,113 张卡、91 场赛事；快照同步于 2026-11-03，最新赛事日期 2026-10-31 |
| `beyblade.html` | BEYBLADE X 赛事组合与零件资料 | 226 个追踪组合、273 个零件；当前 WBO 汇总窗口为 2026-08-19 至 2026-10-18 |
| `opcg.html` | One Piece Card Game | 2,850 张卡；OP17.5 121 份、OP16 8 份完整卡表。新增 32 份 2026-11-01 至 11-03 的公开赛事卡表 |
| `marvel.html` | Marvel Hero Rush | 668 张官方卡牌印刷、44 份完整赛事卡表；目录快照检查日 2026-10-30，最新赛事记录为 2026-10-17 |
| `riftbound.html` | Riftbound | 1,408 张卡牌印刷、12 份完整卡表；目录快照日 2026-10-31 |
| `unionarena.html` | Union Arena 规则摘要、官方卡牌搜索和赛事卡组入口 | 官方目录有 26 个标题选项；目录核对日 2026-11-05，官方目录显示更新至 2026-10-30 |
| `v22.html` | PTCG v22 变体 | 与主 PTCG 页共享卡组数据和卡表完整性信息 |

## 数据与来源原则

- 各游戏的 `*-data.js` 文件为页面数据源；按实际数据覆盖时间标注日期，不把检查日期写成赛事日期。
- PTCG、GCG、OPCG、Marvel、Riftbound 与 BEYBLADE X 的搜索筛选使用简化的关键词查找流程；保留来源链接与覆盖时间。
- OPCG 新增卡表来自 OPTCG.GG 公开赛事记录，数据文件 `opcg-recent-data.js` 保留每份卡表的原始链接；32 份均核实为 50 张主牌，Leader 单独排除。
- Union Arena 页只提供规则摘要、官方检索入口与官方赛事卡组链接，不转载官方卡图或完整卡文。
- 照片成绩应先核对原图，再转换为虚拟卡表；禁止猜补模糊或未显示的卡牌。

## 最近修复与审核

- 修正 PTCG 多语言版本中失效的 81/35 旧统计，统一为 111 份赛事卡表和 4 份社区赛事卡表。
- 将首页已开放游戏数改为 7，并修正其余游戏尚未开放的旧提示。
- 更新首页预取映射和页面缓存版本号，避免上线后继续使用旧 JavaScript。
- Union Arena 已开放，加入首页与各游戏切换入口。
- OPCG 快照补入 11 月 1–3 日的 32 份近期完整卡表，更新同步日期和首页 OP17 卡表数。
- Beyblade 页面明确显示 WBO 汇总结束日期，避免将 10 月 18 日快照误读为当天赛事。
- 静态审核覆盖 9 个 HTML 页面：本地资源、页面链接与锚点均完整；无重复 ID、失效 CSS 图片或缺少 `noopener` 的新标签页链接。
- 数据质量校验：PTCG 115 份可见完整卡表、GCG 1,155 份列表、OPCG 129 份列表、Marvel 44 份列表、Riftbound 12 份列表和 BEYBLADE X 226 个组合均未发现隔离项。

## 尚需用户提供的材料

- 上传包有 1,908 个条目，其中 1,866 个图片文件；赛事成绩照片未包含在内。需要照片转录时，请直接附上清晰的赛事成绩图片。
- Codex 当前没有已注册项目，因此这段对话还不能加入真实项目。对话标题为 `Meta Lab`；在 Codex 创建项目后，才可把对话移入该项目。

## 发布检查清单

1. 只发布到 `cardcountrymetalab.run.place` 所指向的 GitHub Pages 仓库；不要触碰 QW Pages。
2. HTML 引用的本地资源必须存在，JavaScript 与 CSS 地址必须带递增的 `?v=N`。
3. 新卡表要保留来源、日期、玩家或名次（来源未公开的字段留空），并验证总张数后再纳入数据。
4. 确认 `CNAME` 仍写有 `www.cardcountrymetalab.run.place`，且 `.nojekyll` 保留。
5. 发布后检查自有域名首页及对应资料页已更新。


