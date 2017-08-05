import React, { Component } from 'react';
import $ from 'jquery/src/jquery';
import Keys from './App.config';
import {isUndefined} from 'lodash';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sampleList: ['a', 'b', 'c', 'd'],
      filteredList : ['a','b','c','d']
    };

    this.handleSearch = this.handleSearch.bind(this);
  };

  handleSearch(filterValue) {
    if (filterValue){
      let filteredList = this.state.sampleList.filter((listItem) => {
        return listItem === filterValue;
      });
      this.setState({filteredList: filteredList});
    } else {
      this.setState({filteredList: this.state.sampleList});
    }
  };

  render() {
    return (
      <div>
      <SearchBar search={this.handleSearch}/>
        <ul>
          {this.state.filteredList.map((letter, i) => <Letter key={i} letter={letter}/>)}
        </ul>
    </div>
    );
  }
}

const Letter = ({letter}) => (
  <li>
    {letter}
  </li>
)

const Meme = ({memeUrl, memeText, displayTitle}) => (
  <div>
    <h1>{displayTitle}</h1>
    <p>{memeText}</p>
    <img src={memeUrl} alt={memeText}/>
  </div>
);

const SearchBar = ({search}) => {
  const doSearch = (event) => {
    search($('#sprongle').val());
  };

  return (
    <input id="sprongle" type="text" onKeyUp={doSearch}></input>
  );
}

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
