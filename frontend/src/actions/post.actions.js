import axios from "axios";

 // setting the options for the authenticated request
 let data = JSON.parse(localStorage.getItem("ReponseServeur"));

// actions sur les posts
export const GET_ALL_POSTS = "GET_ALL_POSTS";
export const DELETE_POST = "DELETE_POST"

export const getAllPosts = () => {
    return(dispatch) => {
        return axios
            .get("http://localhost:7000/api/posts", {
                headers: {
                  Authorization: `bearer ${data.token}`,
                },
              })
            .then((res) => {
                dispatch({type: GET_ALL_POSTS, payload: res.data});
            })
            .catch((error) => console.log(error));
    }
}

export const deletePost = (id) => {
  const url = "http://localhost:7000/api/posts/" + id;
  return(dispatch) => {
    return axios
          .delete(url, {
              headers: {
                Authorization: `bearer ${data.token}`,
              },
            })
          .then((res) => {
              dispatch({type: DELETE_POST, payload: res.data});
          })
          .catch((error) => console.log(error));
  }
}