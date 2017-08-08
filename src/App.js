import React, { Component } from 'react';
import $ from 'jquery';
import Keys from './App.config';
import 'reddit.js/reddit'
import {parsePosts} from './RedditParser';
import {Button, Row, Grid, FormControl} from 'react-bootstrap';
import { BrowserRouter as Router, Route,} from 'react-router-dom'
import JSONPretty from 'react-json-pretty';
import {find} from 'lodash';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redditPosts: [],
      filteredRedditPosts: [],
      notFound: {'404': 'Not found'},
    };

    this.handleMemeSearch = this.handleMemeSearch.bind(this);
    this.downloadRedditData = this.downloadRedditData.bind(this);
    this.getDetailPost = this.getDetailPost.bind(this);
  };

  getDetailPost(postId) {
    return find(this.state.redditPosts, {id: postId}) || this.state.notFound;
  }

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
    window.reddit.top('surrealmemes').t('all').limit(20).fetch(function(res){
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
        <Grid fluid="true">
          <div className="center-me">
            <div>
              <Route path="/swoogity/:postId" render={(match) => (
                <RedditPostDetailView getPost={this.getDetailPost}
                                      match={match}/>
              )}/>
            </div>
            <Route exact path="/" render={() => (
              <div>
                <SearchBar search={this.handleMemeSearch}/>
                <div>
                  <ul>
                    {this.state.filteredRedditPosts.map((post, idx) => {
                      return (<Row key={idx}>
                        <RedditPostListItem post={post}
                                            setDetailPost={this.setDetailPost}/>
                      </Row>);
                    })}
                  </ul>
                </div>
              </div>
            )}/>
          </div>
        </Grid>
      </Router>
    );
  }
}

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

const RedditPostDetailView = ({getPost, match}) => {
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
    <FormControl id="memeSearchBox"
           type="text"
                 placeholder="search by post title"
           onKeyUp={(event) => search($('#memeSearchBox').val())}>

    </FormControl>
  );
};


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
