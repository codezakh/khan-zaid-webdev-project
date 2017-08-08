import React, { Component } from 'react';
import $ from 'jquery';
import Keys from './App.config';
import 'reddit.js/reddit'
import {parsePosts} from './RedditParser';
import {Button, Row} from 'react-bootstrap';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import JSONPretty from 'react-json-pretty';
import {find} from 'lodash';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sampleList: ['a', 'b', 'c', 'd'],
      filteredList : ['a','b','c','d'],
      detailState: {detailInView: false, letterInView:undefined},
      redditPosts: [],
      filteredRedditPosts: [],
      notFound: {'404': 'Not found'},
    };

    this.handleSearch = this.handleSearch.bind(this);
    this.handleMemeSearch = this.handleMemeSearch.bind(this);
    this.handleLetterDetail = this.handleLetterDetail.bind(this);
    this.downloadRedditData = this.downloadRedditData.bind(this);
    this.getDetailPost = this.getDetailPost.bind(this);
  };

  getDetailPost(postId) {
    return find(this.state.redditPosts, {id: postId}) || this.state.notFound;
  }

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

  handleMemeSearch(searchValue) {
    if (searchValue){
      let filteredMemes = this.state.redditPosts.filter((post) => {
        return post.title.toUpperCase().includes(searchValue.toUpperCase());
      });
      this.setState({filteredRedditPosts: filteredMemes});
    } else {
      this.setState({filteredRedditPosts: this.state.redditPosts});
    }
  };

  downloadRedditData() {
    var self = this;
    window.reddit.top('deepfriedmemes').t('all').limit(20).fetch(function(res){
      self.setState({redditPosts: parsePosts(res)});
      self.setState({filteredRedditPosts: parsePosts(res)});
    })
  };

  componentDidMount(){
    var self = this;
    this.downloadRedditData();
  }

  render() {
    return (
      <Router>
        <div>
        <div>
          <Route path="/swoogity/:postId" render={(match) => (
            <RedditPostDetailView getPost={this.getDetailPost} match={match}/>
          )}/>
        </div>
          <Route exact path="/" render={() => (
            <div>
              <SearchBar search={this.handleMemeSearch}/>
              <ul>
                {this.state.filteredList.map((letter, i) => <Letter key={i}
                                                                    letter={letter}
                                                                    showDetailView={this.handleLetterDetail}/>)}
              </ul>
              <LetterDetailView detailState={this.state.detailState}/>
              <div>
                <ul>
                  {this.state.filteredRedditPosts.map((post, idx) => {
                    return (<Row key={idx}>
                      <RedditPostListItem post={post} setDetailPost={this.setDetailPost}/>
                    </Row>);
                  })}
                </ul>
              </div>
              <div>
                <Link to="/swoogity">This is a link</Link>
              </div>
            </div>
          )}>
          </Route>
        </div>
      </Router>
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
    <div id="{letter}" onClick={() => showDetailView(letter)}>
      {letter}
    </div>
  </li>
)

const RedditPostListItem = ({post, setDetailPost}) => (
  <li>
    <div id="{post.id}" onClick={() => console.log(post.id, 'clicked')}>
      <h1>{post.title}</h1>
      <img alt="reddit thumbnail"
           src={post.thumbnail}
           width="{post.thumbnail_width}"
           height="{post.thumbnail_height}"/>

      <div>
        <a href={`/swoogity/${post.id}`}>
          <Button bsStyle="primary">Detail</Button>
        </a>
      </div>
    </div>
  </li>
);

const RedditPostDetailView = function({getPost, match}) {
  let postId = match.match.params.postId;
  let post = getPost(postId);
  return (
    <div>
      <JSONPretty id="json-pretty" json={post}/>
    </div>
  );
};


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

const StupidComponent = () => (
  <div>
    <h1>Just destroy me</h1>
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
    beforeSend: function (jqXHR) {
      jqXHR.setRequestHeader("Content-Type", "application/json");
      jqXHR.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
    },

    type: "POST",

    // Request body.
    data: '{"url": ' + '"' + memeUrl + '"}',
  })

    .done(function (data) {
      // Show formatted JSON on webpage.
      console.log(data);
      return "it worked!!!";
    })

    .fail(function (jqXHR, textStatus, errorThrown) {
      // Display error message.
      return "something went wrong"
    });
  console.log(JSON.stringify(ocr));
  return JSON.stringify(ocr);
};

export default App;
