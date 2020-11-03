var lastInput = [];
var input = "";
var help = false;
var helpWindow = document.getElementById("help-window");
var special_char = "¬∧∨⇒⇔()";

function Rectangle(POSX, POSY, WIDTH, HEIGHT) {
    this.centerX = POSX,
    this.centerY = POSY,
    this.width = WIDTH,
    this.height = HEIGHT,
    this.unstretched = WIDTH,
    this.display = function() {
        strokeWeight(4);
        fill(255);
        rectMode(CENTER);
        rect(this.centerX, this.centerY, this.width, this.height, 10);
     }
};

function setup() {
    cnv = createCanvas(windowWidth, windowHeight);
    noLoop();

    if (windowWidth * 0.9 > windowHeight)
        textbox = new Rectangle(windowWidth / 2, windowHeight / 10, windowWidth / 2, windowHeight / 10);
    else
        textbox = new Rectangle(windowWidth / 2, windowHeight / 10, windowWidth * 0.9, windowHeight / 10);

    Create_clear_button();
    Create_submit_button();
    Create_help_button();
}

function draw() {
    clear();
    background(113, 179, 245);

    while (textWidth(input) >= textbox.width) {
        textbox.width += textWidth('A');
    }

    textbox.display();
    showInput();

    if(help) {
    	helpWindow.className = "";
    }
    else {
    	helpWindow.className = "hidden";
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    // textbox
    textbox.centerX = windowWidth / 2;
    textbox.centerY = windowHeight / 10;
    textbox.height = windowHeight / 10;
    if (windowWidth * 0.9 > windowHeight)
        textbox.width = windowWidth / 2;
    else
        textbox.width = windowWidth * 0.9;
    textbox.unstretched = textbox.width;
    while (textWidth(input) >= textbox.width) {
        textbox.width += textWidth('A');
    }

	adjust_button(clear_button);
    adjust_button(submit_button);
    adjust_button(help_button);
    clear_button.position((windowWidth - textbox.unstretched)/2 + textbox.unstretched / 6 - clear_button.width / 2, windowHeight / 5);
    submit_button.position((windowWidth - textbox.unstretched)/2 + textbox.unstretched / 2 - submit_button.width / 2, windowHeight / 5);
    help_button.position((windowWidth - textbox.unstretched)/2 + textbox.unstretched * 5 / 6 - help_button.width / 2, windowHeight / 5);
    

    draw();
}

function adjust_button(btn) {
	btn.size(textbox.unstretched / 4, textbox.height / 1.3);
	btn.style("font-size", btn.width / 5 + "px");
}

function showInput() {
    textSize(windowHeight / 12);
    textAlign(CENTER);
    fill(0);
    textFont('Varela Round');
    text(input, windowWidth / 2, windowHeight / 7.75);
}


function keyTyped() {
	if (help) {
		help = false;
		draw();
		return false;
	}

    if (key >= 'A' && key <= 'Z') { // A-Z
    	lastInput.push(input);
        input += key;
    }
    else if (key >= 'a' && key <= 'z') { // a-z
        lastInput.push(input);
        input += key.toUpperCase();
    }
    else if (key == '(' || key == ')') { // ()
        lastInput.push(input);
        input += key;    
    }
    else switch (key) {
        case '1':
        	lastInput.push(input);
            	input += '¬';
            	break;
        case '2':
        	lastInput.push(input);
            	input += '∧';
            	break;
        case '3':
        	lastInput.push(input);
            	input += '∨';
            	break;
        case '4':
        	lastInput.push(input);
            	input += '⇒';
            	break;
        case '5':
        	lastInput.push(input);
            input += '⇔';
            break;
        case '9':
        	lastInput.push(input);
        	input += '(';
        	break;
        case '0':
        	lastInput.push(input);
        	input += ')';
        	break;
        default:
        	return false;
    }

    draw();
    return false;
}

function keyPressed() {
	if(help) {
    	help = false;
    	draw();
    	return false;
	}

    if (keyCode == BACKSPACE) {
    	lastInput.push(input);
        input = input.slice(0, -1);
        while (textWidth(input + 'A') >= textbox.width) {
        	textbox.width += textWidth('A');
        }
        if(textbox.width > textbox.unstretched)
        	textbox.width -= textWidth('A');
        draw();
    }
    else if (keyCode == DELETE) {
    	clear_textbox();
    }
    else if (keyCode == ENTER) {
    	check_input();
    }
    else if (keyIsDown(CONTROL)) {
    	if (keyIsDown(90) || keyIsDown(122)) {
    		if(lastInput.length)
    			input = lastInput.pop();
    		draw();
    	}
	}
}

function clear_textbox() {
	//alert("Starting!");
	lastInput.push(input);
	input = "";
	textbox.width = textbox.unstretched;
	draw();
}

function show_help() {
	help = true;
	draw();
}

function Create_clear_button() {
	clear_button = createButton('CLEAR');
	clear_button.mousePressed(clear_textbox);
    clear_button.size(textbox.unstretched / 4, textbox.height / 1.3);
    clear_button.position((windowWidth - textbox.unstretched)/2 + textbox.unstretched / 6 - clear_button.width / 2, windowHeight / 5);
    clear_button.style("font-size", clear_button.width / 5 + "px");
    clear_button.style("font-family", "myriad-pro, sans-serif");
    clear_button.style("font-weight", "700");
    clear_button.style("border-radius", "14px");
    clear_button.style("border", "4px solid")
}

function Create_submit_button() {
	submit_button = createButton('SUBMIT');
	submit_button.mousePressed(check_input);
    submit_button.size(textbox.unstretched / 4, textbox.height / 1.3);
    submit_button.position((windowWidth - textbox.unstretched)/2 + textbox.unstretched / 2 - submit_button.width / 2, windowHeight / 5);
    submit_button.style("font-size", submit_button.width / 5 + "px");
    submit_button.style("font-family", "myriad-pro, sans-serif");
    submit_button.style("font-weight", "700");
    submit_button.style("border-radius", "14px");
    submit_button.style("border", "4px solid")
}

function Create_help_button() {
	help_button = createButton('HELP');
	help_button.mousePressed(show_help);
    help_button.size(textbox.width / 4, textbox.height / 1.3);
    help_button.position((windowWidth - textbox.unstretched)/2 + textbox.unstretched * 5 / 6 - help_button.width / 2, windowHeight / 5);
    help_button.style("font-size", help_button.width / 5 + "px");
    help_button.style("font-family", "myriad-pro, sans-serif");
    help_button.style("font-weight", "700");
    help_button.style("border-radius", "14px");
    help_button.style("border", "4px solid")
}

document.body.onpaste = function(e) {
    var pastedText = undefined;

  	if (window.clipboardData && window.clipboardData.getData) { // IE
    	pastedText = window.clipboardData.getData('Text');
  	} 
  	else if (e.clipboardData && e.clipboardData.getData) {
    	pastedText = e.clipboardData.getData('text/plain');
  	}

  	if(pastedText == undefined)
  		return false;

  	pastedText = pastedText.toUpperCase();
 
 	let tempInput = "";
    for (i of pastedText) {
    	if (i == ' ')
    		continue;

    	if (special_char.indexOf(i) > -1)
    		tempInput += i;

    	else if (i >= 'A' && i <= 'Z')
    		tempInput += i;

    	else switch (i) {
        	case '1':
        		tempInput += '¬';
            	break;
        	case '2':
        		tempInput += '∧';
            	break;
        	case '3':
        		tempInput += '∨';
            	break;
        	case '4':
        		tempInput +='⇒';
            	break;
        	case '5':
        		tempInput += '⇔';
            	break;
        	case '9':
        		tempInput += '(';
        		break;
        	case '0':
        		tempInput += ')';
        		break;
        	default:
        		alert('ERROR: PASTED TEXT COTAINS UNKNOWN CHARACTERS -> ' + i);
        		return false;
    	}
    }

    lastInput.push(input);
    input = tempInput;

    draw();
    return false;
}
