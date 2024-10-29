import React from 'react';

const CroppingSettings = () => {

    const [frames, setFrames] = useState(null);
    const [selectedFrame, setSelectedFrame] = useState(null);

    const updateFrames = () => {
        if(canvas){
            const framesFromCanvas = canvas.getObjects("rect").filter((obj) => {
                return obj.name && obj.name.startsWith("Frame");
            });

            setFrames(framesFromCanvas);

            if(framesFromCanvas.length > 0){
                setSelectedFrame(framesFromCanvas[0]);
            }
        }
    }

    useEffect(() => {
        updateFrames();
        
    }, [canvas, refreshKey]);

    const handleFrameSelect = (value) => {
        const selected = frames.find((frame) => frame.name === value);
        setSelectedFrame(selected);
        canvas.setActivateObject(selected);
        canvas.renderAll();
    }

    const exportFrameAsPNG = () => {
        if(!selectedFrame) return ;

        frames.forEach((frame) => {
           frame.set("visible", false);
        });

        selectedFrame.set({
            strokeWidth: 0,
            visible : true,
        });

        const dataURL = canvas.toDataURL({
            left: selectedFrame.left,
            top: selectedFrame.top,
            width: selectedFrame.width * selectedFrame.scaleX,
            height: selectedFrame.height * selectedFrame.scaleY,
            format : "png",
        });

        selectedFrame.set({
            strokeWidth: 1,
        });

        frames.forEach((frame) => {
            frame.set("visible", true);
         });

    }
  return (
    <div>
      
    </div>
  )
}

export default CroppingSettings;
