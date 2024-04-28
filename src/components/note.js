import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import "./note.css"
import * as XLSX from 'xlsx';
import TextBox from './textbox';

function Note() {
  // var rows = [];
  var positions = new Map();
  var x = 500;
  var y = 400;
  const boxHeight = 150;
  const boxWidth = 200;
  const [notes, setNotes] = useState([]);
  var nt = [];

  const handleDrag = (e, dragElement) => {
    const id = dragElement.node.id;
    positions.set(id, [dragElement.x, dragElement.y]);
    const centerX = dragElement.x + boxWidth / 2;
    const centerY = dragElement.y + boxHeight / 2;
    console.log(centerX, centerY);
    console.log("Handling Drag", dragElement.x, dragElement.y, dragElement.node.id, positions);
    for (const [key, [eleX, eleY]] of positions) {
      console.log(`Key: ${key}, Value 1: ${eleX}, Value 2: ${eleY}`);
      if (key != id && centerX > eleX && centerY > eleY && centerX < eleX + boxWidth && centerY < eleY + boxHeight) {
        console.log("should merge", key, id);
        // const myElement = ;
        var fromEle = null;
        var toEle = null;
        var cross = null;
        for (const child of document.getElementById(id).children) {
          console.log(child.tagName);
          if (child.tagName == "TEXTAREA") {
            console.log("this is innerhtml- ", child.value);
            fromEle = child;
          }if (child.tagName == "DIV") {
            console.log("this is innerhtml- ", child.value);
            cross = child;
          }
        }
        console.log(key);
        for (const child of document.getElementById(key).children) {
          console.log(child.tagName);
          if (child.tagName == "TEXTAREA") {
            console.log("this is innerhtml- ", child.value);
            toEle = child;
          }
        }
        toEle.value = toEle.value + fromEle.value;
        cross.click();

      }
    }

  }

  const removeText = (e)=>{
    e.target.parentElement.style.display="none";
    console.log(e.target.parentElement.id);
    const id = e.target.parentElement.id;
    e.target.parentElement.remove();
    positions.delete(id);
   }
  const handleClick = (e) => {
    x = e.clientX;
    y = e.clientY;
  }
  const handleDoubleClick = (e) => {
    x = e.clientX;
    y = e.clientY;
    addText(e, "");

    console.log(notes);
    console.log(nt);
    console.log(positions);
  }

  const handlePaste = (e) => {
    console.log("hellooo- ", e.clipboardData.getData("text"));
    console.log(e);
    addText(e, "");

  }

  const addText = (e, text) => {
    // document.getElementById("note-container").dblclick();
    const container = document.getElementById("note-container");
    console.log('Double click occurred! x-', typeof (e.clientX), " y-", e.clientY);
    const id = nt.length;
    setNotes(notes => [...notes, <TextBox handle={handleDrag} cross={removeText} noteId={id} x={x - container.offsetLeft} y={y - container.offsetTop} text={text} />])
    positions.set("note-" + id, [x - container.offsetLeft, y - container.offsetTop]);
    nt.push(id);

  }

  const calcDiagnol = (a,b)=>{
    return Math.sqrt(a*a + b*b);
  }

  const  exportToExcel = () => {
    const data= [
      ['Notes', 'Distance from top', 'Distance from left', 'Distance from top-left corner'],
    ]
    console.log(positions);   
    const parent = document.getElementById("note-container");
    // console.log(parent);
    Array.from(parent.children).forEach(child => {
      console.log(child);
      var textEle = null;
      for (const dc of child.children) {
        console.log(dc.tagName);
        if (dc.tagName == "TEXTAREA") {
          console.log("this is innerhtml- ", dc.value);
          textEle = dc;
        }

      }
      const rect = child.getBoundingClientRect()
      data.push([textEle.value,rect.top,rect.left,calcDiagnol(rect.top,rect.left)])
    });
    // for (const [key, [eleX, eleY]] of positions) {
    //   console.log(key);
    //   const ele = document.getElementById(key);
    //   data.push(["hello",ele.top,ele.left,ele.right]);
    //   console.log(ele);
    //   }
    
    console.log(data);
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'data.xlsx');
  };

  useEffect(() => {
    document.getElementById("note-container").addEventListener("dblclick", handleDoubleClick);
    document.getElementById("note-container").addEventListener("paste", handlePaste);
    document.getElementById("note-container").addEventListener("click", handleClick);

  }, []);

  return (
    <div>

    <div id="note-container" class="note-container">
      {notes}
    </div>
      <div className='export' onClick={exportToExcel}>
        Export Data
      </div>
    </div>
  );

}

export default Note;