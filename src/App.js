import React, { Component } from 'react';
import $ from 'jquery/src/jquery';
import Keys from './App.config';

class App extends Component {
  render() {
    return (
      <Meme memeUrl="https://i.redd.it/xs8icxq11qdz.jpg"
            memeText="text"
            displayTitle="title"/>
    );
  }
}

const Meme = ({memeUrl, memeText, displayTitle}) => (
  <div>
    <h1>{displayTitle}</h1>
    <p>{memeText}</p>
    <img src={memeUrl} alt={memeText}/>
  </div>
);

const processMeme = (memeUrl) => {
  let subscriptionKey = Keys.MicrosoftOCR;
  let uriBase = "https://westcentralus.api.cognitive.microsoft.com/vision/v1.0/ocr";
  let params = {
    "language": "en",
    "detectOrientation ": "true",
  };
  let ocr = $.ajax({
    url: uriBase + "?" + $.param(params),

    // Request headers.
    beforeSend: function(jqXHR){
      jqXHR.setRequestHeader("Content-Type","application/json");
      jqXHR.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
    },

    type: "POST",

    // Request body.
    data: '{"url": ' + '"' + memeUrl + '"}',
  })

    .done(function(data) {
      // Show formatted JSON on webpage.
      console.log(data);
      return "it worked!!!";
    })

    .fail(function(jqXHR, textStatus, errorThrown) {
      // Display error message.
      return "something went wrong"
    });
  console.log(JSON.stringify(ocr));
  return JSON.stringify(ocr);
};

export default App;
