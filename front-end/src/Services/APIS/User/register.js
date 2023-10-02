import axios from "axios";

export const Registration = async (payload) => {
  try {
    const result = await axios.post(
      `http://localhost:5000/users/register`,
      payload
    );
    console.log("from Api", result);

    if (result?.status === 200) {
      if (!result?.data?.error) {
        console.log(result);
        return result?.data;
      }
    }
  } catch (err) {
    console.log(err.response.data);
    throw err;
  }
};