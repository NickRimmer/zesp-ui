import React from "react";
import {FadeIn} from "../../shared/fadein-transition";

const Result = () => (
  <FadeIn>
    <div className="px-4 py-5 bg-light rounded-3">
      <div className="container-fluid">
        <h1 className="display-5 fw-bold">Not implemented yet!</h1>
        <p className="col-md-8 fs-4">
          Hello, my dear friend! Just imagine how awesome this feature can be and share it with developers ~_~ <br/><br/>
          Or you can even implement it yourself, everything you need is just to jump to source codes, made some magic, test it and that's it!
        </p>
        <hr className="my-4"/>
        <p>This feature is under contruction. You can find latest verion on <a href="#">github project page</a> or just click this big blue button bellow.</p>
        <a href="#" target={"_blank"} rel="noreferrer" className="btn btn-primary btn-lg" type="button">Learn more</a>
      </div>
    </div>
    {/*<div className="jumbotron">*/}
    {/*  <h1 className="display-4">Not implemented yet!</h1>*/}
    {/*  <p className="lead">*/}
    {/*    Hello, my dear friend! Just imagine how awesome this feature can be and share it with developers ~_~ <br/>*/}
    {/*    Or you can even implement it yourself, everything you need is just to jump to source codes, made some magic, test it and that's it!*/}
    {/*  </p>*/}
    {/*  <hr className="my-4"/>*/}
    {/*  <p>This feature is under contruction. You can find latest verion on <a href="#">github project page</a> or just click this big blue button bellow.</p>*/}
    {/*  <a className="btn btn-primary btn-lg" href="#" target={"_blank"} rel="noreferrer" role="button">Learn more</a>*/}
    {/*</div>*/}
  </FadeIn>
);

export default Result;