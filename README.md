

# 后台开发

---

## Node.js
![](https://gss1.bdstatic.com/-vo3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike220%2C5%2C5%2C220%2C73/sign=635ae65776d98d1062d904634056d36b/9825bc315c6034a81358c82ac1134954082376e6.jpg)<!-- .element height="50%" width="50%" --> 

[官网](https://nodejs.org/en/): Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.

---

## 主要用途
- 开发前端应用
- 快速搭建web服务

---

## npm

* 安装 Node 的时候，会同时安装 npm
```sh
$ npm -v
```
* 它是Node的模块管理器，开发Node项目的必备工具
* npm是世界上最大的开源代码库，拥有丰富的功能强大的开源模块

* 如果觉得使用npm下载模块的时候速度缓慢，可以设置npm的源为淘宝源:
```sh
$ npm config set registry https://registry.npm.taobao.org
```

---

## REST API

REST 是浏览器与服务器通信方式的一种设计风格

它的全称是“REpresentational State Transfer”

中文意为”表现层状态转换“

- Resource：资源
- Representation：表现层
- State：状态
- Transfer：转换

---

## REST 的核心概念
REST是”REpresentational State Transfer”，一种翻译是”表现层状态转移”

1. 互联网上所有可以访问的内容，都是资源
1. 服务器保存资源，客户端请求资源
1. 同一个资源，有多种表现形式
1. 协议本身不带有状态，通信时客户端必须通过参数，表示请求不同状态的资源
1. 状态转换通过HTTP动词表示

<small>简单来说，REST是所有web应用都应该遵守的架构设计指导原则，每一个URL代表一种资源，客户端通过四个HTTP动词，对服务器端资源进行操作，实现”表现层状态转化”</small>

---

## URL和查询字符
- URL 是资源的唯一识别符。
```
/company
/company/employee
```
- 查询字符串表示对所请求资源的约束条件。如果记录数量很多，服务器不可能都将它们返回给用户。API应该提供参数，过滤返回结果。
```
/company?name=baidu
/company/employee?name=baidu&year=24
```

---

## HTTP动词

| 操作      |  SQL方法   | HTTP动词   |
| - | :-: | -: |
| CREATE   | INSERT     | POST      |
| READ     | SELECT     | GET       |
| UPDATE   | UPDATE     | PUT/PATCH |
| DELETE   | DELETE     | DELETE    |

```
GET /v1/stores/1234 若要检索某个资源，应该使用 GET 方法。
PUT /v1/stores/1234 若要更改资源状态或对其进行更新，应该使用 PUT 方法。
POST /v1/stores 若要在服务器上创建资源，应该使用 POST 方法。
DELETE /v1/stores/1234 若要删除某个资源，应该使用 DELETE 方法。
```

---

## Express
Express 是最常用的 Node 框架，用来搭建 Web 应用，类似于Java里的SpringMVC

---

### Express step by step
### step-0：初始化

```sh
$ git clone https://github.com/lxs137/expressjs-quick-start.git
$ cd expressjs-quick-start && git checkout step-0
$ npm install
$ npm start
```

查看运行结果
```sh
$ curl http://localhost:3000/
```

---

#### Web服务器的启动

```typescript
const app: express.Express = require("./app");
const server = http.createServer(app);
server.listen("3000", () => {});
```

- `src/server.ts`是Web服务器的入口
- Express服务器的配置位于`src/app.ts`中，通过`require`关键字导入模块
- 利用Nodejs原生的http模块，加载Express服务器，并监听在3000端口上

---

#### Express服务器的配置

```typescript
const app = express();
app.use(compression());
app.use(bodyParser.json());
...

export interface RequestHandler<P extends Params = ParamsDictionary> {
  (req: Request<P>, res: Response, next: NextFunction): any;
}
```

- Handler函数对传入的`req(请求体)`和`res(请求响应体)`进行处理，也可交给`next(之后的Handler函数)`处理
- Express服务器的逻辑很简单，就是组合若干个Handler函数

---

#### HTTP路由的处理
```typescript
const indexRouter = Router();
indexRouter.get("/", (req: Request, res: Response) => {
  res.status(200).send("ok");
});
```

- `src/routes/index.ts`是HTTP请求分发的入口
- Router(HTTP路由的处理)也是继承于Handler函数，一般来说是Express整个Handler链中的最后一环
- Router根据`GET|POST|DELETE`等HTTP动词和请求URL来分发HTTP请求

---

### step-1：连接数据库
- MongoDB
  - 文档型数据库，一条记录就是一个文档
  - 上手快，配置简单！！！
- Mongoose
  - MongoDB ORM(维护Nodejs对象与数据库记录之间的映射关系)

```sh
$ git checkout step-1
$ npm start
```

---

#### 定义存储对象Task(`src/models/task.ts`)

```typescript
const TaskSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: String,
  create_at: {
    type: Date,
    required: true,
    default: Date.now
  }
});
export const Task = mongoose.model("Task", TaskSchema);
```

---

#### 创建Task(`src/controllers/taskCtrl.ts`)

```typescript
export const createTask = (id: string, name: string): Promise<any> => {
  return Task.create({
    "id": id,
    "name": name
  }).then(
    (task: Document) => task.toObject(),
    (reason: any) => Promise.reject(reason)
  );
}
```
- 对于mongoose构造的Task对象，对它的操作返回的是[Promise](http://liubin.org/promises-book/)对象

---

#### POST接口创建Task(`src/routes/index.ts`)

```typescript
indexRouter.post("/task", (req: Request, res: Response) => {
  const { id, name } = req.body;
  createTask(id, name).then(
    (task) => res.status(200).json(task),
    (err) => res.status(500).send(err)
  );
});
```
- [body-parser](https://github.com/expressjs/body-parser)是一个Express官方提供的中间件(middleware)
- body-parser可根据HTTP请求的Content-Type自动提取出请求的内容，通常POST请求的Content-Type为application/json
- 可通过[Postman](https://www.getpostman.com/)等插件构造HTTP请求进行调试

---

### step-2：查询Task

```sh
$ git checkout step-2
$ npm start
```

---

```typescript
export const queryTasksByName = (name: string): Promise<any> => {
  return Task.find({ "name": name }).exec().then(
    (tasks: Document[]) => tasks.map(item => item.toObject()),
    (reason: any) => {
      return Promise.reject(reason);
    }
  )
}
indexRouter.get("/tasks", (req: Request, res: Response) => {
  queryTasksByName(req.query.name).then(
    (tasks) => res.status(200).json(tasks),
    (err) => res.status(500).send(err)
  );
});
```

---

### step-3：中间件

```sh
$ git checkout step-3
$ npm start
```
- body-parser、router本质都是中间件，整个Express的设计哲学就是不断对HTTP请求加工，然后返回一个HTTP响应体
- 例子：创建Task时，需要对Task的id编码格式(ts-xxx)进行验证，如果格式不对，则请求直接结束

---

```typescript
const CreateTaskReqSchema = {
  "body": {
    id: Joi.string().regex(/^ts-[0-9]{3}$/).required(),
    name: Joi.string().required()
  }
};
```

- 使用[Joi](https://github.com/hapijs/joi)对请求体进行验证

---

```typescript
const validate = (schema, options?): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Joi.validate(req.body, schema, options,
     (err: any, value: any) => {
      if (err) {
        return res.status(400).send("params unValidate");
      } else {
        return next();
      }
    });
  };
};
router.post("/task", validate(schema), ...);
```

- 在请求进入业务相关的Handler之前，先进行数据格式的验证
- 对于每一个路由，validate函数给入请求的schema，生成对应的验证中间件函数

---

## 参数获取的方式
- 除了req.body获取参数的方式外，还有req.query和req.params两种方式
- 对于URL的查询字符串,比如`/tasks?name=job`里面的name，可以用req.query.name获取
- 对与URL中的参数，比如`/tasks/ts-101`与路由`/tasks/:id`相匹配，URL中的ID可以用req.params.id获取

---

## 练习
1. 使用put和delete操作，添加修改和删除任务的接口，修改和删除指定id的task，通过req.params获取参数
2. 修改get请求，获取给定日期的task，通过req.query获取参数


---

## The End
