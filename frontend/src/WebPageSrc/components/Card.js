import React from 'react'

function Card(props) {
    return (
       
            <div className={`card  col-lg-8 col-md-10 mt-4 text-light hover-shadow ${props.available?"back2earth":"burningOrange"} burningOrange rounded`} key={props.id} style={{ textAlign:"center" }}>
            <div className="card-body">
                <h5 className="card-title">from: {props.heading}</h5>
                <p className="card-text">
                 {props.content}
                </p>
                <button type="button" onClick={()=>props.ClickEvent(props.id)} className="btn btn-primary btn-rounded" disabled={!props.available}>{props.buttonText}</button>
            </div>
            <div className="card-footer">{props.footerContent}</div>
            </div>
    )
}

export default Card
