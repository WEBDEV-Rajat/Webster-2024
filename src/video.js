import { Button, IconButton} from 'blocksin-system';
import { FabricImage } from 'fabric';
import { PlayIcon, StopIcon, VideoCameraIcon } from "sebikostudio-icons";

import React, {useState, useEffect, useRef}from 'react'

const Video = ({canvas, canvasRef}) => {
    const [videosrc, setVideosrc] = useState(null);
    const [fabricVideo, setFabricVideo] = useState(null);
    const [uploadMessage, setUploadMessage] = useState("");
    const [isPlaying, setisPlaying] = useState(false);
    const videoRef = useRef(null);
    const fileInputRef = useRef(null);

    const handleVideoUpload = (event) => {
        const file = event.target.files[0];

        if(file) {

            setVideosrc(null);
            setUploadMessage("");

            const url = URL.createObjectURL(file);
            setVideosrc(url);

            const videoElement = document.createElement("video");
            videoElement.src = url;
            videoElement.crossOrigin = "anonymous";

            videoElement.addEventListener("loadeddata", () => {
               const videoWidth = videoElement.videoWidth;
               const videoHeight = videoElement.videoHeight;
               videoElement.width = videoWidth;
               videoElement.height = videoHeight;

               const canvasWidth = canvas.width;
               const canvasHeight = canvas.height;

               const scale = Math.min(canvasWidth/videoWidth, canvasHeight/videoHeight);

               canvas.renderAll();

               const fabricImage = new FabricImage(videoElement, {
                left : 0,
                top : 0,
                scaleX : scale,
                scaleY : scale,
               });

               setFabricVideo(fabricImage);
               canvas.add(fabricImage);
               canvas.renderAll();

               setUploadMessage("Uploaded");
               setTimeout(() => {
                 setUploadMessage("")
               }, 3000);
            });

            videoElement.addEventListener("error", (error) => {
               console.error("Video load error:", error);
            });

            videoRef.current = videoElement;
        }
    };

    const handlePlayPauseVideo = () => {
        if(videoRef.current){
            if(videoRef.current.paused){
                videoRef.current.play();
                videoRef.current.addEventListener("timeupdate", () => {
                    fabricVideo.setElement(videoRef.current);
                    canvas.renderAll();
                });
                setisPlaying(true);
            }
            else {
                videoRef.current.pause();
                setisPlaying(false);
            }
        }
    };

    const handleStopVideo = () => {
        if(videoRef.current){
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
            setisPlaying(false);
            canvas.renderAll();
        }
    };

    const handleVideoUploadButtonClick = () => {
        fileInputRef.current.click();

    };

  return (
    <>
      <input 
        ref = {fileInputRef}
        type = "file"
        style = {{ display : 'none' }}
        accept = "video/mp4"
        onChange= {handleVideoUpload}
        />
      
      <IconButton
        onClick={handleVideoUploadButtonClick}
        variant="ghost"
        size="medium"
        >
        <VideoCameraIcon/>
        </IconButton>
       
       {videosrc && (
        <div className='bottom transform darkmode'>
            <div className='Toolbar'>
                <Button
                onClick={handlePlayPauseVideo}
                variant="ghost"
                size="medium"
                className="play"
                >
                    {isPlaying ? "Pause Video" : "Play Video"}
                </Button>
                <Button onClick={handleStopVideo} variant="ghost" size="medium">Stop</Button>
                {uploadMessage && (
                   <div className='upload-message'>{uploadMessage}</div>
                )}
            </div>
        </div>
       )}
    </>
  )
}

export default Video;
