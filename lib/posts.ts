export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  tags: string[];
  readTime: string;
  author: string;
  featured?: boolean;
  sections: Array<{
    heading?: string;
    paragraphs: string[];
  }>;
};

export const posts: Post[] = [
  {
    slug: "nextjs-beginner-notes",
    title: "从零开始搭建个人博客：我用 Next.js 做了第一个作品",
    excerpt:
      "记录我在大二上学期搭建博客时的技术选型、页面设计和实战收获，重点讲清楚为什么这次项目适合学生阶段的成长路径。",
    date: "2026-08-10",
    category: "前端开发",
    tags: ["Next.js", "博客搭建", "前端实践"],
    readTime: "6 分钟",
    author: "林晨",
    featured: true,
    sections: [
      {
        heading: "为什么选 Next.js",
        paragraphs: [
          "当我第一次想做个人博客时，我很容易陷入“要不要学全栈”的困惑。后来我想明白，博客最关键的价值不是炫技，而是把自己的学习和作品有条理地沉淀下来。",
          "于是我选择了 Next.js，因为它既适合快速搭建页面，又能保留可扩展性。对学生开发者来说，最重要的是能够在短时间内看到成品，同时有足够空间继续迭代。",
          "这也让我第一次真正理解了前端工程的思路：不仅是页面写出来，还需要考虑布局、路由、内容结构和可维护性。"
        ]
      },
      {
        heading: "搭建时的核心体会",
        paragraphs: [
          "我最重视的是页面结构和内容层次。首页不需要特别复杂，但必须让访问者一眼知道你是谁、写什么、你过去做过什么。",
          "我把导航、文章列表、归档和关于页分开设计，分别承担不同的职责。这样站点不仅更易读，也方便后续持续更新。",
          "此外，Tailwind 让我把 CSS 处理得更快，样式可以直接建立在组件层面，而不需要反复切页面。对当时的我来说，这是一个非常高效的体验。"
        ]
      },
      {
        heading: "这次项目带给我的收获",
        paragraphs: [
          "最重要的不是代码多么炫，而是我第一次把自己的学习成果变成了一个可展示的产品。之后无论是投简历、写总结，还是参与项目复盘，这个博客都成了一个不错的入口。",
          "从工程视角看，它还帮助我练习了路由设计、组件拆分、页面迭代和响应式布局。对我这种大二学生来说，这已经是非常有价值的实战积累了。"
        ]
      }
    ]
  },
  {
    slug: "data-structures-learning-routine",
    title: "我的数据结构学习节奏：从刷题到建立理解框架",
    excerpt:
      "我用一套“概念 + 实践 + 复盘”的节奏来学习数据结构，重点不是背题，而是逐步建立真正的抽象认知。",
    date: "2026-07-28",
    category: "计算机基础",
    tags: ["数据结构", "算法", "学习方法"],
    readTime: "5 分钟",
    author: "林晨",
    sections: [
      {
        heading: "先理解，再刷题",
        paragraphs: [
          "在刚接触数据结构时，我很容易把它当成一堆题的集合。后来我意识到，真正需要培养的是“看到问题时能判断适合什么结构”的能力。",
          "比如栈适合处理逆序和回溯，队列适合批处理和广度优先搜索，树和图则更需要结合场景去理解。学习数据结构的关键，不是记住所有定义，而是知道它们为什么存在。"
        ]
      },
      {
        heading: "我的学习节奏",
        paragraphs: [
          "我习惯把学习拆成三步：先看概念和时间复杂度，再写一个最小实现，最后用真实场景复盘。比如学习二叉树时，我会先理解它的结构和遍历思路，再自己手写递归代码，最后用二叉搜索树这一例子理解它在实际中的价值。",
          "这样做的好处是，理论和代码不再割裂。我能更清楚地知道每种结构的适用范围，以及为什么某些题目需要把数据组织成树或图。"
        ]
      },
      {
        heading: "复盘比刷更多题更重要",
        paragraphs: [
          "很多人会觉得“刷题量越多越好”，但对我而言，复盘更关键。每次做题后，我都会问：这道题为什么不适合数组？为什么这里适合哈希表？是否有更优的复杂度设计？",
          "逐渐地，我发现自己的理解层次提升得比单纯刷题更明显。这个过程让我更接近“真正会用数据结构”，而不是“会背题”。"
        ]
      }
    ]
  },
  {
    slug: "project-retrospective-first-website",
    title: "第一个项目复盘：从“能跑起来”到“有结构地做成东西”",
    excerpt:
      "我对第一个前端/全栈项目做了复盘，发现真正的关键不是功能多，而是从最小可用产品一路迭代到更清晰的工程组织。",
    date: "2026-06-19",
    category: "项目复盘",
    tags: ["项目经验", "工程思维", "复盘"],
    readTime: "7 分钟",
    author: "林晨",
    sections: [
      {
        heading: "项目刚开始时的误区",
        paragraphs: [
          "第一次做项目时，我很容易过度关注“有没有功能”，而忽视了产品结构。代码能跑起来是一件好事，但如果没有清晰的模块划分，很快就会进入“越改越乱”的状态。",
          "这让我意识到，工程能力不是一开始就写得特别复杂，而是从一开始就把结构想清楚。"
        ]
      },
      {
        heading: "我调整的几个点",
        paragraphs: [
          "首先是把页面拆成多个模块：导航、列表、详情、表单和状态管理。接着我定义了更明确的数据流，避免前后端耦合过深。",
          "我还开始重视命名和注释的质量，尽量让代码自己说明自己在做什么，而不是靠一大段解释。对项目维护来说，这个习惯非常重要。"
        ]
      },
      {
        heading: "现在的收获",
        paragraphs: [
          "这次复盘后，我最明显的变化是：不再追求一次性写到位，而是习惯从页面、模块、接口、状态几个层次去思考。这样做虽然慢一点，但后期迭代的成本低很多，而且能更清楚地看出哪些地方还需要调整。",
          "这也是我把项目经验转化为工程基建能力的重要一步。"
        ]
      }
    ]
  },
  {
    slug: "weekly-learning-rhythm",
    title: "一周学习节奏：如何在大二保持技术进步而不 burnout",
    excerpt:
      "我在学习中尝试过很多方式，最终形成了一套更稳定的节奏：每天固定学习、每周复盘、每月产出总结。",
    date: "2026-05-14",
    category: "成长记录",
    tags: ["学习规划", "效率提升", "大学生活"],
    readTime: "4 分钟",
    author: "林晨",
    sections: [
      {
        heading: "固定节奏比高强度更重要",
        paragraphs: [
          "我之前有段时间非常喜欢“爆发式学习”，一口气看很多教程、刷大量题，但最后的结果往往是效率低、疲惫感强。后来我逐渐意识到，稳定比冲刺更重要。",
          "现在我每周会安排 3 个重点任务：一项基础课程学习、一项项目推进、一项复盘总结。这样既不会拖延，也不会让自己过度焦虑。"
        ]
      },
      {
        heading: "复盘让我更清醒",
        paragraphs: [
          "每周末我都会花 20–30 分钟复盘：这周学了什么、哪些内容还不够理解、下周打算怎么推进。这样的记录真的会改变学习状态，因为它让我更有方向感。",
          "我不需要记住所有细节，但我需要知道自己真正走到了哪一步。"
        ]
      },
      {
        heading: "写作是最好的反馈",
        paragraphs: [
          "当我开始写博客和笔记时，我发现自己理解得更扎实了。不是因为写作本身神奇，而是因为写作迫使我把模糊的知识变成清晰的表达。",
          "这也是我喜欢写博客的最直接原因：它不仅是输出，也是一种对自己学习状态的检查。"
        ]
      }
    ]
  },
  {
    slug: "java-core-notes",
    title: "Java 基础学习笔记：面向对象、集合与异常处理速记",
    excerpt:
      "把 Java 学习中的重点知识整理成清单，帮助我快速建立框架：面向对象、集合框架、异常机制和常见 API。",
    date: "2026-08-12",
    category: "Java 学习笔记",
    tags: ["Java", "Java 基础", "学习笔记", "面向对象"],
    readTime: "8 分钟",
    author: "林晨",
    sections: [
      {
        heading: "Java 的核心思想",
        paragraphs: [
          "学习 Java 时，我第一步并不是背很多 API，而是建立“对象是如何组织代码”的认知。面向对象强调封装、继承和多态，它是 Java 程序设计的基础思想。",
          "封装帮助我们隐藏内部实现；继承让代码复用更自然；多态让程序更加灵活。理解这三点之后，再学习集合、线程和框架会更容易。"
        ]
      },
      {
        heading: "集合框架要理解“使用场景”",
        paragraphs: [
          "List 适合顺序存储，Set 适合去重，Map 适合键值映射。理解数据结构和场景之间的关系，比单纯记住方法名更重要。",
          "我常用的复盘方式是：每次看到一个集合类，就问自己“它适合什么场景？删除和查询的复杂度是什么？为什么要选它，而不是数组或 LinkedList？”"
        ]
      },
      {
        heading: "异常处理是工程能力的一部分",
        paragraphs: [
          "在 Java 中，异常不仅是错误处理机制，也是程序设计的结构化能力。try-catch 可以控制错误传播，throws 可以把异常上抛给调用方，finally 则保证资源清理。",
          "实际开发中，我会优先关注“哪里应该抛、哪里应该捕获、资源是否需要关闭”，而不是盲目吞掉异常。"
        ]
      }
    ]
  },
  {
    slug: "springboot-learning-notes",
    title: "Spring Boot 学习笔记：从项目启动到三层架构理解",
    excerpt:
      "记录我在学习 Spring Boot 时的理解脉络，包括自动配置、注解、控制器、服务层和数据访问层如何协同工作。",
    date: "2026-08-09",
    category: "Java 后端",
    tags: ["Java", "Spring Boot", "学习笔记", "后端框架"],
    readTime: "7 分钟",
    author: "林晨",
    sections: [
      {
        heading: "Spring Boot 的魅力",
        paragraphs: [
          "Spring Boot 最大的特点是快速启动和简化配置。对初学者来说，最直观的收获是：不需要手写大量 XML 配置，也不需要反复搭建环境，能够更快地进入业务开发。",
          "它通过约定优于配置的方式，让项目结构更清晰，并且自动装配一些常见组件，例如 Web、数据库连接、AOP 等。"
        ]
      },
      {
        heading: "三层架构的落地方式",
        paragraphs: [
          "Controller 负责接收请求，Service 负责业务处理，Mapper/Repository 负责数据访问。这个分层思路很重要，因为它让代码职责明确，并且便于维护和扩展。",
          "我后面才明白，真正的框架理解不是看 API 的多少，而是能否把职责分层和注解组合起来形成一个清晰的工程结构。"
        ]
      },
      {
        heading: "我在学习时的复盘方法",
        paragraphs: [
          "我会做一个最小案例：创建一个 Spring Boot 项目、写一个 Controller、注入一个 Service、连接数据库、测试接口返回。这样最容易形成真实的认知链条。",
          "不需要先看很多企业项目，先把“请求如何进入、怎么调用服务、如何返回结果”这条链路打通，效果会更好。"
        ]
      }
    ]
  },
  {
    slug: "mysql-mybatis-practice-notes",
    title: "MySQL 与 MyBatis 学习笔记：事务、分页和数据访问设计",
    excerpt:
      "记录我在学习 MySQL 与 MyBatis 时的重点，包括事务原理、SQL 优化思路和数据访问层如何减少重复代码。",
    date: "2026-08-05",
    category: "Java 数据层",
    tags: ["Java", "MySQL", "MyBatis", "数据库"],
    readTime: "6 分钟",
    author: "林晨",
    sections: [
      {
        heading: "为什么要理解事务",
        paragraphs: [
          "数据库事务是保证一致性的关键机制。它可以让多条 SQL 要么一起成功，要么一起失败，避免因部分写入而带来数据紊乱。",
          "在实际学习中，我最常思考的问题是：什么场景需要事务？事务隔离级别会影响什么？什么时候会发生脏读、不可重复读和幻读？"
        ]
      },
      {
        heading: "MyBatis 让 SQL 更可控",
        paragraphs: [
          "MyBatis 的优点在于它让 SQL 直接暴露出来，开发者可以更直观地控制查询逻辑。相较于全自动映射框架，它更适合需要精细控制 SQL 和效率的项目。",
          "这里的关键是理解 mapper 接口、SQL 映射和参数传递的方式。真正掌握这些后，查询、分页和动态 SQL 会轻松很多。"
        ]
      },
      {
        heading: "分页与查询性能",
        paragraphs: [
          "分页不是简单地用 limit 语句就结束了，还有索引、字段选择和查询条件设计的问题。很多时，性能问题真正的根源，不是语法，而是数据量、索引和查询方式的组合。",
          "所以我学习数据库时，会一直遵循一个原则：先理解数据分布，再优化 SQL，而不是机械地加索引。"
        ]
      }
    ]
  },
  {
    slug: "redis-message-queue-java-notes",
    title: "Redis 与消息队列学习笔记：缓存、削峰和异步处理的思路",
    excerpt:
      "我把 Redis 和消息队列的学习整理成了实战思路，包括缓存命中、削峰填谷和异步任务处理的典型应用场景。",
    date: "2026-07-22",
    category: "Java 技术栈",
    tags: ["Java", "Redis", "消息队列", "架构设计"],
    readTime: "9 分钟",
    author: "林晨",
    sections: [
      {
        heading: "缓存解决的是速度问题",
        paragraphs: [
          "Redis 适合做缓存，因为它具备高性能和易用性。缓存可以减少数据库压力，提高接口响应速度，但也必须注意缓存失效和数据一致性问题。",
          "我对缓存的理解一直是：缓存不是银弹，它只是让系统在高频访问场景下更容易承受压力。真正要解决的，还是架构上的读写设计。"
        ]
      },
      {
        heading: "消息队列解决的是解耦",
        paragraphs: [
          "消息队列很适合削峰填谷和异步处理。例如用户下单后，可以把下单通知、库存扣减和邮件发送拆到不同步骤中，而不是让用户等待所有逻辑完成。",
          "这样做能提高系统吞吐量，也让业务之间更松耦合。对我来说，理解消息队列的核心就是：把同步处理拆成可独立扩展的异步步骤。"
        ]
      },
      {
        heading: "学习时的判断标准",
        paragraphs: [
          "我很重视“什么问题适合用 Redis、什么问题适合用消息队列”的判断，而不是死记概念。对系统设计来说，这种判断会比背书更有价值。",
          "后续我还会继续补充更多案例，比如秒杀场景、日志处理和后台任务处理，这样会更容易形成自己的知识图谱。"
        ]
      }
    ]
  }
];

export function getPostBySlug(slug: string) {
  return posts.find((post) => post.slug === slug);
}

export function getAllTags() {
  const tagSet = new Set<string>();
  posts.forEach((post) => post.tags.forEach((tag) => tagSet.add(tag)));
  return Array.from(tagSet).sort();
}

export function getPostsByTag(tag: string) {
  return posts.filter((post) => post.tags.includes(tag));
}

export function getSortedPosts() {
  return [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getAllCategories() {
  return Array.from(new Set(posts.map((post) => post.category))).sort();
}

export function getAdjacentPosts(slug: string) {
  const sorted = getSortedPosts();
  const index = sorted.findIndex((post) => post.slug === slug);

  if (index === -1) {
    return { prev: null, next: null };
  }

  return {
    prev: sorted[index + 1] ?? null,
    next: sorted[index - 1] ?? null,
  };
}

export function getRelatedPosts(slug: string, limit = 3) {
  const current = getPostBySlug(slug);
  if (!current) {
    return [];
  }

  return posts
    .filter((post) => post.slug !== slug)
    .map((post) => {
      const sharedTags = post.tags.filter((tag) => current.tags.includes(tag)).length;
      return { post, sharedTags };
    })
    .filter((item) => item.sharedTags > 0)
    .sort(
      (a, b) =>
        b.sharedTags - a.sharedTags ||
        new Date(b.post.date).getTime() - new Date(a.post.date).getTime()
    )
    .slice(0, limit)
    .map((item) => item.post);
}

export function getTagStats() {
  const counts = new Map<string, number>();
  posts.forEach((post) => {
    post.tags.forEach((tag) => counts.set(tag, (counts.get(tag) ?? 0) + 1));
  });
  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}
