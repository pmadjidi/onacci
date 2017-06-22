import React from 'react';
import Webcam from 'react-webcam';


class Webcamera extends React.Component {
  setRef = (webcam) => {
    this.webcam = webcam;
  }

  capture = () => {
    const imageSrc = this.webcam.getScreenshot()
    let payload
    let targetChannel
    let type = this.props.selected.type
    let name = this.props.selected.name
    let fileName = this.props.user + new Date().toString()
    if (type === "channel"){
      payload = {type: "assets", payload: {name: fileName, file: imageSrc, type: type, targetChannel: name}}
    }
    else
      payload = {type: "assets", payload: {name: fileName, file: imageSrc, type: type, targetUser: name}}

    this.props.send(payload)

  };

  render() {
    return (
      <div>
        <Webcam
          audio={false}
          height={350}
          ref={this.setRef}
          screenshotFormat="image/jpeg"
          width={350}
        />
        <button onClick={this.capture}>Capture photo</button>
      </div>
    );
  }
}

export default Webcamera
