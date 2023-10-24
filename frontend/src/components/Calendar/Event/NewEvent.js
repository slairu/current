import { addHours, isAfter } from "date-fns";
import { React, useState } from "react";
import DatePicker from "react-datepicker";
import { GithubPicker } from "react-color"
import "react-datepicker/dist/react-datepicker.css";

function NewEvent(props) {
    const [name, setName] = useState("");
    const [start, setStart] = useState(new Date(props.start));
    const [end, setEnd] = useState(addHours(start, 1));
    const [showPicker, setPicker] = useState(false);
    const [color, setColor] = useState("#ff0000");

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
                    autoFocus
                />
                <div id="time-picker">
                    <p>From</p>
                    <DatePicker 
                    triangle="hide"
                        selected={start}
                        onChange={(date) => setStart(date)}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={60}
                        dateFormat={"h:mm aa"}
                    />
                </div>
                <div id="time-picker">
                    <p>To</p>
                    <DatePicker 
                        selected={end}
                        onChange={(date) => setEnd(date)}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={60}
                        dateFormat={"h:mm aa"}
                    />
                </div>
                <button className="CalBtn" type="button" onClick={() => setPicker(!showPicker)}>Event Color</button>
                {showPicker ? <div style={{position: 'absolute', zIndex: '15'}}>
                    <div style={{position: 'fixed', top: '0px', left: '0px', right: '0px', bottom: '0px'}} onClick={() => setPicker(false)}/>
                    <GithubPicker triangle="hide" onChange={(e) => {setColor(e.hex); setPicker(false)}}/>
                    </div> : null}
                <div id="event-ops">
                    <button className="CalBtn" type="button" 
                        onClick={() => {if (name && isAfter (end, start)) {props.onSave(name, start, end, color)}}}
                    >Save</button>
                    <button className="CalBtn" type="button"
                        onClick={() => {props.onCancel()}}
                    >Cancel</button>
                </div>
            </form>
            <div className="Focus"/>
        </>
    )
};

export default NewEvent;