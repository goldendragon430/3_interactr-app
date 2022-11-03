import React from 'react'
import Button from "./Buttons/Button";
import {LargeTextInput, Option, TextInput} from "./PropertyEditor";
import SelectFont from "../modules/project/components/SelectFont";
import Icon from "./Icon";

const BaseForm = ({left, right, buttonText, buttonAction, loading}) => {
  return(
    <>
      <div className={'grid'} >
        <div className={'col11'}>
          <div className={'clearfix'} style={{maxWidth: '1460px', paddingBottom: '30px', marginTop: '-15px', marginLeft: '-15px'}}>
            <Button primary  icon="save" loading={loading} onClick={buttonAction}>
              {buttonText || 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
      <div className={'grid'}>
        <div className={'col5'}>
          {left}
        </div>
        <div className="col1">&nbsp;</div>
        <div className={'col5'}>
          {right}
        </div>
      </div>
      <div className={'grid'} >
        <div className={'col11'}>
          <div className={'clearfix'} style={{paddingBottom: '30px', marginTop: '15px', marginLeft: '-15px'}}>
            <Button primary right  icon="save" loading={loading} onClick={buttonAction}>
              {buttonText || 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
};
export default BaseForm;