import ReactTooltip from "react-tooltip";

const CommentsWidget = ({projectId})=>{
  return(
    <li data-tip="Comments">
      <Icon icon="comment" />
      <ReactTooltip /> {comments.length}
    </li>
  );
};
export default CommentsWidget;