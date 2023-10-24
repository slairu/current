import { React, useState } from "react";
import { format, isEqual, differenceInHours } from "date-fns";

function Hour(props) {
    const [hover, setHover] = useState(false);
    
    // Reference: https://gist.github.com/renancouto/4675192
    function LightenColor(color, percent) {
        var num = parseInt(color.replace("#",""),16),
        amt = Math.round(2.55 * percent),
        R = (num >> 16) + amt,
        B = ((num >> 8) & 0x00FF) + amt,
        G = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (B<255?B<1?0:B:255)*0x100 + (G<255?G<1?0:G:255)).toString(16).slice(1);
        };
    
    // Reference: https://stackoverflow.com/questions/946544/
    function pickTextColor(bg_color) {
        var num = parseInt(bg_color.replace("#",""),16),
        R = (num >> 16),
        B = ((num >> 8) & 0x00FF),
        G = (num & 0x0000FF);
        return (R*0.299 + G*0.587 + B*0.114) > 167 ? "#000" : "#FFF";
    };

    return (
        <>
        {
        props.event === undefined &&
        <div 
            onClick={props.onClick} 
            className={"Hours"}>
        </div>
        }
        {
        props.event !== undefined &&
        isEqual(new Date(props.event.startTimestamp), props.hour) &&
        <div 
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={props.onClick}
            className={"Hours"}
            style={{
                borderTop: '0px',
                borderBottom: '0px',
                marginTop: '0px',
                backgroundColor: hover ? LightenColor(props.event.color, -13) : props.event.color, 
                gridRow: 'span ' + differenceInHours(new Date(props.event.endTimestamp), props.hour)}}
            >
            <div>
                <p id="event-name" style={{color: pickTextColor(props.event.color)}}>{props.event.name ? props.event.name.toString() : "(No title)"}</p>
                <p id="time-slice" style={{color: pickTextColor(props.event.color)}}>{format(new Date(props.event.startTimestamp), 'h a')} - {format(new Date(props.event.endTimestamp), 'h a')}</p>
            </div>
        </div>
        }
        </>
    )
};

export default Hour;