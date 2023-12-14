import React,{useState,useEffect} from 'react'
import styles from './DashboardPage.module.scss';
import getAsset from 'utils/getAsset';
import LinkButton from 'components/Buttons/LinkButton';
import {useQuery} from "@apollo/client";
import Icon from "../../../components/Icon";
import ErrorMessage from "../../../components/ErrorMessage";
import gql from "graphql-tag";
import {useAuthUser} from "../../../graphql/User/hooks";
import axios from 'axios'
const DashboardStorageCard = ()=>{
    
    const user = useAuthUser();
    const Total_mins = parseInt(user?.usage_plan?.streaming_mins)
    const Total_storage = parseFloat(user?.usage_plan?.upload_gb)
    const Total_storage_used = parseFloat(user?.used_plan?.used_storage/1024/1024).toFixed(2)
    const [Total_min_used,SetTotalMinUsed] = useState(0)
    
    async function checkMins(userId) {
        const now = new Date();
        const firstDayOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0));
        const lastDayOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59, 999));

        const queries = [
            {
                name: 'streaming_mins',
                collection: 'StreamingMins',
                api: 'Interactr',
                filters: {
                    user_id: userId
                },
                start_date: firstDayOfMonth,
                end_date: lastDayOfMonth,
                group_by: 'user_id'
            }
        ];
        const analytics_url = import.meta.env.VITE_ANALYTICS_URL;
        const analytics_key = import.meta.env.VITE_ANALYTICS_PROJECT_KEY;
        const path = 'query'
        const res = await axios.post(`${analytics_url}/api/${analytics_key}/${path}`, queries);
         
        SetTotalMinUsed(res?.data?.streaming_mins[userId]?res?.data?.streaming_mins[userId] : 0)
    }

    useEffect(()=>{
        if(user.id > 0) {
           
            checkMins(user.id)
        }
    },[user])

    return (
    <div className = {styles.storageCardWrapper}>
        <div className = "col4" style = {{display:'flex',justifyContent:'flex-start',alignItems:'center'}} >
            <img src = {getAsset('/img/time.svg')} className = {styles.storageCardImg}/>
            <div className = {styles.storageSubWrapper} >
                <div className = "col6">
                    <p className = {styles.storageSubTitle}  >Total Minutes</p>
                    <div style = {{display:'flex'}}> 
                        <h1 style = {{margin:0}}>{Math.floor(Total_mins/60)}</h1>
                        <p style = {{marginLeft:2}} >hr</p>
                        <h1 style = {{margin:0,marginLeft:10}}>{Total_mins%60}</h1>
                        <p style = {{marginLeft:2}}>min</p>
                    </div>
                </div>
                <div style= {{height:50,width:1,backgroundColor:'white',border:'none'}}/>
                    <div className = "col6" style = {{marginLeft:15}}>
                        <p className = {styles.storageSubTitle}>Total Minutes Used</p>
                        <div style = {{display:'flex'}}> 
                            <h1 style = {{margin:0}}>{Math.floor(Total_min_used/60)}</h1>
                            <p style = {{marginLeft:2}}>hr</p>
                            <h1 style = {{margin:0,marginLeft:10}}>{Total_min_used%60}</h1>
                            <p style = {{marginLeft:2}}>min</p>
                        </div>
                    </div>
                </div>
        </div>
        <div className = 'col4' style = {{display:'flex',justifyContent:'flex-start',alignItems:'center'}} >
            <img src = {getAsset('/img/storage.svg')} className = {styles.storageCardImg} />
            <div className = {styles.storageSubWrapper} >
                <div className = "col6">
                    <p className = {styles.storageSubTitle}  >Total Storage</p>
                    <div style = {{display:'flex'}}> 
                            <h1 style = {{margin:0}}>{Total_storage}</h1>
                            <p style = {{marginLeft:5}}>GB</p>                    
                    </div>
                </div>
                <div style= {{height:50,width:1,backgroundColor:'white',border:'none'}}/>
                    <div className = "col6" style = {{marginLeft:15}}>
                        <p className = {styles.storageSubTitle}>Total Storage Used</p>
                        <div style = {{display:'flex'}}> 
                            <h1 style = {{margin:0}}>{Total_storage_used}</h1>
                            <p style = {{marginLeft:5}}>GB</p>
                        </div>
                    </div>
                </div>
        </div>
        <div className = "col4" style = {{display:'flex',justifyContent:'flex-end',alignItems:'center'}}>
            <LinkButton secondary right icon={'arrow-up'} large style = {{height:45}} to={'/upgrade'} >Upgrade</LinkButton>
        </div>
    </div>)

}

export default  DashboardStorageCard;