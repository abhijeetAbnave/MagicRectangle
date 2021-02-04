import React, { Fragment } from "react";
import logo from "../../assets/images/logo.svg";

class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.canvasArea = React.createRef();
  }
  state = {
    cx: [],                 //square co-ordinate x
    cy: [],                 //square co-ordinate y 
    selectedIndex: null,     //selected index of square
    isKeyboardOn: true,
  }
  stage = null;             //DOM element
  ctx = null;               //getContext element of canvas
  canvasWidth = 0;
  canvasHeight = 0;
  constantBoundryGap = 40;  //Perimeter gap 
  sideOfSquare = 40;        //side of square


  componentDidMount() {
    this.stage = this.canvasArea.current;
    this.ctx = this.stage.getContext('2d'); // Canvas 2d rendering context
    this.canvasWidth = this.stage.width;
    this.canvasHeight = this.stage.height;
    this.state.cx[0] = (this.randomNumber(0, Math.floor(this.canvasWidth - this.constantBoundryGap))); // Setting initial values
    this.state.cy[0] = (this.randomNumber(0, Math.floor(this.canvasHeight - this.constantBoundryGap)));
    this.drawSquare(this.state.cx[0], this.state.cy[0], this.ctx, 1);
    document.addEventListener("keydown", event => {                 //Added event lister for keyboard keys press
      if (this.state.selectedIndex !== null && this.state.isKeyboardOn)
        this.handleKeyDown(event);
    })
  }

  drawSquare = (x, y, ctx, opacity) => {
    // ctx.fillStyle = '#FF8010'; // Fill color of rectangle drawn
    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = `rgba(${231 - (1 / opacity * 7)}, ${66 + (1 / opacity * 6)}, ${41 + (1 / opacity * 3)}, ${isFinite(opacity) ? (opacity === 1 ? 0.9 : 1 / (1 - opacity)) : 0.9})`; // Fill color of rectangle drawn
    ctx.fillRect(x, y, this.sideOfSquare, this.sideOfSquare); //This will draw a rectangle of 20x20
  }

  selectedSquare = (x, y, ctx, opacity) => {

    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = `rgba(0, 0, 0, ${isFinite(opacity) ? (opacity === 1 ? 0.9 : 1 / (1 - opacity)) : 0.9})`; // Fill color of rectangle drawn
    ctx.fillRect(x, y, this.sideOfSquare, this.sideOfSquare); //This will draw a rectangle of 20x20
  }

  randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min)
  }

  onAdd = () => {
    let index = this.state.cx.length;
    this.state.cx[index] = (this.randomNumber(0, Math.floor(this.canvasWidth - this.constantBoundryGap)));
    this.state.cy[index] = (this.randomNumber(0, Math.floor(this.canvasHeight - this.constantBoundryGap)));
    this.drawSquare(this.state.cx[index], this.state.cy[index], this.ctx, 1 / index);
  }

  onDelete = () => {
    this.deleteSquare(this.state.selectedIndex);
  }

  canvasClick = (e) => {
    let rect = this.stage.getBoundingClientRect()
    console.log("canvas click ", e.clientX - rect.left, " y ", e.clientY - rect.top);
    console.log("canvas click ", e);
    console.log("canvas click ", this.state.cx[0], " y ", this.state.cy[0]);

  }

  relMouseCoords(event) {
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var canvasX = 0;
    var canvasY = 0;
    var currentElement = this.stage;

    do {
      totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
      totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    }
    while (currentElement = currentElement.offsetParent)

    canvasX = event.pageX - totalOffsetX;
    canvasY = event.pageY - totalOffsetY;
    console.log("XX ", canvasX, "YY", canvasY);
    this.showSelectedSquare(canvasX, canvasY);
  }

  showSelectedSquare = (canvasX, canvasY) => {
    let isSelected = false;

    this.ctx.clearRect(0, 0, 800, 400);
    for (let index = this.state.cx.length - 1; index >= 0; index--) {
      if (this.isPointInsideOfSquare(canvasX, canvasY, this.state.cx[index], this.state.cy[index])) {
        isSelected = true;
        console.log("selected ", index)
        this.setState({ selectedIndex: index });
        this.selectedSquare(this.state.cx[index], this.state.cy[index], this.ctx, 1 / index);
      } else {
        this.drawSquare(this.state.cx[index], this.state.cy[index], this.ctx, 1 / index);
      }
    }
    if (!isSelected) {
      this.setState({ selectedIndex: null })
    }
  }

  isPointInsideOfSquare = (canvasX, canvasY, squareX, squareY) => {
    if (canvasX >= squareX && canvasX <= (squareX + this.sideOfSquare) && canvasY >= squareY && canvasY <= (squareY + this.sideOfSquare))
      return true;
    else
      return false;
  }

  deleteSquare = (index) => {
    if (index != null) {
      this.state.cx.splice(index, 1);
      this.state.cy.splice(index, 1);
      this.state.selectedIndex = null;
      // this.setState({ selectedIndex: null });
      this.ctx.clearRect(0, 0, 800, 400);
      this.drawSquareWithSelected();
    }
  }

  drawSquareWithSelected = () => {
    for (let index = this.state.cx.length - 1; index >= 0; index--) {
      if (this.state.selectedIndex == index) {
        this.selectedSquare(this.state.cx[index], this.state.cy[index], this.ctx, 1 / index);
      } else {
        // this.ctx.clearRect(0,0, 800, 400);
        this.drawSquare(this.state.cx[index], this.state.cy[index], this.ctx, 1 / index);
      }
    }
  }

  handleKeyDown = (event) => {
    console.log("handleKeyDown")
    let keyPr = event.keyCode; //Key code of key pressed
    if (keyPr === 46) {
      this.onDelete();
      return;
    }
    if (keyPr === 68 && this.state.cx[this.state.selectedIndex] <= 770) {
      this.state.cx[this.state.selectedIndex] += 20; //D key add 20 
    }
    else if (keyPr === 65 && this.state.cx[this.state.selectedIndex] > 10) {
      this.state.cx[this.state.selectedIndex] -= 20; //A key subtract 20 
    }
    else if (keyPr === 87 && this.state.cy[this.state.selectedIndex] > 10) {
      this.state.cy[this.state.selectedIndex] -= 20; //W key subtract 20 
    }
    else if (keyPr === 83 && this.state.cy[this.state.selectedIndex] <= 380) {
      this.state.cy[this.state.selectedIndex] += 20; //S key add 20 
    }

    // clearing anything drawn on canvas
    this.ctx.clearRect(0, 0, 800, 400);

    //Drawing rectangle at new position
    this.drawSquareWithSelected();
  };

  toggleKeyboard = () => {
    this.setState({ isKeyboardOn: !this.state.isKeyboardOn });
    if (this.state.isKeyboardOn) {
      document.addEventListener("keydown", event => {                 //Added event lister for keyboard keys press
        if (this.state.selectedIndex !== null)
          this.handleKeyDown(event);
      })
    } else {
      document.removeEventListener("keydown", event => {                 //Added event lister for keyboard keys press
        if (this.state.selectedIndex !== null)
          this.handleKeyDown(event);
      })
    }

  }

  render() {
    return (
      <Fragment>
        <div>
          <canvas onClick={(e) => this.relMouseCoords(e)} width="800" height="400" id="svs" ref={this.canvasArea} className="canvas" ></canvas>
          <div className="col-12">
            <button onClick={() => this.onAdd()} className="button button-add">Add</button>
            <button onClick={() => this.onDelete()} className="button button-delete">Delete</button>
          </div>
          <div className="col-12">
            <button onClick={() => this.toggleKeyboard()} className="button button-toggle">Keyboard Control {this.state.isKeyboardOn ? "On" : "Off"}</button>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default HomePage;
