import React from "react";
import Card from "../Card/Card";
import { GetAllPosts } from "../../Services/APIS/Posts/GetAllPosts";

const Sub_Categories = ({
  subCategories,
  dispatch,
  setPosts,
  setLoading,
  GetCommentsByPost,
  postComments,
  setComments,
  limit,
  offset,
  setError,
}) => {
  return (
    <div className="bg-primary-5 mb-7 flex flex-col justify-center items-center">
      <h2 className="text-white mt-3 text-2xl">Sub Categories</h2>
      <div className="mt-3 flex items-center justify-center gap-10 flex-wrap">
        {subCategories?.map((category) => (
          <Card
            imageSrc={category.image}
            cardName={category.name}
            onClick={() => {
              GetAllPosts(limit, offset, 0, category?.id, 0)
                .then((posts) => {
                  dispatch(setPosts(posts));
                  posts?.forEach((el) => {
                    GetCommentsByPost(el.id)
                      .then((comments) => {
                        postComments[`post_${el?.id}`] = comments;
                        dispatch(setComments(postComments));
                      })
                      .catch((err) => {});
                  });
                })
                .catch((err) => {
                  setError(true);
                })
                .finally(() => {
                  setLoading(false);
                });
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Sub_Categories;
