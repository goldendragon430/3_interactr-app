import React from 'react'
import cx from "classnames";
import styles from "./ItemSelect.module.scss"
import Button from "./Buttons/Button";
import getAsset from "../utils/getAsset";

const ItemSelect = ({heading, description, onClick, image = false})=>{

  if(! image) image = getAsset('/img/avatar-logo.png');

  return(
    <div className={cx(styles.itemSelect, "clearfix")}>
      <img className={styles.imagePlaceholder} src={image}/>
      <h3>{heading}</h3>
      <p>{description}</p>
      <Button primary small style={{float: 'none', marginBottom: '10px'}} onClick={onClick} rightIcon={true} icon={'arrow-right'} noMarginRight>Select</Button>
    </div>
  )
}
export default ItemSelect;