import Spinner from "../components/Spinner/Spinner";
import ErrorMessage from "../components/ErrorMessage/ErrorMessage";

export const setContent = (process, Component, newItemLoading = false) => {
  switch (process) {
    case "waiting":
      return <Spinner />
    case "loading":
      return newItemLoading ? <Component /> : <Spinner />;
    case "error":
      return <ErrorMessage />;
    case "confirmed":
      return <Component />;
    default:
      throw new Error(`Unexpected process state => ${process}`);
  }
};
