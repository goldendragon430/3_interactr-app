import React from 'react'
import {Option, TextInput} from "../../../../components/PropertyEditor";
import Button from "../../../../components/Buttons/Button";
import MessageBox from "../../../../components/MessageBox";
import gql from "graphql-tag";
import getAsset from "../../../../utils/getAsset";
import {useQuery} from "@apollo/client";
import {setUserAvatar} from "../../../../graphql/LocalState/userAvatar";
import { confirm } from '../../../../utils/alert';
import { useUserCommands } from '@/graphql/User/hooks';
import {toast} from 'react-toastify'
const QUERY = gql`
    query AuthUser {
        result: me {
            id
            avatar_url
        }
    }
`
 
const UserAvatar = () => {
 
  const {data, loading, error} = useQuery(QUERY);
	const { saveUser, updateUser } = useUserCommands();
  if(loading || error ) return null;

  const {id,avatar_url} = data.result;

  const userAvatar = avatar_url ? avatar_url : getAsset('/img/avatar-logo.png');
  const onRemove = ()=>{
    confirm({
      title: 'Are You Sure!',
      text: 'Are You Sure You Want To Remove This Avatar?',
      confirmButtonText: 'Yes, Remove It',
      onConfirm:  async() => {
        try{
         
          await saveUser({
            variables: {
              input: {
                id:id,
                avatar_url:'',
              },
            },
          });
          toast.success('Avatar has been changed successfully.', {
            position: 'top-right',
            theme:"colored"
          });
        } catch(err){
          console.log(err)
        }
      }
    })
  }
  return(
    <div className={'grid'}>
      <div className={'col6'}>
        <h3 className="form-heading">Avatar</h3>
        <div className={'form-option'}>
          <img src={userAvatar} style={{borderRadius: '10px', maxWidth: '300px', float: 'left', maxHeight: '200px'}}/>
          <div style = {{display:'grid',gap:10,height:50,width:190}} >
            <Button
              primary
              small
              onClick={()=>setUserAvatar({showUserAvatarModal: true})}
              style={{marginLeft:'15px', marginTop: '0px'}}
            >
              Change Avatar
            </Button>
            <Button
              red
              small
              style={{marginLeft:'15px', marginTop: '0px'}}
              onClick = {onRemove}
            >
              Remove Avatar
            </Button>
          </div>
        </div>
      </div>
      <div className={'col5'}>
        <MessageBox>
          <h3>Your Avatar</h3>
          <p>
            Whilst it's not required to upload a picture of yourself as the avatar we recommend doing this to make your Interactr account feel more personalised to you.
          </p>
          <p>Recommended size is 200px X 200px</p>
        </MessageBox>
      </div>
    </div>
  )
};
export default UserAvatar;