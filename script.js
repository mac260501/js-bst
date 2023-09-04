class Node {
    constructor(value = null, left = null, right = null) {
        this.value = value;
        this.left = left;
        this.right = right;
    }
}

class Tree {
    constructor(list) {
        this.root = this.buildTree(list);
    }

    buildTree(list) {
        // remove duplicates and sort:
        let sorted_list = [...new Set(list)];
        sorted_list.sort(function (a, b) {  return a - b;  });

        return this.recursiveBuildTree(sorted_list, 0, sorted_list.length - 1)

    }

    recursiveBuildTree(list, start, end) {

        if (start > end) {
            return null;
        }

        let mid = Math.floor((start + end) / 2);
        let node = new Node(list[mid]);

        node.left = this.recursiveBuildTree(list, start, mid - 1);
        node.right = this.recursiveBuildTree(list, mid + 1, end);

        return node;
    }

    insert(value, root = this.root) {

        if (root === null) {
            return new Node(value);
        }

        if (value < root.value) {
            root.left = this.insert(value, root.left);
        }
        else if (value > root.value) {
            root.right = this.insert(value, root.right);
        }

        return root;
    }

    delete(value, root = this.root) {

        if (root === null) {
            return root;
        }

        if (value < root.value) {
            root.left = this.delete(value, root.left);
            return root;
        }
        else if (value > root.value) {
            root.right = this.delete(value, root.right);
            return root;
        }

        if (root.left === null) {
            return root.right;
        }
        else if (root.right === null) {
            return root.left;
        }
        else {
            let succParent = root;
            let succ = root.right;
            while (succ.left !== null) {
                succParent = succ;
                succ = succ.left;
            }

            if (succParent !== root) {
                succParent.left = succ.right;
            }
            else {
                succParent.right = succ.right;
            }

            root.value = succ.value;

            return root;
        }
    }

    find(value, root = this.root) {
        if (root === null) {
            return null;
        }
        else if (root.value === value) {
            return root;
        }
        else if (value < root.value) {
            return this.find(value, root.left);
        }
        else { // value > root.value
            return this.find(value, root.right);
        }
    }

    levelOrder(func = undefined) {
        let arr = [];

        let queue = [this.root];
        while (queue.length !== 0) {
            let next = queue.shift();

            if (next.left !== null) {
                queue.push(next.left);
            }
            if (next.right !== null) {
                queue.push(next.right);
            }

            if (func === undefined) {
                arr.push(next.value);
            }
            else {
                func(next);
            }
        }

        if (func === undefined) {
            return arr;
        }
    }

    inorder(func = undefined, root = this.root, arr = []) {
        if (root === null) {
            return;
        }

        this.inorder(func, root.left, arr);

        if (func === undefined) {
            arr.push(root.value);
        }
        else {
            func(root);
        }

        this.inorder(func, root.right, arr);

        if (func === undefined) {
            return arr;
        }
    }

    preorder(func = undefined, root = this.root, arr = []) {
        if (root === null) {
            return;
        }

        if (func === undefined) {
            arr.push(root.value);
        }
        else {
            func(root);
        }

        this.preorder(func, root.left, arr);

        this.preorder(func, root.right, arr);

        if (func === undefined) {
            return arr;
        }
    }

    postorder(func = undefined, root = this.root, arr = []) {
        if (root === null) {
            return;
        }

        this.postorder(func, root.left, arr);

        this.postorder(func, root.right, arr);

        if (func === undefined) {
            arr.push(root.value);
        }
        else {
            func(root);
        }

        if (func === undefined) {
            return arr;
        }
    }

    height(root = this.root) {

        if (root === null || ((root.left === null) && (root.right === null))) {
            return 0;
        }
        
        let left_height = this.height(root.left) + 1;
        let right_height = this.height(root.right) + 1;

        if (left_height > right_height) {
            return left_height;
        }
        return right_height;
    }

    // Assumes node is in the tree
    depth(node, root = this.root) {

        if (node.value === root.value) {
            return 0;
        }
        else if (node.value < root.value) {
            return this.depth(node, root.left) + 1;
        }
        else {
            return this.depth(node, root.right) + 1;
        }
    }

    isBalanced(root = this.root) {

        if (root === null) {
            return true;
        }

        let left_height = this.height(root.left);
        let right_height = this.height(root.right);

        if ((Math.abs(left_height - right_height) <= 1) && this.isBalanced(root.left) && this.isBalanced(root.right)) {
            return true;
        }
        return false;
    }

    rebalance(root = this.root) {
        let list = this.inorder();
        let tree = new Tree(list);
        this.root = tree.root;
    }

    prettyPrint(node = this.root, prefix = "", isLeft = true) {

        if (node === null) {
          return;
        }
        if (node.right !== null) {
          this.prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
        }
        console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.value}`);
        if (node.left !== null) {
          this.prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
        }
    }
}

const generateRandomBST = (size, max) => {

    let arr = [];
    for (let i = 0; i < size; i++) {
        let randomInt = Math.floor(Math.random() * max);
        arr.push(randomInt);
    }

    return new Tree(arr);
};

const addRandomIntsToBST = (bst, num) => {
    for (let i = 0; i < num; i++) {
        let randomInt = Math.floor(Math.random() * 100) + 100;
        bst.insert(randomInt);
    }
}

let bst = generateRandomBST(10, 100);
bst.prettyPrint();

console.log(`Is tree balanced? : ${bst.isBalanced()}\n\n`);

console.log(`Level traversal: ${bst.levelOrder()}\n`);
console.log(`Inorder traversal: ${bst.inorder()}\n`);
console.log(`Preorder traversal: ${bst.preorder()}\n`);
console.log(`Postorder traversal: ${bst.postorder()}\n`);

console.log(`Adding 10 random elements to BST...\n\n`);
addRandomIntsToBST(bst, 10);
bst.prettyPrint();

console.log(`Is tree balanced? : ${bst.isBalanced()}\n\n`);

console.log(`Rebalancing BST...\n\n`);
bst.rebalance();
bst.prettyPrint();

console.log(`Is tree balanced? : ${bst.isBalanced()}\n\n`);

console.log(`Level traversal: ${bst.levelOrder()}\n`);
console.log(`Inorder traversal: ${bst.inorder()}\n`);
console.log(`Preorder traversal: ${bst.preorder()}\n`);
console.log(`Postorder traversal: ${bst.postorder()}\n`);