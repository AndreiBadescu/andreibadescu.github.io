var cnt, leaf_nodes, root, currentNode, depth, breadth, displayed_nodes, circles, tree_portion;

function Node(data, parent, children) {
	this.data = data;
	this.parent = parent;
	this.children = children;
}

function addNode(data, parent, children) {
	var node = new Node(data,parent,children);

	if(parent != null)
		parent.children.push(node);
	else if (root == null)
		root = node;

	return node;
}

function type_of(c) {
	if (c == '¬') {
		return 0;
	}
	else if(c == '∧' || c == '∨' || c == '⇒' || c == '⇔') {
		return 1;
	}
	else if(c == '(') {
		return 2;
	}
	else if(c == ')') {
		return 3;
	}
	else {
		return 4;
	}
}

function basic_check(input) {
	if (input.length == 0) {
		return false;
	}

	// propozitie atomica
	if (input.length == 1 && input[0] >= 'A' && input[0] <= 'Z') {
		addNode(input[0], null, []);
		displayTree(root);
		return true;
	}

	if (input.length == 2 || input.length == 3)
		return false;

	if (input[0] != '(')
		return false;

	let prev = input[0];
	for (let i = 1; i < input.length; ++i) {
		let c = input[i];
		// conector '¬∧∨⇒⇔'
		if (type_of(prev) < 2) {
			if (type_of(c) == 3 || type_of(c) < 2)
				return false;
		}
		// '(' paranteza deschisa
		else if (type_of(prev) == 2) {
			if (type_of(c) == 1 || type_of(c) == 3)
				return false;
		}
		// ')' paranteza inchisa
		else if (type_of(prev) == 3) {
			if (type_of(c) == 0 || type_of(c) == 2 || type_of(c) == 4)
				return false;
		}
		// 'A-Z' litera
		else if (type_of(prev) == 4) {
			if (type_of(c) == 0 || type_of(c) == 2 || type_of(c) == 4)
				return false;
		}
		prev = c;
	}

	return true;
}


function check_input() {
	//alert(input);
	root = null, currentNode = null;
	cnt = 0, leaf_nodes = 0;

	if (basic_check(input) == false) {
		alert('ERROR!');
		return false;
	}
	else {
		if (input.length == 1)
			return true;
	}

	let prev = undefined;
    for (i of input) {
        if (i >= 'A' && i <= 'Z') {
        	if (currentNode == null) {
                alert('ERROR: Lipsesc paranteze!');
                return false;
            }

        	++leaf_nodes;
        	addNode(i, currentNode, []);
        } 
        else switch (i) {
            	case '(':
            		++cnt;
            		currentNode = addNode(null, currentNode, []);
                	break;

            	case ')':
            		--cnt;
            		if (cnt < 0) {
            			alert('ERROR: Paranterzare gresita!');
            			return false;
            		}
            		currentNode = currentNode.parent;
                	break;

                default:
                	if (currentNode == null) {
                		alert('ERROR: Lipsesc paranteze!');
                		return false;
                	}

                	currentNode.data = i;
                	
        }
        //console.log(currentNode.data);
        prev = i;
    }

    if (cnt != 0) {
    	alert('ERROR: Parantezare gresita!');
    	return false;
    }
    
    //alert("TRUE");
    while (root.parent != null)
    	root.parent = root;
    displayTree(root);
    return true;
}

function DFS(root, lvl) {
	if (lvl > depth) {
		depth = lvl;
		breadth.push(0);
		displayed_nodes.push(0);
	}
	++breadth[lvl];
	for (i of root.children) {
		DFS(i, lvl + 1);
	}
}

function displayNode(root, lvl, parentX, parentY, ST, DR) {
	if(root.data == null) {
		alert('ERROR!');
		return false;
	}

	++displayed_nodes[lvl];

	let MIJ = (ST + DR) / 2;

	let yPos = (lvl - 1) / depth * tree_portion;
	let xPos = MIJ;

	circles.push({x : xPos, y : yPos, val : root.data});

	if(parentX || parentY) {
		line(xPos, yPos, parentX, parentY);
	}

	if (root.children.length == 1) {
		displayNode(root.children[0], lvl + 1, xPos, yPos, ST, DR);
	}
	else {
		for (let i = 0; i < root.children.length; ++i) {
			if (i == 0)
				displayNode(root.children[i], lvl + 1, xPos, yPos, ST, MIJ);
			else
				displayNode(root.children[i], lvl + 1, xPos, yPos, MIJ, DR);
		}
	}
}

function displayTree(root) {
	depth = 0;
	breadth = [0];
	displayed_nodes = [0];
	circles = [];
	DFS(root, 1);

	tree_portion = windowHeight - (80 + textbox.height / 1.3 + windowHeight / 5);

	push();
	translate(0, 80 + textbox.height / 1.3 + windowHeight / 5);
	// (root, lvl, parentX, parentY, ST, DR)
	let no_error = true;
	if (leaf_nodes > 10 || windowWidth < 1000)
		no_error = displayNode(root, 1, 0, 0, 0, windowWidth)
	else if (leaf_nodes > 5 || windowWidth < 1400)
		no_error = displayNode(root, 1, 0, 0, 1/10 * windowWidth, 9/10 * windowWidth);
	else
		no_error = displayNode(root, 1, 0, 0, 2/10 * windowWidth, 8/10 * windowWidth);

	for (i of circles) {
		fill(255);
		circle(i.x, i.y, 80);
		fill(0);
		textSize(80 / 1.5);
		text(i.val, i.x, i.y + 80/5);
	}
	pop();

	if (no_error == false) {
		draw();
	}
}