import { React, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { GithubPicker } from "react-color"

function UpdateEvent(props) {
    const [name, setName] = useState(props.event.name);
    const [showPicker, setPicker] = useState(false);
    const [color, setColor] = useState(props.event.color);

    return (
        <>
            <form className="EventCard">
                <input 
                    id="event-input"
                    type="text"
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Event Name"
                    required
                />
                <button className="CalBtn" type="button" onClick={() => setPicker(!showPicker)}>Event Color</button>
                {showPicker ? <div style={{position: 'absolute', zIndex: '15'}}>
                    <div style={{position: 'fixed', top: '0px', left: '0px', right: '0px', bottom: '0px'}} onClick={() => setPicker(false)}/>
                    <GithubPicker triangle="hide" onChange={(e) => {setColor(e.hex); setPicker(false)}}/>
                    </div> : null}

                <div id="event-ops">
                    <button className="CalBtn" type="button" 
                        onClick={() => {if (name) {props.onSave(name, color, props.event._id)}}}
                    >Save</button>
                    <button className="CalBtn" type="button"
                        onClick={() => {props.onDelete(props.event._id)}}
                    >Delete</button>
                    <button className="CalBtn" type="button"
                        onClick={() => {props.onCancel()}}
                    >Cancel</button>
                </div>
            </form>
            <div className="Focus"/>
        </>
    )
};

export default UpdateEvent;