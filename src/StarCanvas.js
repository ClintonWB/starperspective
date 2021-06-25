import React, {Component} from 'react';
import './StarCanvas.css';

var cube = {
  stars:[
    {x:-50,y:-50,z:-50},
    {x:-50,y:-50,z:50},
    {x:-50,y:50,z:-50},
    {x:-50,y:50,z:50},
    {x:50,y:-50,z:-50},
    {x:50,y:-50,z:50},
    {x:50,y:50,z:-50},
    {x:50,y:50,z:50}
  ],
  lines:[
    [0,1],
    [0,2],
    [0,4],
    [1,3],
    [1,5],
    [2,3],
    [2,6],
    [3,7],
    [4,5],
    [4,6],
    [5,7],
    [6,7]
  ]
}

class StarCanvas extends Component {

  constructor(props) {
        super(props);
        var star_data = props.starData;
        star_data.stars.forEach(StarCanvas.initializeStarData, this);
        this.state = {
          star_data: star_data || cube,
          show_lines: 0,
          show_stars: 1,
        }
  }


  static getDerivedStateFromProps(props,state){
    if (state.star_data.name === props.starData.name){
      return false;
    }
    var star_data = props.starData;
    star_data.stars.forEach(StarCanvas.initializeStarData, this);
    return {star_data: star_data || cube};
  }

  drawLine(line){
    var p1 = this.state.star_data.stars[line[0]];
    var p2 = this.state.star_data.stars[line[1]];
    this.ctx.beginPath();
    this.ctx.strokeStyle = "#BBBBBB";
    this.ctx.moveTo(p1.canvas.x,p1.canvas.y)
    this.ctx.lineTo(p2.canvas.x,p2.canvas.y)
    this.ctx.closePath();
    this.ctx.stroke();
  }

  drawStar(star){
    var size = (star.canvas.z)/this.canvas.width*20+20
    this.ctx.drawImage(this.starSVG,star.canvas.x-size/2,star.canvas.y-size/2,size,size);
  }

  drawCanvas(){
    this.ctx.clearRect(-this.canvas.width/2,-this.canvas.height/2,this.canvas.width, this.canvas.height);
    this.state.star_data.stars.forEach(this.updateStarData, this);
    if(this.state.show_lines){
        this.state.star_data.lines.forEach(this.drawLine,this);
    }
    if(this.state.show_stars){
      this.state.star_data.stars.forEach(this.drawStar,this);
    }
    this.rotations = {x:0,y:0};
    window.requestAnimationFrame(this.drawCanvas.bind(this));
  }

  updateStarData(star){
    var [x,y,z] = [star.canvas.x, star.canvas.y, star.canvas.z];
    [x,z] = [Math.cos(this.rotations.x)*x + Math.sin(this.rotations.x)*z,
             -Math.sin(this.rotations.x)*x + Math.cos(this.rotations.x)*z];
    [y,z] = [Math.cos(this.rotations.y)*y + Math.sin(this.rotations.y)*z,
             -Math.sin(this.rotations.y)*y + Math.cos(this.rotations.y)*z];
    star.canvas.x = x;
    star.canvas.y = y;
    star.canvas.z = z;
  }

  startMouseData(evt){
    if(evt.touches){
      evt = evt.touches[0];
    }
    this.startX = evt.clientX;
    this.startY = evt.clientY;
    this.mouseX = evt.clientX;
    this.mouseY = evt.clientY;
    this.moving = true;
  }
  moveMouse(evt){
    if(evt.touches){
      evt = evt.touches[0];
    }
    if(this.moving){
      this.rotations = {x:(evt.clientX - this.mouseX)/40,
                        y:(evt.clientY - this.mouseY)/40}
      this.mouseX = evt.clientX;
      this.mouseY = evt.clientY;
    }
  }
  endMouseData(evt){
      this.moving = false;
  }

  static initializeStarData(star){
      star.canvas = Object.assign({},star);
  }

  toggleLines(evt){
    this.setState({show_lines: 1-this.state.show_lines});
  }
  toggleStars(evt){
    this.setState({show_stars: 1-this.state.show_stars});
  }

  componentDidMount(){
    this.canvas = document.getElementById("star-canvas");
    this.starSVG = document.getElementById("starsvg");
    this.ctx = this.canvas.getContext("2d");
    this.rotations = {x:0,y:0,z:0};
    this.ctx.translate(this.canvas.width/2,this.canvas.height/2);
    this.started = new Date();
    window.addEventListener("touchstart",this.startMouseData.bind(this));
    window.addEventListener("mousedown",this.startMouseData.bind(this));
    window.addEventListener("touchmove",this.moveMouse.bind(this));
    window.addEventListener("mousemove",this.moveMouse.bind(this));
    window.addEventListener("touchend",this.endMouseData.bind(this));
    window.addEventListener("mouseup",this.endMouseData.bind(this));
    window.requestAnimationFrame(this.drawCanvas.bind(this));
  }

  render(){
    return (
      <div>
      <img id="starsvg" src="svgstar.svg" alt="star"></img>
      <button onClick={this.toggleLines.bind(this)}>{this.state.show_lines? "Hide":"Show"} Lines</button>
      <button onClick={this.toggleStars.bind(this)}>{this.state.show_stars? "Hide":"Show"} Stars</button>
      <div className="star-canvas-container">
        <canvas id="star-canvas" width="500" height="500">
        </canvas>
      </div>
      </div>
      );
  }
}

export default StarCanvas;
