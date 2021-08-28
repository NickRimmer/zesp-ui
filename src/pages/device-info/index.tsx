import React from "react";
import {FadeIn} from "../../shared/fadein-transition";
import {Card} from "react-bootstrap";
import {useParams, NavLink} from "react-router-dom";

export default () => {
  const {ieee, device} = useParams<{ ieee: string, device: string }>();

  return (
    <FadeIn>
      <Card>
        <Card.Header>Not implemented yet!</Card.Header>
        <Card.Body>
          <p>Device: <span className="badge bg-info">{ieee} ({device})</span></p>
          <p>
            Hello, my dear friend! Just imagine how awesome this feature can be and share it with developers ~_~ <br/>
            Or you can even implement it yourself, everything you need is just to jump to source codes, made some magic, test it and that's it!
          </p>
          <p>
            <NavLink to="/devices">Go back for now</NavLink>
          </p>
        </Card.Body>
      </Card>
    </FadeIn>
  );
}