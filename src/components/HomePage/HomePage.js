import React, { Fragment } from "react";
import logo from "../../assets/images/logo.svg";
import { Button, Col, Row } from "react-bootstrap";

class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.canvasArea = React.createRef();
  }
  state = {
    cx: [], //square co-ordinate x
    cy: [], //square co-ordinate y
    pointsArray: [],
    selectedIndex: null, //selected index of square
    isKeyboardOn: true,
  };
  stage = null; //DOM element
  ctx = null; //getContext element of canvas
  canvasWidth = 0;
  canvasHeight = 0;
  constantBoundryGap = 40; //Perimeter gap
  sideOfSquare = 40; //side of square

  componentDidMount() {
    this.stage = this.canvasArea.current;
    this.ctx = this.stage.getContext("2d"); // Canvas 2d rendering context
    this.canvasWidth = this.stage.width;
    this.canvasHeight = this.stage.height;
    this.state.cx[0] = this.randomNumber(
      0,
      Math.floor(this.canvasWidth - this.constantBoundryGap)
    ); // Setting initial values
    this.state.cy[0] = this.randomNumber(
      0,
      Math.floor(this.canvasHeight - this.constantBoundryGap)
    );
    this.state.pointsArray[0] = { x: this.state.cx[0], y: this.state.cy[0] }
    this.drawSquare(this.state.cx[0], this.state.cy[0], this.ctx, 1, 0);
    document.addEventListener("keydown", (event) =>
      this.keyboardEventFunction(event)
    );
  }

  keyboardEventFunction = (event) => {
    if (this.state.selectedIndex !== null && this.state.isKeyboardOn)
      this.handleKeyDown(event);
  };

  drawSquare = (x, y, ctx, opacity, index=3) => {
    // ctx.fillStyle = '#FF8010'; // Fill color of rectangle drawn
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = `rgba(${231 - (1 / opacity) * 7}, ${
      66 + (1 / opacity) * 6
    }, ${41 + (1 / opacity) * 3}, ${
      isFinite(opacity) ? (opacity === 1 ? 0.9 : 1 / (1 - opacity)) : 0.9
    })`; // Fill color of rectangle drawn
    
    ctx.strokeStyle = "black";
    ctx.lineWidth = "2";
    ctx.fillRect(x, y, this.sideOfSquare, this.sideOfSquare); //This will draw a rectangle of 20x20
    ctx.strokeRect(x, y, this.sideOfSquare, this.sideOfSquare);
    ctx.fillStyle = "black"
    ctx.font = "10px sans-serif";
    ctx.fillText("ID:"+index, x+10,y+24);
  };

  selectedSquare = (x, y, ctx, opacity, index) => {
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = `rgba(0, 0, 0, ${
      isFinite(opacity) ? (opacity === 1 ? 0.9 : 1 / (1 - opacity)) : 0.9
    })`; // Fill color of rectangle drawn
    ctx.fillRect(x, y, this.sideOfSquare, this.sideOfSquare); //This will draw a rectangle of 20x20
    ctx.fillStyle = "white"
    ctx.font = "10px sans-serif";
    ctx.fillText("ID:"+index, x+10,y+24);
  };

  randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
  };

  onAdd = () => {
    let index = this.state.cx.length;
    this.state.cx[index] = this.randomNumber(
      0,
      Math.floor(this.canvasWidth - this.constantBoundryGap)
    );
    this.state.cy[index] = this.randomNumber(
      0,
      Math.floor(this.canvasHeight - this.constantBoundryGap)
    );
    this.state.pointsArray[index] = { x: this.state.cx[index], y: this.state.cy[index] }
    this.drawSquareWithSelected();
    // this.drawSquare(this.state.cx[index], this.state.cy[index], this.ctx, 1 / index);
  };

  onDelete = () => {
    this.deleteSquare(this.state.selectedIndex);
  };

  canvasClick = (e) => {
    let rect = this.stage.getBoundingClientRect();
    console.log(
      "canvas click ",
      e.clientX - rect.left,
      " y ",
      e.clientY - rect.top
    );
    console.log("canvas click ", e);
    console.log("canvas click ", this.state.cx[0], " y ", this.state.cy[0]);
  };

  relMouseCoords(event) {
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var canvasX = 0;
    var canvasY = 0;
    var currentElement = this.stage;

    do {
      totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
      totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    } while ((currentElement = currentElement.offsetParent));

    canvasX = event.pageX - totalOffsetX;
    canvasY = event.pageY - totalOffsetY;
    console.log("XX ", canvasX, "YY", canvasY);
    this.showSelectedSquare(canvasX, canvasY);
  }

  showSelectedSquare = (canvasX, canvasY) => {
    let isSelected = false;
    let position = this.state.pointsArray.slice().reverse().findIndex((point) => this.isPointInsideOfSquare(
      canvasX,
      canvasY,
      point.x,
      point.y
    ))
    var indexSelected = position >= 0 ? (this.state.cx.length - 1) - position : position;
    this.ctx.clearRect(0, 0, 800, 400);
    for (let index = 0; index < this.state.cx.length; index++) {
      if (
        indexSelected !== -1 && 
        indexSelected === index &&         
        !isSelected
      ) {
        isSelected = true;
        console.log("selected ", index);
        this.setState({ selectedIndex: index });
        this.selectedSquare(
          this.state.cx[index],
          this.state.cy[index],
          this.ctx,
          1 / index,
          index
        );
      } else {
        this.drawSquare(
          this.state.cx[index],
          this.state.cy[index],
          this.ctx,
          1 / index,
          index
        );
      }
    }
    if (!isSelected) {
      this.setState({ selectedIndex: null });
    }
  };

  isPointInsideOfSquare = (canvasX, canvasY, squareX, squareY) => {
    if (
      canvasX >= squareX &&
      canvasX <= squareX + this.sideOfSquare &&
      canvasY >= squareY &&
      canvasY <= squareY + this.sideOfSquare
    )
      return true;
    else return false;
  };

  deleteSquare = (index) => {
    if (index != null) {
      this.state.cx.splice(index, 1);
      this.state.cy.splice(index, 1);
      this.state.pointsArray.splice(index, 1);
      this.state.selectedIndex = null;
      // this.setState({ selectedIndex: null });
      this.ctx.clearRect(0, 0, 800, 400);
      this.drawSquareWithSelected();
    }
  };

  drawSquareWithSelected = () => {
    for (let index = 0; index < this.state.cx.length; index++) {
      if (this.state.selectedIndex == index) {
        this.selectedSquare(
          this.state.cx[index],
          this.state.cy[index],
          this.ctx,
          1 / index,
          index
        );
      } else {
        // this.ctx.clearRect(0,0, 800, 400);
        this.drawSquare(
          this.state.cx[index],
          this.state.cy[index],
          this.ctx,
          1 / index,
          index
        );
      }
    }
  };

  handleKeyDown = (event) => {
    console.log("handleKeyDown");
    let keyPr = event.keyCode; //Key code of key pressed
    if (keyPr === 46) {
      this.onDelete();
      return;
    }
    if (keyPr === 68 && this.state.cx[this.state.selectedIndex] <= 740) {
      this.state.cx[this.state.selectedIndex] += 20; //D key add 20
      this.state.pointsArray[this.state.selectedIndex].x = this.state.cx[this.state.selectedIndex]
    } else if (keyPr === 65 && this.state.cx[this.state.selectedIndex] > 10) {
      this.state.cx[this.state.selectedIndex] -= 20; //A key subtract 20
      this.state.pointsArray[this.state.selectedIndex].x = this.state.cx[this.state.selectedIndex]
    } else if (keyPr === 87 && this.state.cy[this.state.selectedIndex] > 10) {
      this.state.cy[this.state.selectedIndex] -= 20; //W key subtract 20
      this.state.pointsArray[this.state.selectedIndex].y = this.state.cy[this.state.selectedIndex]
    } else if (keyPr === 83 && this.state.cy[this.state.selectedIndex] <= 350) {
      this.state.cy[this.state.selectedIndex] += 20; //S key add 20
      this.state.pointsArray[this.state.selectedIndex].y = this.state.cy[this.state.selectedIndex]
    }

    // clearing anything drawn on canvas
    this.ctx.clearRect(0, 0, 800, 400);

    //Drawing rectangle at new position
    this.drawSquareWithSelected();
  };

  toggleKeyboard = async () => {
    await this.setState({ isKeyboardOn: !this.state.isKeyboardOn });
    if (this.state.isKeyboardOn) {
      await document.addEventListener("keydown", (event) =>
        this.keyboardEventFunction(event)
      );
    } else {
      await document.removeEventListener(
        "keydown",
        (event) => this.keyboardEventFunction(event),
        true
      );
    }
  };

  render() {
    return (
      <Fragment>
        <div id="magic-rectangle">
          <canvas
            onClick={(e) => this.relMouseCoords(e)}
            width="800"
            height="400"
            id="svs"
            ref={this.canvasArea}
            className="canvas"
          ></canvas>
          {/* <div className="row">
            <div className="col-12"> */}
          <Row className="info">
            <Col md={1}></Col>
            <Col md={4}>
              <Row>
                <Col md={12}>
                  <button
                    onClick={() => this.onAdd()}
                    className="button button-add"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => this.onDelete()}
                    className="button button-delete"
                  >
                    Delete
                  </button>
                </Col>
                <Col md={12}>
                  <button
                    onClick={() => this.toggleKeyboard()}
                    className="button button-toggle"
                  >
                    Keyboard Control {this.state.isKeyboardOn ? "On" : "Off"}
                  </button>
                </Col>
              </Row>
            </Col>
            <Col md={5}>
              <Row>
                <Col md={12}>
                  <div className="button-lable">
                    Use Keyboard to move rectangle
                  </div>
                  <br />
                  <Row className="">
                    <Col md={6}>
                      <Row>
                        <Col md={6}>
                          <button className="button-arrows-main-vertical button-arrows">
                            &uarr;
                          </button>{" "}
                          <p className="button-lable">Press W</p>
                        </Col>
                        <Col md={6}>
                          <button className="button-arrows-main-vertical button-arrows">
                            &darr;
                          </button>{" "}
                          <p className="button-lable">Press S</p>
                        </Col>
                      </Row>
                    </Col>
                    <Col md={6}>
                      <Row>
                        <Col md={6}>
                          <button className="button-arrows-main-horizontal button-arrows">
                            &larr;
                          </button>{" "}
                          <p className="button-lable">Press A</p>
                        </Col>
                        <Col md={6}>
                          <button className="button-arrows-main-horizontal button-arrows">
                            &rarr;
                          </button>{" "}
                          <p className="button-lable">Press D</p>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
            <Col md={1}></Col>
          </Row>
        </div>
        {/* </div>
        </div> */}
      </Fragment>
    );
  }
}

export default HomePage;
