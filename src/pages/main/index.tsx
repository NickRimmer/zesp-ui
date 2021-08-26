import React from "react";
import Cover from "../../shared/cover";
import {FadeIn} from "../../shared/fadein-transition";

const Result = () => (
  <Cover>
    <FadeIn>
      <h1 className="cover-heading">Quite soon, here will be useful info</h1>
      <p className="lead">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ultricies ipsum porttitor,
        aliquet enim eu, congue nulla. Nulla luctus ante sit amet sodales convallis. Aliquam lectus nisl, semper eget
        aliquam et, malesuada ut orci.</p>
      <p className="lead">
        <a href="https://t.me/zesp32" target={"_blank"} rel="noreferrer" className="btn btn-lg btn-secondary">Get more</a>
      </p>
    </FadeIn>
  </Cover>
);

export default Result;