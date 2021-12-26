class Tree {
    constructor(val) {
      this.val = val;
      this.valEval;
      // I've chosen to use an array for ease of
      // use, though a Linked List may be more
      // appropriate if you anticipate deleting 
      // nodes often
      this.children = [];
    }
    
    addChild(val) {
      // Create a new Tree from the given value
      const node = new Tree(val);
      
      // Add the node to the operating node's (this)
      // children array
      this.children.push(node);
      
      // Return the node
      return node;
    }
    
    removeChild(childNode) {
      // Find the index of the child in the operating
      // node's (this) children array
      const index = this.children.indexOf(childNode);
      
      // indexOf returns -1 when the search value is not found
      if (index === -1) {
        throw new Error("The provided node is not a child of this Tree");
      } else {
        // Modify the operating node's (this) children array by splicing
        // out the childNode
        this.children.splice(index, 1);
      }
    }
    
    isDescendant(treeNode) {
      // If the provided treeNode exists in the operating
      // node's (this) children array, then we can just return
      // true without having to recurse through each child
      if (this.children.includes(treeNode)) {
        return true;
      }
  
      // If we haven't already returned, we'll need to recurse,
      // checking if the prvided treeNode is a descendant of each
      // child
      for (let child of this.children) {
        if (child.isDescendant(treeNode)) {
          return true
        }
      }
      
      // We have checked all this subtree's nodes, beginning with
      // the operating node (this) and have not found the provided treeNode.
      // Therefore the treeNode is not a descendant of this subtree
      return false;
    }
  }