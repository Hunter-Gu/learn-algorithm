# 深度优先搜索与广度优先搜索

## 搜索

深度优先搜索算法和广度优先搜索算法都是基于“图”的。因为“图”这种数据结构的表达能力很强，大部分涉及搜索的场景都可以抽象成“图”。

图上的搜索算法，最直接的理解就是：在图中找出从一个顶点出发，到另一个顶点的路径。

> 以下部分都以**邻接表**存储的**无向图**为例！

```ts
// 无向图
class Graph<T> {
    // 顶点数量
    public vertex = 0;

    // 邻接表
    public linkedList: T[]

    constructor(vertex: number) {
        this.vertex = vertex
        this.linkedList = new Array(vertex)

        for (let i = 0; i < vertex; i++) {
            this.linkedList[i] = []
        }
    }

    // 无向图一条边被两个顶点拥有，所以存两次
    addEdge(s: number, t: number) {
        this.linkedList[s].push(t)
        this.linkedList[t].push(s)
    }
}
```

## BFS

先查找离起始顶点最近的，然后是次近的，依次往外搜索。

广度优先搜索是逐层访问的，只有把第 k 层的顶点都访问完成之后，才能访问第 k+1 层的顶点。

当访问到第 k 层的顶点的时候，需要把第 k 层的顶点记录下来，之后通过第 k 层的顶点来找第 k+1 层的顶点。所以，这里要用队列来实现记录的功能。如图：

![BFS](@imgs/002e9e54fb0d4dbf5462226d946fa1ea.jpg)

```ts
function bfs(graph: Graph, start: number, end: number) {
    if (start === end) return

    const {vertex, linkedList} = graph
    const visited = new Array(vertex).fill(false)
    // 记录已经被访问的顶点，避免顶点被重复访问
    // 如果顶点 q 被访问，那相应的 visited[q] 会被设置为 true
    visited[start] = true

    // 用来存储已经被访问、但相连的顶点还没有被访问的顶点
    // 记录的是顶点的访问顺序
    const queue = []
    queue.push(start)

    // 记录搜索路径（前驱节点，即是通过哪一个顶点搜索到的当前顶点）
    // 从顶点 start 开始，广度优先搜索到顶点 end 后，prev 数组中存储的就是搜索的路径
    // 注意，这个路径是反向存储的。prev[w] 存储的是，顶点 w 是从哪个前驱顶点遍历过来的
    // 比如，通过顶点 2 的邻接表访问到顶点 3，那 prev[3] 就等于 2
    // 所以为了正向打印出路径，需要递归打印
    const prev = []
    for (let i = 0; i < vertex; i++) {
        prev[i] = -1
    }

    while (queue.length !== 0) {
        const w = queue.shift();
        // 当前节点的相邻顶点
        const adjVertexs = linkedList[w];

        // 遍历该节点的相邻顶点
        for (let i = 0; i < adjVertexs.length; i++) {
            const adjVertex = adjVertexs[i]
            if (!visited[adjVertex]) {
                prev[adjVertex] = w;
                if (adjVertex === end) {
                    print(prev, start, end);
                    return;
                }
                visited[adjVertex] = true;
                queue.push(adjVertex);
            }
        }
    }
}

// 递归打印 s->t 的路径
function print(prev: number[], start: number, end: number) {
  if (prev[end] !== -1 && end !== start) {
    print(prev, start, prev[end]);
  }
  console.log(t + " ");
}

// const g = new Graph(8);
// g.addEdge(0, 1);
// g.addEdge(0, 3);
// g.addEdge(1, 2);
// g.addEdge(1, 4);
// g.addEdge(2, 5);
// g.addEdge(3, 4);
// g.addEdge(4, 5);
// g.addEdge(4, 6);
// g.addEdge(5, 7);
// g.addEdge(6, 7);
// bfs(g, 0, 6);
```

搜索一条从 start 到 end 的路径，实际上，这样求得的路径就是从 start 到 end 的最短路径。

下面是 BFS 的分解图：

![步骤 1](@imgs/4fea8c4505b342cfaf8cb0a93a65503a.jpg)

![步骤 2](@imgs/ea00f376d445225a304de4531dd82723.jpg)

![步骤 3](@imgs/4cd192d4c220cc9ac8049fd3547dba39.jpg)

### 复杂度

最坏情况下，终止顶点 end 离起始顶点 start 很远，需要遍历完整个图才能找到。这个时候，每个顶点都要进出一遍队列，每个边也都会被访问一次，所以，广度优先搜索的时间复杂度是 O(V+E)，其中，V 表示顶点的个数，E 表示边的个数。

对于一个连通图来说，也就是说一个图中的所有顶点都是连通的，E 肯定要大于等于 V-1，所以，广度优先搜索的时间复杂度也可以简写为 O(E)。

广度优先搜索的空间消耗主要在几个辅助变量 visited 数组、queue 队列、prev 数组上。这三个存储空间的大小都不会超过顶点的个数，所以空间复杂度是 O(V)。

## DFS

对于 DFS，最直观的例子就是“走迷宫”。

假设你站在迷宫的某个岔路口，然后想找到出口。你随意选择一个岔路口来走，走着走着发现走不通的时候，你就回退到上一个岔路口，重新选择一条路继续走，直到最终找到出口。这种走法就是一种深度优先搜索策略。

那么如何在图中应用深度优先搜索，来找某个顶点到另一个顶点的路径？

如图，搜索的起始顶点是 start，终止顶点是 end，要在图中寻找一条从顶点 start 到顶点 end 的路径。

![DFS](@imgs/8778201ce6ff7037c0b3f26b83efba85.jpg)

映射到迷宫的例子，start 就是起始位置，end 就是出口，用深度递归算法，把整个搜索的路径标记出来了。

- 实线箭头表示遍历
- 虚线箭头表示回退

可以看出，深度优先搜索找出来的路径，并不是顶点 start 到顶点 end 的最短路径。

深度优先搜索用的是一种比较著名的算法思想：回溯思想。这种思想解决问题的过程，非常适合用递归来实现。

```ts
// 全局变量或者类成员变量
let found = false;

function dfs(graph: Graph, start: number, end: number) {
    const {vertex, linkedList} = graph;

    // 记录已经被访问的顶点，避免顶点被重复访问
    // 如果顶点 q 被访问，那相应的 visited[q] 会被设置为 true
    const visited = new Array(vertex).fill(false);

    // 记录搜索路径（前驱节点，即是通过哪一个顶点搜索到的当前顶点）
    // 从顶点 start 开始，广度优先搜索到顶点 end 后，prev 数组中存储的就是搜索的路径
    // 注意，这个路径是反向存储的。prev[w] 存储的是，顶点 w 是从哪个前驱顶点遍历过来的
    // 比如，通过顶点 2 的邻接表访问到顶点 3，那 prev[3] 就等于 2
    // 所以为了正向打印出路径，需要递归打印
    const prev = new Array(vertex);
    for (let i = 0; i < vertex; i++) {
        prev[i] = -1;
    }

    found = false;

    recurDfs(graph, start, end, visited, prev);
    print(prev, start, end);
}

function recurDfs(graph: Graph, start: number, end: number, visited: boolean[], prev: number[]) {
    if (found === true) return;

    visited[start] = true;

    if (start === end) {
        found = true;
        return;
    }

    const { linkedList } = graph
    // 当前节点的相邻顶点
    const adjVertexs = linkedList[start];
    for (let i = 0; i < adjVertexs.length; i++) {
        let adjVertex = adjVertexs[i];
        if (!visited[adjVertex]) {
            prev[adjVertex] = start;
            recurDfs(graph, adjVertex, end, visited, prev);
        }
    }
}
```

- 深度优先搜索代码实现也用到了 prev、visited 变量以及 print() 函数，并且跟广度优先搜索代码实现里的作用是一样的
- 深度优先搜索代码实现里，有个比较特殊的变量 found，作用是当找到终止顶点 end 之后，就不再递归地继续查找

### 复杂度

从图中可以看出，每条边最多会被访问两次，一次是遍历，一次是回退。所以，图上的深度优先搜索算法的时间复杂度是 O(E)，E 表示边的个数。

深度优先搜索算法的消耗内存主要是 visited、prev 数组和递归调用栈。visited、prev 数组的大小跟顶点的个数 V 成正比，递归调用栈的最大深度不会超过顶点的个数，所以总的空间复杂度就是 O(V)。

## 思考

### 如何找出社交网络中某个用户的三度好友关系？

这个问题非常适合用图的广度优先搜索算法来解决。

因为社交网络可以用图来表示，并且广度优先搜索是层层往外推进的：

- 首先，遍历与起始顶点最近的一层顶点，也就是用户的一度好友
- 然后再遍历与用户距离的边数为 2 的顶点，也就是二度好友关系，以及与用户距离的边数为 3 的顶点，也就是三度好友关系

#### 能否用深度优先搜索来解决呢？

### 具体讲讲如何将迷宫抽象成一个图？或者换个说法，如何在计算机中存储一个迷宫？
