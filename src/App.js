import "./styles.css";
import video from "./movie.mp4";
import subz from "./subs.vtt";

import { useEffect, useRef, useState } from "react";
export default function App() {
  const playref = useRef(null);
  const barref = useRef(null);
  const timewrapper = useRef(null);
  const [media, setMedia] = useState();
  const [bar, setBar] = useState();
  const [vidtime, setVidtime] = useState("0:00");
  const [vidlength, setVidLength] = useState(100);

  const [subIndex, setSubIndex] = useState(2);

  const [subs, setSubs] = useState(`
  WEBVTT
  00:00:00.500 --> 00:00:02.000
  The Web is always changing
  00:00:02.500 --> 00:00:04.300
  and the way we access it is changing
  00:00:00.500 --> 00:00:02.000
  while we cant do much about that
  00:00:02.500 --> 00:00:04.300
  it is what is it
  `);

  useEffect(() => {
    const media = playref.current;
    const bar = barref.current;
    const timeWrapper = timewrapper.current;
    setMedia(media);
    setBar(bar);

    const setTime = () => {
      const minutes = Math.floor(media.currentTime / 60);
      const seconds = Math.floor(media.currentTime - minutes * 60);

      const minuteValue = minutes.toString().padStart(2, "0");
      const secondValue = seconds.toString().padStart(2, "0");

      const mediaTime = `${minuteValue}:${secondValue}`;
      setVidtime(mediaTime);

      //const barLength = bar.clientWidth * (media.currentTime / media.duration);
      var barLength =
        timeWrapper.clientWidth * (media.currentTime / media.duration);
      setVidLength(
        timeWrapper.clientWidth * (media.currentTime / media.duration)
      );
      //bar.style.width = `${barLength}px`;
    };

    media.addEventListener("timeupdate", setTime);

    return () => {
      media.removeEventListener("timeupdate", setTime);
    };
  }, []);

  useEffect(() => {
    const media = playref.current;
    const result = subs.split(/[ ]{2,}/);

    console.log(result);

    const updatesubs = () => {
      var current = [
        result[subIndex].split(/\s/)[0],
        result[subIndex].split(/\s/)[2]
      ];
      const minutes = Math.floor(media.currentTime / 60);
      const seconds = Math.floor(media.currentTime - minutes * 60);
      const a = media.currentTime.toString();
      //00:00:04.300
      //0.994,45
      const current_time_formatted = `00:00:${a.slice(-9, -3)}`;
      console.log(current_time_formatted);
      if (current_time_formatted === "00:00:1.247") {
        console.log("hello world");
      }
    };

    //since chrome fires every 250ms, need to call updatesubs every 10ms or less through setInterval()
    media.addEventListener("timeupdate", updatesubs);

    return () => {
      media.removeEventListener("timeupdate", updatesubs);
    };
  }, []);
  const playpause = () => {
    if (media.paused) {
      media.play();
    } else {
      media.pause();
    }
  };
  const restart = () => {
    media.pause();
    media.currentTime = 0;
  };
  return (
    <div className="App">
      <h1> video experiment </h1>
      <video ref={playref}>
        <source src={video} type="video/mp4" />
        <track
          label="English"
          kind="subtitles"
          srclang="en"
          src={subz}
          default
        />
      </video>
      <p>{vidtime}</p>
      <div
        ref={timewrapper}
        style={{ width: "200px", backgroundColor: "blue" }}
      >
        <div
          style={{
            width: `${vidlength}px`,
            height: "30px",
            backgroundColor: "red"
          }}
          ref={barref}
        ></div>
      </div>
      <button onClick={() => playpause()}>play/pause</button>
      <button onClick={() => restart()}>restart</button>
    </div>
  );
}
