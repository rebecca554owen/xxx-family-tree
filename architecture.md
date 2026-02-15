# 家族图谱应用架构文档（architecture）

## 1. 总体架构
- 前端单页应用（React + Zustand + React Flow）。
- Supabase 作为统一后端能力：
- Postgres（结构化数据）
- Storage（头像）

## 2. 模块划分

### 2.1 Store 层（`useFamilyStore`）
- 聚合状态：
- `members`、`units`、`unitMembers`、`unitRelations`
- `selectedMemberId`、`selectedUnitId`
- `viewMode`、线条可见性、布局缓存
- 关键动作：
- 单元关系增删改（add/reconnect/delete）
- 夫妻位置互换（swapUnitPartners）
- 头像更新（upload + fallback）

### 2.2 Persistence 层
- `familyUnitPersistence.ts`：V2 单元模型读写。
- `familyPersistence.ts`：旧模型兼容 + 头像上传。

### 2.3 Graph 层
- `FamilyGraph.tsx`：主图渲染与交互编排。
- `UnitNode.tsx`：单元卡（单人/双人、头像选人、互换按钮、多锚点）。
- `RelationshipEdge.tsx`：关系线样式、高亮、稳定路由。

## 3. 数据流
1. `initializeData()` 先加载 legacy，再尝试 V2 快照。
2. 视图读取 V2 数据渲染单元与关系。
3. 用户操作（拖拽/连线/互换）先本地更新，再异步同步 Supabase。
4. 同步失败通过 `syncError` 通知 UI。

## 4. 连接架构决策（本次）
- 决策 E：从“连线后弹窗选类型”改为“按端点方向自动推断类型”。
- 决策 F：单元卡连接锚点扩展为每边 3 个，提升命中率与可操作性。
- 决策 G：父子关系优先使用底部到顶部锚点，兄弟关系优先左右锚点。
- 决策 H：关系线句柄选择采用关系 ID 稳定分配，降低多连接时线条抖动。
- 决策 I：提高边线交互宽度与连接半径，并提升线条渲染层级，减少遮挡。
- 决策 J：连接失败不静默，直接显示操作提示。

## 5. 当前约束
- 右侧编辑面板仍以成员详情为主，单元编辑能力仍在演进。
- 父系/母系识别仍部分依赖姓名关键词，后续可改为显式标签或规则引擎。
