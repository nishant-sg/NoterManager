import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable';
import "./note.css"

function TextBox({x,y,noteId,handle,text,cross}) {
    console.log("adding text area at -",typeof(x),y);
    
  return (
      <Draggable
        axis="both"
        bounds="parent"
        defaultPosition= {{x: x, y: y}}
        onStop={handle}
        >
        <div className="note" id={"note-"+noteId} style={{ position: 'absolute' }}>
            <div class="cross" onClick={cross}>X</div>
          <textarea className='textArea' placeholder='Enter text here...' autoFocus>{text}</textarea>
        </div>
       </Draggable>
  );

}

export default TextBox;