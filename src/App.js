import './styles.scss';
import {Canvas, Circle, Rect} from "fabric";
import React, {useRef, useState, useEffect} from 'react';
import {Button, IconButton} from "blocksin-system";
import {SquareIcon, CircleIcon} from "sebikostudio-icons";
import Settings from './settings';
import Video from './video';
import CanvasSettings from './CanvasSettings';
import {handleObjectMoving, clearGuidelines} from "./snappingHelpers";

function CanvasApp() {

  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [guidelines, setGuidelines] = useState([]);

  useEffect(() => {
    if(canvasRef.current) {
      const initCanvas = new Canvas(canvasRef.current, {
        width : 350,
        height : 350,
      });

      initCanvas.backgroundColor = "#fff";
      initCanvas.renderAll();

      setCanvas(initCanvas);

      initCanvas.on("object:moving", (event) => 
        handleObjectMoving(initCanvas, event.target, guidelines, setGuidelines)
      );

      initCanvas.on("object:modified", (event) => 
        handleObjectMoving(initCanvas, guidelines, setGuidelines)
      );


      return () => {
        initCanvas.dispose();
      };
    }
  }, []);

const addRectangle= () => {
  if(canvas){
    const rect = new Rect({
      top : 220,
      left : 200,
      width : 100,
      height : 60,
      fill : "black",
    });

    canvas.add(rect);
  } 
}

const addCircle= () => {
  if(canvas){
    const circle = new Circle({
      top : 220,
      left : 220,
      radius : 30,
      fill : "blue",
    });

    canvas.add(circle);
  } 
}
  return (
    <div className="App">
      <div className='Toolbar darkmode'>
       <IconButton onClick={addRectangle} variant="ghost" size="medium">
        <SquareIcon/>
       </IconButton>
       <IconButton onClick={addCircle} variant="ghost" size="medium">
        <CircleIcon/>
       </IconButton>
       <Video canvas={canvas} canvasRef={canvasRef}/>

      </div>
      <canvas id='canvas' ref={canvasRef} />
      <Settings canvas={canvas}/>
      <CanvasSettings canvas={canvas}/>
      
    </div>
  );
}
export default CanvasApp;
