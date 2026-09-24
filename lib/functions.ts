export type FunctionCard = {
  id: string;
  name: string;
  signature: string;
  category: string;
  description: string;
  example: string;
  note?: string;
  tags: string[];
  language: string;
  created: string;
};

export const functionLibrary: FunctionCard[] = [
  {
    id: "1",
    name: "ArrayList addAll",
    signature: "boolean addAll(Collection<? extends E> c)",
    category: "集合",
    description: "将指定集合中的所有元素添加到此列表的末尾",
    example: 'ArrayList<String> list = new ArrayList<>();\nlist.addAll(Arrays.asList("a", "b", "c"));\n// 结果: [a, b, c]',
    note: "时间复杂度 O(n)，n 为 c 的大小",
    tags: ["ArrayList", "Collection", "List", "性能"],
    language: "Java",
    created: "2026-08-01"
  },
  {
    id: "2",
    name: "StringBuilder insert",
    signature: "StringBuilder insert(int index, char c)",
    category: "字符串",
    description: "在指定位置插入字符，原位置及之后字符后移",
    example: 'StringBuilder sb = new StringBuilder("hello");\nsb.insert(2, ", world");\n// 结果: "he, worldlo"',
    note: "频繁插入建议使用，链表不适合",
    tags: ["StringBuilder", "字符串", "插入", "性能"],
    language: "Java",
    created: "2026-08-05"
  },
  {
    id: "3",
    name: "Map getOrDefault",
    signature: "V getOrDefault(Object key, V defaultValue)",
    category: "集合",
    description: "获取指定键对应的值，如果不存在则返回默认值",
    example: 'Map<String, Integer> map = new HashMap<>();\nmap.put("a", 1);\nint value = map.getOrDefault("b", 0); // 结果: 0',
    note: "比先判断后访问更简洁",
    tags: ["HashMap", "Map", "默认值", "常用"],
    language: "Java",
    created: "2026-08-08"
  },
  {
    id: "4",
    name: "Set intersection",
    signature: "static <T> Set<T> intersection(Set<T> s1, Set<T> s2)",
    category: "集合",
    description: "返回两个集合的交集，保留在两个集合中都存在的元素",
    example: 'Set<Integer> s1 = Set.of(1, 2, 3, 4);\nSet<Integer> s2 = Set.of(3, 4, 5, 6);\nSet<Integer> result = intersection(s1, s2); // 结果: {3, 4}',
    note: "适合大量数据，使用 streams 性能更好",
    tags: ["Set", "集合", "Stream", "算法"],
    language: "Java",
    created: "2026-08-10"
  },
  {
    id: "5",
    name: "List indexOf",
    signature: "int indexOf(Object o)",
    category: "集合",
    description: "返回列表中第一次出现指定元素的位置，如果没有则返回 -1",
    example: 'List<Integer> list = List.of(1, 2, 3, 2, 4);\nint idx = list.indexOf(2); // 结果: 1',
    note: "时间复杂度 O(n)，完全遍历查找",
    tags: ["List", "遍历", "查找", "常用"],
    language: "Java",
    created: "2026-08-12"
  },
  {
    id: "6",
    name: "String split",
    signature: "String[] split(String regex)",
    category: "字符串",
    description: "根据正则表达式分割字符串，返回字符串数组",
    example: 'String s = "a,b,c,d";\nString[] parts = s.split(","); // 结果: ["a", "b", "c", "d"]',
    note: "正则表达式需要转义特殊字符，如 . | * ?",
    tags: ["String", "数组", "分割", "常用"],
    language: "Java",
    created: "2026-08-15"
  },
  {
    id: "7",
    name: "Integer compare",
    signature: "int compare(Integer a, Integer b)",
    category: "数学",
    description: "比较两个整数，返回负数、0 或正数表示小于、等于或大于",
    example: 'int result = Integer.compare(10, 5); // 结果: 5 (正数，表示 10 > 5)',
    note: "推荐使用，比 a - b 防止溢出更安全",
    tags: ["Integer", "比较", "排序", "安全"],
    language: "Java",
    created: "2026-08-18"
  },
  {
    id: "8",
    name: "Math.random",
    signature: "static double random()",
    category: "数学",
    description: "生成大于等于 0.0 且小于 1.0 的随机 double 值",
    example: 'double r = Math.random(); // 结果: 0.0 <= r < 1.0\nint rand = (int)(Math.random() * 100); // 0-99 随机整数',
    note: "要生成 n-m 范围整数：(n) + Math.random()*(m-n)",
    tags: ["Math", "随机", "数学", "常用"],
    language: "Java",
    created: "2026-08-20"
  },
  {
    id: "9",
    name: "Thread.sleep",
    signature: "static void sleep(long millis) throws InterruptedException",
    category: "多线程",
    description: "让当前线程暂停执行指定的毫秒数",
    example: 'Thread.sleep(1000); // 休眠 1 秒\ntry {\n  Thread.sleep(500);\n} catch (InterruptedException e) {\n  Thread.currentThread().interrupt();\n}',
    note: "只释放 CPU，不释放锁，异常处理必须包含 InterruptedException",
    tags: ["Thread", "多线程", "等待", "异常"],
    language: "Java",
    created: "2026-08-22"
  },
  {
    id: "10",
    name: "Arrays.sort",
    signature: "static <T extends Comparable<? super T>> void sort(T[] a)",
    category: "数组",
    description: "对数组进行升序排序",
    example: 'int[] arr = {3, 1, 4, 1, 5};\nArrays.sort(arr); // 结果: [1, 1, 3, 4, 5]',
    note: "快速排序实现，稳定排序，时间复杂度 O(n log n)",
    tags: ["Arrays", "排序", "数组", "常用"],
    language: "Java",
    created: "2026-08-25"
  }
];

export function getAllLanguages() {
  const langs = new Set(functionLibrary.map(f => f.language));
  return Array.from(langs).sort();
}

export function getFunctionsByCategory(category: string) {
  return functionLibrary.filter(f => f.category === category);
}

export function searchFunctions(keyword: string) {
  const k = keyword.toLowerCase();
  return functionLibrary.filter(
    f =>
      f.name.toLowerCase().includes(k) ||
      f.signature.toLowerCase().includes(k) ||
      f.description.toLowerCase().includes(k) ||
      f.tags.some(tag => tag.toLowerCase().includes(k))
  );
}
