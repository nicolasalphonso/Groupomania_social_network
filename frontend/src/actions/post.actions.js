import axios from "axios";

 // setting the options for the authenticated request
 let data = JSON.parse(localStorage.getItem("ReponseServeur"));

// actions sur les posts
export const GET_ALL_POSTS = "GET_ALL_POSTS";

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