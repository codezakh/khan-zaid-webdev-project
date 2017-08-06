import React, { Component } from 'react';
import $ from 'jquery/src/jquery';
import Keys from './App.config';
import request from 'request-promise-native/lib/rp';
import 'reddit.js/reddit'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sampleList: ['a', 'b', 'c', 'd'],
      filteredList : ['a','b','c','d'],
      detailState: {detailInView: false, letterInView:undefined},
      redditPosts: []
    };

    this.handleSearch = this.handleSearch.bind(this);
    this.handleLetterDetail = this.handleLetterDetail.bind(this);
    this.downloadRedditData = this.downloadRedditData.bind(this);
  };

  handleLetterDetail(letter) {
    let {detailInView, letterInView} = this.state.detailState;
    if (detailInView && letter === letterInView) {
      console.log('Toggling letters')
      this.setState({
        detailState: {
          detailInView: false,
          letterInView: undefined
        }
      });
    } else if (detailInView && letter !== letterInView) {
      console.log('switching letters');
      this.setState({detailState: {detailInView: true, letterInView: letter}});
    } else if (!detailInView) {
      console.log('switching on')
      this.setState({detailState: {detailInView: true, letterInView: letter}});
    }
  }

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

  downloadRedditData() {
    window.reddit.top('deepfriedmemes').t('all').limit(1).fetch(function(res){
      console.log(res.data.children[0].data.url);
    })
  };

  componentDidMount(){
    var self = this;
    this.downloadRedditData();
  }

  render() {
    return (
      <div>
        <SearchBar search={this.handleSearch}/>
        <ul>
          {this.state.filteredList.map((letter, i) => <Letter key={i}
                                                              letter={letter}
                                                              showDetailView={this.handleLetterDetail}/>)}
        </ul>
        <LetterDetailView detailState={this.state.detailState}/>
      </div>
    );
  }
}

const LetterDetailView = ({detailState}) => {
  let {detailInView, letterInView} = detailState;
  if (detailInView) {
    return (
      <div>
        You have truly been sprongled by "{letterInView}" my man
      </div>
    )
  } else {
    return (
      <div></div>
    );
  }
};



const Letter = ({letter, showDetailView}) => (
  <li>
    <div id="{letter}" onClick={()=>showDetailView(letter)}>
    {letter}
    </div>
  </li>
)


const SearchBar = ({search}) => {
  return (
    <input id="memeSearchBox"
           type="text"
           onKeyUp={(event) => search($('#memeSearchBox').val())}>

    </input>
  );
};

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
