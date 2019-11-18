import React from 'react';
import Paper from '@material-ui/core/Paper';
import Dropzone from 'react-dropzone';
function Upload (props) {
    return (
        <Paper className="upload paper section">
          <p>Uploaded Image</p>
          <Dropzone
            style={{}}
            accept="image/png, image/jpg, image/jpeg"
            onDrop={(accepted, rejected) => {
              props.updateAcceptance(accepted);
            }}
          >
            <div>
              {props.accepted[0] ? (
                <img alt="Your upload" src={props.accepted[0].preview} />
              ) : (
                ''
              )}
            </div>
          </Dropzone>
        </Paper>
    )
}

export default Upload;