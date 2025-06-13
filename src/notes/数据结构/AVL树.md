---
title: AVL树
order: 7
category:
  - 数据结构
tag:
  - 非线性
  - 平衡二叉树
---

## 重点
1. AVL树的定义
2. AVL树的特点
3. AVL树的平衡原理
4. AVL树操作的时间复杂度

## 定义
![](https://raw.githubusercontent.com/zhongyuan202020/coder-notes-image/main/public/data-structrue/avl/avl.png)

二叉搜索树（BST），在极端情况下，会退化为链表，导致查找效率下降。为了解决这个问题，出现了平衡二叉树。

AVL树是一种自平衡二叉搜索树，它在二叉搜索树的基础上增加了平衡条件：任意节点的左右子树高度差不超过1。这个高度差被称为平衡因子。

关键词：
- 平衡因子：左子树高度减去右子树高度
- 自平衡：通过旋转操作自动维护平衡
- 高度平衡：任意节点的平衡因子范围为 [-1, 1]

## 特点
1. 严格的平衡条件保证了树的高度始终保持在O(log n)
2. 所有操作（查找、插入、删除）的时间复杂度都是O(log n)
3. 比红黑树更严格的平衡条件，但旋转操作更频繁
4. 适合读操作频繁的场景

## 平衡原理
AVL树的平衡原理基于平衡因子和旋转操作。

AVL树的旋转操作包括左旋和右旋。

插入或删除节点后，如果树不平衡，需要根据节点的平衡因子进行旋转操作。
左旋：将右子树的根节点提升为新的根节点，将原根节点作为新根节点的左子树。
右旋：将左子树的根节点提升为新的根节点，将原根节点作为新根节点的右子树。

## 时间复杂度
<!-- 使用表格的形式展示 -->
| 操作 | 时间复杂度 |
| --- | --- |
| 查找 | O(log n) |
| 插入 | O(log n) |
| 删除 | O(log n) |

## 知识扩展
### AVL树的优缺点
优点：
1. 完美平衡的二叉搜索树，查找效率高
2. 所有操作都保证O(log n)的时间复杂度
3. 适合读操作频繁的场景
4. 实现相对简单，易于理解

缺点：
1. 平衡条件过于严格，维护成本高
2. 频繁的旋转操作影响插入和删除的性能
3. 相比红黑树，写操作的性能较差

### AVL树与其他平衡树的比较
1. 与红黑树比较：
   - AVL树更严格平衡，但旋转次数更多
   - 红黑树牺牲了部分平衡性来减少旋转操作
   - AVL树适合读多写少，红黑树适合读写平衡

2. 与B树比较：
   - AVL树是二叉树，B树是多路搜索树
   - B树更适合磁盘存储和数据库索引
   - AVL树更适合内存数据的组织

### 应用场景
1. 需要严格保证查找时间的场景
2. 读操作远多于写操作的场景
3. 内存数据库的索引结构
4. 需要快速查找和就近匹配的场景

## 功能实现
以 Java 为例，实现AVL树的基本操作。
```java
public class AVLTree<E extends Comparable<E>> {

    // 节点定义
    private class AVLNode<E extends Comparable<E>> {
        public E val;
        public AVLNode<E> left;
        public AVLNode<E> right;
        // 节点高度，用来计算平衡因子
        public int height; 
    }

    // 根节点
    private AVLNode<E> root;
    
    public AVLTree() {
        this.root = null;
    }
    
    public AVLTree(E val) {
        this.root = new AVLNode<>(val);
    }
    
    // 获取节点高度
    private int height(AVLNode<E> node) {
        return node == null ? 0 : node.height;
    }
    
    // 获取平衡因子
    private int getBalanceFactor(AVLNode<E> node) {
        if (node == null) {
            return 0;
        }
        return height(node.left) - height(node.right);
    }
    
    // 更新节点高度
    private void updateHeight(AVLNode<E> node) {
        if (node == null) return;
        node.height = Math.max(height(node.left), height(node.right)) + 1;
    }

    // 查询节点
    public boolean contains(E val) {
        return containsHelper(root, val);
    }

    private boolean containsHelper(AVLNode<E> node, E val) {
        if (node == null) {
            return false;
        }
        if (val.compareTo(node.val) < 0) {
            return containsHelper(node.left, val);
        } else if (val.compareTo(node.val) > 0) {
            return containsHelper(node.right, val);
        } else {
            return true;
        }
    }

    // 增加节点
    public void insert(E val) {
        root = insertHelper(root, val);
    }

    private AVLNode<E> insertHelper(AVLNode<E> node, E val) {
        // 标准BST插入
        if (node == null) {
            return new AVLNode<>(val);
        }

        if (val.compareTo(node.val) < 0) {
            node.left = insertHelper(node.left, val);
        } else if (val.compareTo(node.val) > 0) {
            node.right = insertHelper(node.right, val);
        } else {
            return node;  // 重复值不插入
        }
        // 更新高度
        updateHeight(node);
        // 获取平衡因子
        int balance = getBalanceFactor(node);
        // 处理不平衡情况
        // LL情况
        if (balance > 1 && val.compareTo(node.left.val) < 0) {
            return rightRotate(node);
        }
        // RR情况
        if (balance < -1 && val.compareTo(node.right.val) > 0) {
            return leftRotate(node);
        }
        // LR情况
        if (balance > 1 && val.compareTo(node.left.val) > 0) {
            node.left = leftRotate(node.left);
            return rightRotate(node);
        }
        // RL情况
        if (balance < -1 && val.compareTo(node.right.val) < 0) {
            node.right = rightRotate(node.right);
            return leftRotate(node);
        }
        return node;
    }

    // 删除节点
    public void delete(E val) {
        root = deleteHelper(root, val);
    }
    private AVLNode<E> deleteHelper(AVLNode<E> node, E val) {
        if (node == null) {
            return null;
        }
        // 标准BST删除
        if (val.compareTo(node.val) < 0) {
            node.left = deleteHelper(node.left, val);
        } else if (val.compareTo(node.val) > 0) {
            node.right = deleteHelper(node.right, val);
        } else {
            // 找到要删除的节点
            if (node.left == null || node.right == null) {
                AVLNode<E> temp = node.left!= null? node.left : node.right;
                if (temp == null) {
                    // 叶子节点
                    return null;
                } else {
                    // 单子节点
                    return temp;
                }
            } else {
                // 双子节点
                AVLNode<E> successor = findMin(node.right);
                node.val = successor.val;
                node.right = deleteHelper(node.right, successor.val);
            }
        }
        // 更新高度
        updateHeight(node);
        // 获取平衡因子
        int balance = getBalanceFactor(node);
        // 处理不平衡情况
        // LL情况
        if (balance > 1 && getBalanceFactor(node.left) >= 0) {
            return rightRotate(node);
        }
        // RR情况
        if (balance < -1 && getBalanceFactor(node.right) <= 0) {
            return leftRotate(node);
        }
        // LR情况
        if (balance > 1 && getBalanceFactor(node.left) < 0) {
            node.left = leftRotate(node.left);
            return rightRotate(node);
        }
        // RL情况
        if (balance < -1 && getBalanceFactor(node.right) > 0) {
            node.right = rightRotate(node.right);
            return leftRotate(node);
        }
        return node;
    }

    // 旋转操作
    // 右旋
    private AVLNode<E> rightRotate(AVLNode<E> y) {
        AVLNode<E> x = y.left;
        AVLNode<E> T3 = x.right;
        x.right = y;
        y.left = T3;
        updateHeight(y);
        updateHeight(x);
        return x;
    }
    // 左旋
    private AVLNode<E> leftRotate(AVLNode<E> x) {
        AVLNode<E> y = x.right;
        AVLNode<E> T2 = y.left;
        y.left = x;
        x.right = T2;
        updateHeight(x);
        updateHeight(y);
        return y;
    }
    // 辅助函数：找到最小节点
    private AVLNode<E> findMin(AVLNode<E> node) {
        while (node.left != null) {
            node = node.left;
        }
        return node;
    }
}
```
