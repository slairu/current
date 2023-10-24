import React from "react";

function CalHeader({dateRange, prevWeek, nextWeek, toToday}) {
    return (
        <div className="CalHeader">
            <div>
                <button className="CalBtn" id="week-nav" onClick={prevWeek}>&larr;</button>
                <button className="CalBtn" id="week-nav" onClick={nextWeek}>&rarr;</button>
            </div>
            <div id="date-range">{dateRange}</div>
            <button className="CalBtn" id="today-btn" onClick={toToday}>Today</button>
        </div>
    )
};

export default CalHeader;