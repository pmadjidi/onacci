import React, { Component } from 'react';
import { Redirect } from 'react-router'



class Settings extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
    }
}




render() {

  return (
  <div ClassName = "wrapperSettings">
  <div ClassName = "settings">Settings </div>
  <div id="drop_zone" className = "drop_zoneSettings" ondrop="drop_handler(event);" ondragover="dragover_handler(event);" ondragend="dragend_handler(event);">
  <strong>Drag one or more files to this Drop Zone ...</strong>
</div>
  </div>
)
}
}

export default Settings
