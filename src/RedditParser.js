const parsePosts = function parsePosts(redditResponse) {
  let postCollection = redditResponse.data.children.map(
    (rawPost) => (rawPost.data)
  );
  return postCollection;
};

export {parsePosts};